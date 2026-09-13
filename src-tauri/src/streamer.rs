use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager, WebviewWindow};

#[derive(Clone, Default, Serialize, Deserialize)]
pub struct Mode {
    enabled: bool,
    automatic: bool,
}
fn path(window: &WebviewWindow) -> Result<std::path::PathBuf, String> {
    window
        .path()
        .app_config_dir()
        .map(|p| p.join("streamer.json"))
        .map_err(|e| e.to_string())
}
#[tauri::command]
pub fn streamer_status(window: WebviewWindow) -> Result<Mode, String> {
    let p = path(&window)?;
    if !p.exists() {
        return Ok(Mode::default());
    }
    serde_json::from_slice(&std::fs::read(p).map_err(|e| e.to_string())?).map_err(|e| e.to_string())
}
#[tauri::command]
pub fn set_streamer_mode(
    window: WebviewWindow,
    enabled: bool,
    automatic: bool,
) -> Result<Mode, String> {
    window
        .set_content_protected(enabled)
        .map_err(|e| e.to_string())?;
    let mode = Mode { enabled, automatic };
    let p = path(&window)?;
    std::fs::create_dir_all(p.parent().unwrap()).map_err(|e| e.to_string())?;
    std::fs::write(p, serde_json::to_vec(&mode).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    let _ = window.emit("streamer-changed", &mode);
    Ok(mode)
}
pub fn restore(window: &WebviewWindow) -> Result<(), tauri::Error> {
    let mode = streamer_status(window.clone()).unwrap_or_default();
    window.set_content_protected(mode.enabled)?;
    let window = window.clone();
    tauri::async_runtime::spawn(async move {
        loop {
            tokio::time::sleep(std::time::Duration::from_secs(5)).await;
            let mode = streamer_status(window.clone()).unwrap_or_default();
            if mode.automatic && !mode.enabled {
                let mut system = sysinfo::System::new();
                system.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
                let detected = system.processes().values().any(|p| {
                    let name = p.name().to_string_lossy().to_ascii_lowercase();
                    name == "obs64.exe"
                        || name == "obs32.exe"
                        || name == "streamlabs desktop.exe"
                        || name == "streamlabs obs.exe"
                });
                if detected {
                    let _ = set_streamer_mode(window.clone(), true, true);
                }
            }
        }
    });
    Ok(())
}
