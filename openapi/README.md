# Contratos OpenAPI

Coloca aquí el contrato OpenAPI del backend con el nombre `api.json`.

Después ejecuta:

```powershell
npm run openapi:generate
```

El cliente tipado se generará automáticamente en `src/api/generated`.

No edites manualmente los archivos generados. Si cambia el contrato del backend,
reemplaza `api.json` y vuelve a ejecutar el comando.

La URL base se selecciona por entorno:

- Desarrollo (`npm run dev`): `http://localhost:8080`.
- Produccion (`npm run build` / Render): `https://sysinvent-backend.onrender.com`.

Los clientes generados deben configurarse usando `apiConfiguration` desde
`src/api/client.ts`.
