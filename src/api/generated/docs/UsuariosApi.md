# UsuariosApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarEstadoUsuario**](UsuariosApi.md#actualizarestadousuario) | **DELETE** /api/usuarios | Actualizar estado del usuario |
| [**actualizarUsuario**](UsuariosApi.md#actualizarusuariooperation) | **PUT** /api/usuarios | Actualizar usuario |
| [**listarUsuarios**](UsuariosApi.md#listarusuarios) | **GET** /api/usuarios | Listar usuarios |
| [**obtenerPerfil**](UsuariosApi.md#obtenerperfil) | **GET** /api/usuarios/perfil | Obtener perfil del usuario autenticado |
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


## listarUsuarios

> CustomPageUsuarioResponse listarUsuarios(usuario, rol, estado, pagina, tamPagina)

Listar usuarios

Lista los usuarios registrados con paginación

### Example

```ts
import {
  Configuration,
  UsuariosApi,
} from '';
import type { ListarUsuariosRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsuariosApi(config);

  const body = {
    // string (optional)
    usuario: usuario_example,
    // string (optional)
    rol: rol_example,
    // boolean (optional)
    estado: true,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarUsuariosRequest;

  try {
    const data = await api.listarUsuarios(body);
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
| **usuario** | `string` |  | [Optional] [Defaults to `undefined`] |
| **rol** | `string` |  | [Optional] [Defaults to `undefined`] |
| **estado** | `boolean` |  | [Optional] [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageUsuarioResponse**](CustomPageUsuarioResponse.md)

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


## obtenerPerfil

> UsuarioResponse obtenerPerfil()

Obtener perfil del usuario autenticado

### Example

```ts
import {
  Configuration,
  UsuariosApi,
} from '';
import type { ObtenerPerfilRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsuariosApi(config);

  try {
    const data = await api.obtenerPerfil();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**UsuarioResponse**](UsuarioResponse.md)

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


## registrarUsuario

> object registrarUsuario(usuarioRequest)

Registrar usuario

Registra un usuario con una contraseña proporcionada

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

