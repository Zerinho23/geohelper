# Activación de GeoHelper

Esta edición de Windows usa la aplicación **GEOGUERS** de KeyAuth, Owner ID `7anpncFmp2`, versión de API de aplicación `1.0` y endpoint `https://keyauth.win/api/1.3/`. Estos datos identifican la aplicación; no son claves de administración.

En el panel de KeyAuth, selecciona GEOGUERS y crea las licencias con la suscripción y duración que necesites. Entrega cada licencia al usuario por tu canal de Discord. Si quieres limitar su uso al usuario de Windows que la activa, configura la comprobación de HWID en el panel. El cliente envía el SID del usuario de Windows, igual que los ejemplos oficiales de KeyAuth; no es una identificación física del ordenador.

Al abrir GeoHelper, el usuario introduce su licencia. La clave no se guarda en disco y se solicita de nuevo al reiniciar. No necesitas compartir Seller Key, secretos ni contraseñas. La validación se realiza en Rust y verifica la firma Ed25519 y la fecha de las respuestas antes de aceptar la sesión.

La conexión con el juego permanece detenida hasta la activación. La sesión se comprueba cada 30 segundos; si falla la conexión o KeyAuth rechaza la sesión, se detiene el acceso y se borran las coordenadas de la sesión. La caducidad de la suscripción también se comprueba localmente. Se requiere conexión a Internet.

Para probarlo antes de distribuir: crea una licencia de prueba, abre el instalador nuevo, activa la licencia y comprueba el acceso. Después revócala desde KeyAuth y verifica que la aplicación se bloquee. Prueba también una clave incorrecta y la pérdida de conexión. No se ha incluido ninguna licencia de prueba en el código.

El historial se descarga de este repositorio y las actualizaciones del instalador se distribuyen manualmente por [Discord](https://discord.gg/RBKzQvRQS7). Los enlaces visibles de GitHub apuntan al [perfil de Zerinho23](https://github.com/Zerinho23).

Referencia del protocolo: [ejemplo oficial de KeyAuth](https://github.com/KeyAuth/KeyAuth-Python-Example/blob/main/keyauth.py). Como cualquier aplicación ejecutada en un equipo del usuario, la comprobación local no impide que alguien modifique y recompile el cliente.
