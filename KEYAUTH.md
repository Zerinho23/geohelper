# Cuentas de GeoHelper

La aplicación usa KeyAuth **GEOGUERS**, Owner ID `7anpncFmp2`, versión de aplicación KeyAuth `1.0` y API `https://keyauth.win/api/1.3/`.

## Primer acceso

Pulsa **Regístrate** e introduce usuario, contraseña, confirmación de contraseña y una licencia vigente. KeyAuth crea la cuenta y vincula la licencia a ese usuario. Las siguientes veces se inicia sesión únicamente con usuario y contraseña; el formulario de inicio de sesión no envía ninguna licencia.

Si ya usaste una licencia en la edición anterior que solo pedía claves, puede estar asociada a un usuario creado por KeyAuth. Comprueba esa cuenta en el panel antes de intentar registrar la misma licencia. No se migran ni restablecen cuentas automáticamente.

## Recordarme

La opción **Recordarme** conserva usuario y contraseña en el Administrador de credenciales de Windows, bajo `GeoHelper.GEOGUERS`. La contraseña no se guarda en los ajustes de la app ni se devuelve a la interfaz: Rust la recupera cuando pulsas Entrar. La app muestra el usuario recordado y un aviso en el campo de contraseña.

**Olvidar cuenta** elimina los datos locales guardados. Entrar con Recordarme desactivado también los elimina después de una autenticación correcta. **Cerrar sesión**, en Ajustes, termina el acceso actual y conserva los datos recordados para el próximo acceso. Cerrar la app también requiere volver a pulsar Entrar cuando la abras.

## Licencias y comprobación

Crea las licencias con la duración y suscripción que necesites en tu panel de KeyAuth. La licencia sigue sujeta a caducidad y revocación aunque no se vuelva a pedir en el login. La app requiere Internet y comprueba periódicamente la sesión. Si falla la validación, se detiene la conexión con el juego.

El cliente verifica las firmas Ed25519 de KeyAuth y envía el SID del usuario de Windows como HWID. Configura en el panel la política de HWID que quieras aplicar. No incluyas Seller Key, secretos ni contraseñas de administración en el código.

Para la prueba final, registra una cuenta con una licencia de prueba, cierra la aplicación, vuelve a entrar con los datos guardados y prueba Olvidar cuenta y Cerrar sesión. No se han creado cuentas ni consumido licencias durante las pruebas automáticas.

Referencias: [protocolo oficial de KeyAuth](https://github.com/KeyAuth/KeyAuth-Python-Example/blob/main/keyauth.py), [almacenamiento de credenciales](https://docs.rs/keyring/3.6.3/keyring/).
