use ed25519_dalek::{Signature, VerifyingKey};
use parking_lot::Mutex;
use serde_json::Value;
use std::sync::Arc;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Emitter, State};

const API: &str = "https://keyauth.win/api/1.3/";
const NAME: &str = "GEOGUERS";
const OWNER: &str = "7anpncFmp2";
const VERSION: &str = "1.0";
// Public response-verification key published in KeyAuth's official SDK.
const PUBLIC_KEY: &str = "5586b4bc69c7a4b487e4563a4cd96afd39140f919bd31cea7d1c6a1e8439422b";

#[derive(Clone)]
struct Session {
    id: String,
    username: String,
    subscription: String,
    expiry: u64,
    checked: Instant,
}
#[derive(Default)]
pub struct Auth {
    session: Mutex<Option<Session>>,
    activation: tokio::sync::Mutex<()>,
}
pub type SharedAuth = Arc<Auth>;

#[derive(Clone, serde::Serialize)]
pub struct AuthProfile {
    pub username: String,
    pub subscription: String,
    pub expiry: u64,
}

fn now() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}
impl Auth {
    pub fn allowed(&self) -> bool {
        self.session
            .lock()
            .as_ref()
            .is_some_and(|s| s.expiry > now() && s.checked.elapsed() < Duration::from_secs(60))
    }

    pub fn profile(&self) -> Option<AuthProfile> {
        self.session.lock().as_ref().map(|s| AuthProfile {
            username: s.username.clone(),
            subscription: s.subscription.clone(),
            expiry: s.expiry,
        })
    }
}

fn verify(body: &[u8], signature: &str, timestamp: &str, clock: u64) -> Result<(), String> {
    let time = timestamp
        .parse::<u64>()
        .map_err(|_| "Fecha de respuesta inválida")?;
    if clock.abs_diff(time) > 25 {
        return Err("Comprueba la fecha y hora de Windows e inténtalo otra vez.".into());
    }
    let key: [u8; 32] = hex::decode(PUBLIC_KEY).unwrap().try_into().unwrap();
    let signature = hex::decode(signature).map_err(|_| "Firma inválida")?;
    let signature = Signature::from_slice(&signature).map_err(|_| "Firma inválida")?;
    let mut message = timestamp.as_bytes().to_vec();
    message.extend_from_slice(body);
    VerifyingKey::from_bytes(&key)
        .map_err(|_| "Clave de verificación inválida")?
        .verify_strict(&message, &signature)
        .map_err(|_| "No se pudo verificar la respuesta de KeyAuth.".into())
}

async fn request(mut fields: Vec<(&str, String)>) -> Result<Value, String> {
    fields.push(("name", NAME.into()));
    fields.push(("ownerid", OWNER.into()));
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(10))
        .redirect(reqwest::redirect::Policy::none())
        .build()
        .map_err(|_| "No se pudo iniciar la conexión")?;
    let res = client.post(API).form(&fields).send().await.map_err(|_| {
        "No se pudo conectar a KeyAuth. Comprueba tu conexión e inténtalo otra vez."
    })?;
    if !res.status().is_success() {
        return Err("KeyAuth no está disponible. Inténtalo de nuevo.".into());
    }
    let signature = res
        .headers()
        .get("x-signature-ed25519")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_owned();
    let timestamp = res
        .headers()
        .get("x-signature-timestamp")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("")
        .to_owned();
    let body = res.bytes().await.map_err(|_| "Respuesta incompleta")?;
    verify(&body, &signature, &timestamp, now())?;
    let value: Value =
        serde_json::from_slice(&body).map_err(|_| "Respuesta de KeyAuth inválida")?;
    if value["success"].as_bool() != Some(true) {
        return Err(value["message"]
            .as_str()
            .unwrap_or("KeyAuth rechazó la solicitud.")
            .chars()
            .take(240)
            .collect());
    }
    Ok(value)
}

fn expiry(value: &Value) -> Result<u64, String> {
    value["info"]["subscriptions"]
        .as_array()
        .into_iter()
        .flatten()
        .filter_map(|s| {
            s["expiry"]
                .as_u64()
                .or_else(|| s["expiry"].as_str()?.parse().ok())
        })
        .filter(|t| *t > now())
        .max()
        .ok_or("La licencia no tiene una suscripción vigente.".into())
}

fn hwid() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        let output = std::process::Command::new("C:\\Windows\\System32\\whoami.exe")
            .args(["/user", "/fo", "csv", "/nh"])
            .creation_flags(0x08000000)
            .output()
            .map_err(|_| "No se pudo identificar el usuario de Windows")?;
        let text = String::from_utf8_lossy(&output.stdout);
        let sid = text
            .split('"')
            .find(|part| part.starts_with("S-1-"))
            .ok_or("No se pudo identificar el usuario de Windows")?;
        return Ok(sid.to_owned());
    }
    #[cfg(not(target_os = "windows"))]
    Err("Esta edición con licencia está preparada para Windows.".into())
}

#[tauri::command]
pub fn auth_status(auth: State<'_, SharedAuth>) -> bool {
    auth.allowed()
}

#[tauri::command]
pub fn auth_profile(auth: State<'_, SharedAuth>) -> Option<AuthProfile> {
    auth.profile()
}

#[derive(serde::Serialize, serde::Deserialize)]
struct Credentials {
    username: String,
    password: String,
}

fn credential_entry() -> Result<keyring::Entry, String> {
    if !cfg!(target_os = "windows") {
        return Err("Recordarme requiere Windows.".into());
    }
    keyring::Entry::new("GeoHelper.GEOGUERS", "remembered-account")
        .map_err(|_| "No se pudo acceder al almacén seguro de Windows.".into())
}
fn read_credentials() -> Result<Option<Credentials>, String> {
    match credential_entry()?.get_password() {
        Ok(value) => serde_json::from_str(&value)
            .map(Some)
            .map_err(|_| "Los datos guardados no son válidos. Usa Olvidar cuenta.".into()),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(_) => Err("No se pudieron leer los datos guardados en Windows.".into()),
    }
}
fn remove_credentials() -> Result<(), String> {
    match credential_entry()?.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(_) => Err("No se pudieron borrar los datos guardados.".into()),
    }
}
#[tauri::command]
pub async fn remembered_account(auth: State<'_, SharedAuth>) -> Result<Option<String>, String> {
    let _guard = auth.activation.lock().await;
    Ok(read_credentials()?.map(|c| c.username))
}
#[tauri::command]
pub async fn forget_account(auth: State<'_, SharedAuth>) -> Result<(), String> {
    let _guard = auth.activation.lock().await;
    remove_credentials()
}

fn account_fields(
    username: &str,
    password: &str,
    key: Option<&str>,
) -> Result<Vec<(&'static str, String)>, String> {
    if username.trim().is_empty()
        || username.len() > 128
        || password.is_empty()
        || password.len() > 256
    {
        return Err("Introduce un usuario y una contraseña válidos.".into());
    }
    let mut fields = vec![
        (
            "type",
            if key.is_some() { "register" } else { "login" }.into(),
        ),
        ("username", username.trim().into()),
        ("pass", password.into()),
    ];
    if let Some(key) = key {
        if key.trim().is_empty() || key.len() > 256 {
            return Err("Introduce la licencia para crear tu cuenta.".into());
        }
        fields.push(("key", key.trim().into()));
    }
    Ok(fields)
}

#[tauri::command]
pub async fn authenticate_account(
    username: String,
    password: String,
    key: Option<String>,
    remember: bool,
    use_saved: bool,
    auth: State<'_, SharedAuth>,
) -> Result<Option<String>, String> {
    let _guard = auth.activation.lock().await;
    if auth.allowed() {
        return Ok(None);
    }
    let username = username.trim().to_owned();
    let password = if use_saved && key.is_none() {
        let saved = read_credentials()?
            .filter(|c| c.username == username)
            .ok_or("Introduce tu contraseña.")?;
        saved.password
    } else {
        password
    };
    let mut fields = account_fields(&username, &password, key.as_deref())?;
    let device = hwid()?;
    let init = request(vec![("type", "init".into()), ("ver", VERSION.into())]).await?;
    let id = init["sessionid"]
        .as_str()
        .filter(|s| !s.is_empty())
        .ok_or("Sesión inválida")?
        .to_owned();
    fields.push(("hwid", device));
    fields.push(("sessionid", id.clone()));
    let result = request(fields).await?;
    let expiry = expiry(&result)?;
    let subscription = result["info"]["subscriptions"]
        .as_array().and_then(|items| items.first())
        .and_then(|item| item["subscription"].as_str())
        .unwrap_or("GeoHelper").to_owned();
    let saved = if remember {
        let value = serde_json::to_string(&Credentials { username: username.clone(), password })
            .map_err(|_| "No se pudo guardar la cuenta")?;
        credential_entry().and_then(|e| {
            e.set_password(&value)
                .map_err(|_| "No se pudo guardar la contraseña en Windows.".into())
        })
    } else {
        remove_credentials()
    };
    *auth.session.lock() = Some(Session {
        id,
        username,
        subscription,
        expiry,
        checked: Instant::now(),
    });
    Ok(saved.err())
}

#[tauri::command]
pub async fn logout_account(app: AppHandle, auth: State<'_, SharedAuth>) -> Result<(), String> {
    let _guard = auth.activation.lock().await;
    let old = auth.session.lock().take();
    let _ = app.emit("auth-logout", ());
    if let Some(session) = old {
        // Local access ends even if the server is unreachable.
        let _ = request(vec![("type", "logout".into()), ("sessionid", session.id)]).await;
    }
    Ok(())
}

pub async fn supervise(app: AppHandle, state: crate::state::Shared, auth: SharedAuth) {
    loop {
        while !auth.allowed() {
            tokio::time::sleep(Duration::from_millis(250)).await;
        }
        let Some(session_id) = auth.session.lock().as_ref().map(|s| s.id.clone()) else {
            continue;
        };
        let monitor = async {
            loop {
                tokio::time::sleep(Duration::from_secs(1)).await;
                if !auth.allowed()
                    || auth.session.lock().as_ref().map(|s| &s.id) != Some(&session_id)
                {
                    break;
                }
                let session = auth.session.lock().clone();
                if let Some(session) = session {
                    if session.checked.elapsed() >= Duration::from_secs(30) {
                        if request(vec![("type", "check".into()), ("sessionid", session.id)])
                            .await
                            .is_err()
                        {
                            break;
                        }
                        if let Some(s) = auth.session.lock().as_mut() {
                            if s.id == session_id {
                                s.checked = Instant::now();
                            }
                        }
                    }
                }
            }
        };
        tokio::select! { _ = crate::cdp::run(app.clone(), state.clone()) => {}, _ = monitor => {} }
        let _guard = auth.activation.lock().await;
        let same_session = auth
            .session
            .lock()
            .as_ref()
            .is_some_and(|s| s.id == session_id);
        if same_session {
            *auth.session.lock() = None;
        }
        state.clear_history();
        state.set_conn(crate::state::ConnState::Idle);
        let _ = app.emit("state", state.snapshot());
        if same_session {
            let _ = app.emit("auth-expired", ());
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn login_never_sends_a_license() {
        let fields = account_fields(" player ", "password", None).unwrap();
        assert!(fields.contains(&("type", "login".into())));
        assert!(fields.contains(&("username", "player".into())));
        assert!(!fields.iter().any(|(name, _)| *name == "key"));
    }
    #[test]
    fn registration_requires_license_and_credentials() {
        assert!(account_fields("player", "password", Some("")).is_err());
        assert!(account_fields("", "password", Some("license")).is_err());
        assert!(account_fields("player", "", Some("license")).is_err());
        let fields = account_fields("player", "password", Some("license")).unwrap();
        assert!(fields.contains(&("type", "register".into())));
        assert!(fields.contains(&("key", "license".into())));
    }
    #[cfg(target_os = "windows")]
    #[test]
    fn windows_credential_roundtrip() {
        let entry = keyring::Entry::new(
            "GeoHelper.Tests",
            &format!("roundtrip-{}", std::process::id()),
        )
        .unwrap();
        entry.set_password("synthetic-test-password").unwrap();
        let read = entry.get_password();
        entry.delete_credential().unwrap();
        assert_eq!(read.unwrap(), "synthetic-test-password");
        assert!(matches!(entry.get_password(), Err(keyring::Error::NoEntry)));
    }
    #[test]
    fn starts_locked() {
        assert!(!Auth::default().allowed());
    }
    #[test]
    fn expired_and_unchecked_sessions_are_locked() {
        let auth = Auth::default();
        *auth.session.lock() = Some(Session {
            id: "test".into(),
            username: "test".into(),
            subscription: "test".into(),
            expiry: now() - 1,
            checked: Instant::now(),
        });
        assert!(!auth.allowed());
        *auth.session.lock() = Some(Session {
            id: "test".into(),
            username: "test".into(),
            subscription: "test".into(),
            expiry: now() + 1000,
            checked: Instant::now() - Duration::from_secs(61),
        });
        assert!(!auth.allowed());
    }
    #[tokio::test]
    #[ignore = "Contacts the configured KeyAuth application; does not consume a license"]
    async fn live_init() {
        let result = request(vec![("type", "init".into()), ("ver", VERSION.into())]).await;
        assert!(result.is_ok(), "KeyAuth init failed: {:?}", result.err());
    }
    #[test]
    fn rejects_forgery_and_stale_response() {
        assert!(verify(b"{\"success\":true}", &"00".repeat(64), "100", 100).is_err());
        assert!(verify(b"{}", "", "100", 126).is_err());
        assert!(verify(b"{}", "", "200", 100).is_err());
    }
    #[test]
    fn rejects_missing_or_expired_subscription() {
        assert!(expiry(&serde_json::json!({"info":{"subscriptions":[{"expiry":"1"}]}})).is_err());
        assert!(expiry(&serde_json::json!({"success":true})).is_err());
    }
}
