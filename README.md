# Proyecto-Derecho — Servidor local

Este proyecto contiene archivos estáticos (`index.html`, `script.js`, `styles.css`, `assets/`, etc.).

Instrucciones rápidas para ejecutar localmente:

1. Instalar dependencias:

   ```powershell
   npm install
   ```

2. Iniciar el servidor:

   ```powershell
   npm start
   ```

3. Abrir en el navegador:

   http://localhost:3000

Notas:
- El servidor usa Express y sirve la carpeta raíz del proyecto como estática.
- Si quieres cambiar el puerto, establece la variable de entorno `PORT`, por ejemplo:
  ```powershell
  $env:PORT=4000; npm start
  ```
