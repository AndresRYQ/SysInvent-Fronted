# RolesApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarEstadoRol**](RolesApi.md#actualizarestadorol) | **DELETE** /api/roles | Actualizar estado del rol |
| [**actualizarRol**](RolesApi.md#actualizarroloperation) | **PUT** /api/roles | Actualizar rol |
| [**listarRoles**](RolesApi.md#listarroles) | **GET** /api/roles | Listar roles |
| [**registrarRol**](RolesApi.md#registrarrol) | **POST** /api/roles | Registrar rol |



## actualizarEstadoRol

> MessageResponse actualizarEstadoRol(rolId, activo)

Actualizar estado del rol

Activa o desactiva un rol

### Example

```ts
import {
  Configuration,
  RolesApi,
} from '';
import type { ActualizarEstadoRolRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RolesApi(config);

  const body = {
    // number
    rolId: 56,
    // boolean
    activo: true,
  } satisfies ActualizarEstadoRolRequest;

  try {
    const data = await api.actualizarEstadoRol(body);
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
| **rolId** | `number` |  | [Defaults to `undefined`] |
| **activo** | `boolean` |  | [Defaults to `undefined`] |

### Return type

[**MessageResponse**](MessageResponse.md)

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


## actualizarRol

> MessageResponse actualizarRol(actualizarRolRequest)

Actualizar rol

Actualiza el rol y sus módulos asociados

### Example

```ts
import {
  Configuration,
  RolesApi,
} from '';
import type { ActualizarRolOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RolesApi(config);

  const body = {
    // ActualizarRolRequest
    actualizarRolRequest: ...,
  } satisfies ActualizarRolOperationRequest;

  try {
    const data = await api.actualizarRol(body);
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
| **actualizarRolRequest** | [ActualizarRolRequest](ActualizarRolRequest.md) |  | |

### Return type

[**MessageResponse**](MessageResponse.md)

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


## listarRoles

> CustomPageRolResponse listarRoles(nombre, pagina, tamPagina)

Listar roles

Lista los roles registrados con paginación

### Example

```ts
import {
  Configuration,
  RolesApi,
} from '';
import type { ListarRolesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RolesApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarRolesRequest;

  try {
    const data = await api.listarRoles(body);
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
| **nombre** | `string` |  | [Optional] [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageRolResponse**](CustomPageRolResponse.md)

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


## registrarRol

> MessageResponse registrarRol(rolRequest)

Registrar rol

Registra un nuevo rol

### Example

```ts
import {
  Configuration,
  RolesApi,
} from '';
import type { RegistrarRolRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new RolesApi(config);

  const body = {
    // RolRequest
    rolRequest: ...,
  } satisfies RegistrarRolRequest;

  try {
    const data = await api.registrarRol(body);
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
| **rolRequest** | [RolRequest](RolRequest.md) |  | |

### Return type

[**MessageResponse**](MessageResponse.md)

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

