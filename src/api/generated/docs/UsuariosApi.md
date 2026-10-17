# UsuariosApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarEstadoUsuario**](UsuariosApi.md#actualizarestadousuario) | **DELETE** /api/usuarios/estado | Actualizar estado del usuario |
| [**actualizarUsuario**](UsuariosApi.md#actualizarusuariooperation) | **PUT** /api/usuarios | Actualizar usuario |
| [**registrarUsuario**](UsuariosApi.md#registrarusuario) | **POST** /api/usuarios | Registrar usuario |



## actualizarEstadoUsuario

> object actualizarEstadoUsuario(idUsuario, activo)

Actualizar estado del usuario

Activa o desactiva un usuario

### Example

```ts
import {
  Configuration,
  UsuariosApi,
} from '';
import type { ActualizarEstadoUsuarioRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsuariosApi(config);

  const body = {
    // number
    idUsuario: 56,
    // boolean
    activo: true,
  } satisfies ActualizarEstadoUsuarioRequest;

  try {
    const data = await api.actualizarEstadoUsuario(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **idUsuario** | `number` |  | [Defaults to `undefined`] |
| **activo** | `boolean` |  | [Defaults to `undefined`] |

### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## actualizarUsuario

> object actualizarUsuario(actualizarUsuarioRequest)

Actualizar usuario

Actualiza los datos personales del usuario

### Example

```ts
import {
  Configuration,
  UsuariosApi,
} from '';
import type { ActualizarUsuarioOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsuariosApi(config);

  const body = {
    // ActualizarUsuarioRequest
    actualizarUsuarioRequest: ...,
  } satisfies ActualizarUsuarioOperationRequest;

  try {
    const data = await api.actualizarUsuario(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **actualizarUsuarioRequest** | [ActualizarUsuarioRequest](ActualizarUsuarioRequest.md) |  | |

### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## registrarUsuario

> object registrarUsuario(usuarioRequest)

Registrar usuario

Registra un usuario con una contraseña generada

### Example

```ts
import {
  Configuration,
  UsuariosApi,
} from '';
import type { RegistrarUsuarioRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsuariosApi(config);

  const body = {
    // UsuarioRequest
    usuarioRequest: ...,
  } satisfies RegistrarUsuarioRequest;

  try {
    const data = await api.registrarUsuario(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **usuarioRequest** | [UsuarioRequest](UsuarioRequest.md) |  | |

### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

