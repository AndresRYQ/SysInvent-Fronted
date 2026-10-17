# TiposDeDocumentoApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarTipoDocumento**](TiposDeDocumentoApi.md#actualizartipodocumento) | **PUT** /api/v1/catalogos/tipos-documento/{id} | Actualizar tipo de documento |
| [**cambiarEstadoTipoDocumento**](TiposDeDocumentoApi.md#cambiarestadotipodocumento) | **PUT** /api/v1/catalogos/tipos-documento/{id}/estado | Cambiar estado del tipo de documento |
| [**listarTiposDocumento**](TiposDeDocumentoApi.md#listartiposdocumento) | **GET** /api/v1/catalogos/tipos-documento | Listar tipos de documento |
| [**registrarTipoDocumento**](TiposDeDocumentoApi.md#registrartipodocumento) | **POST** /api/v1/catalogos/tipos-documento | Registrar tipo de documento |



## actualizarTipoDocumento

> MessageResponse actualizarTipoDocumento(id, tipoDocumentoRequest)

Actualizar tipo de documento

### Example

```ts
import {
  Configuration,
  TiposDeDocumentoApi,
} from '';
import type { ActualizarTipoDocumentoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TiposDeDocumentoApi(config);

  const body = {
    // number
    id: 56,
    // TipoDocumentoRequest
    tipoDocumentoRequest: ...,
  } satisfies ActualizarTipoDocumentoRequest;

  try {
    const data = await api.actualizarTipoDocumento(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |
| **tipoDocumentoRequest** | [TipoDocumentoRequest](TipoDocumentoRequest.md) |  | |

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


## cambiarEstadoTipoDocumento

> MessageResponse cambiarEstadoTipoDocumento(id, estadoCatalogoRequest)

Cambiar estado del tipo de documento

### Example

```ts
import {
  Configuration,
  TiposDeDocumentoApi,
} from '';
import type { CambiarEstadoTipoDocumentoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TiposDeDocumentoApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstadoTipoDocumentoRequest;

  try {
    const data = await api.cambiarEstadoTipoDocumento(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |
| **estadoCatalogoRequest** | [EstadoCatalogoRequest](EstadoCatalogoRequest.md) |  | |

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


## listarTiposDocumento

> CustomPageTipoDocumentoResponse listarTiposDocumento(nombre, pagina, tamPagina)

Listar tipos de documento

### Example

```ts
import {
  Configuration,
  TiposDeDocumentoApi,
} from '';
import type { ListarTiposDocumentoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TiposDeDocumentoApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarTiposDocumentoRequest;

  try {
    const data = await api.listarTiposDocumento(body);
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

[**CustomPageTipoDocumentoResponse**](CustomPageTipoDocumentoResponse.md)

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


## registrarTipoDocumento

> MessageResponse registrarTipoDocumento(tipoDocumentoRequest)

Registrar tipo de documento

### Example

```ts
import {
  Configuration,
  TiposDeDocumentoApi,
} from '';
import type { RegistrarTipoDocumentoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TiposDeDocumentoApi(config);

  const body = {
    // TipoDocumentoRequest
    tipoDocumentoRequest: ...,
  } satisfies RegistrarTipoDocumentoRequest;

  try {
    const data = await api.registrarTipoDocumento(body);
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
| **tipoDocumentoRequest** | [TipoDocumentoRequest](TipoDocumentoRequest.md) |  | |

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

