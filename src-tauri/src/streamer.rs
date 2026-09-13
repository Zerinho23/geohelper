use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager, WebviewWindow};

#[derive(Clone, Default, Serialize, Deserialize)]
pub struct Mode {
    enabled: bool,
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
pub fn set_streamer_mode(window: WebviewWindow, enabled: bool) -> Result<Mode, String> {
    window
        .set_content_protected(enabled)
        .map_err(|e| e.to_string())?;
    let mode = Mode { enabled };
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
    Ok(())
}
