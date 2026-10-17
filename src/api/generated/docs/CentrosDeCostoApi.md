# CentrosDeCostoApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarCentroCosto**](CentrosDeCostoApi.md#actualizarcentrocosto) | **PUT** /api/v1/catalogos/centros-costo/{id} | Actualizar centro de costo |
| [**cambiarEstadoCentroCosto**](CentrosDeCostoApi.md#cambiarestadocentrocosto) | **PUT** /api/v1/catalogos/centros-costo/{id}/estado | Cambiar estado del centro de costo |
| [**listarCentrosCosto**](CentrosDeCostoApi.md#listarcentroscosto) | **GET** /api/v1/catalogos/centros-costo | Listar centros de costo |
| [**registrarCentroCosto**](CentrosDeCostoApi.md#registrarcentrocosto) | **POST** /api/v1/catalogos/centros-costo | Registrar centro de costo |



## actualizarCentroCosto

> MessageResponse actualizarCentroCosto(id, centroCostoRequest)

Actualizar centro de costo

### Example

```ts
import {
  Configuration,
  CentrosDeCostoApi,
} from '';
import type { ActualizarCentroCostoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentrosDeCostoApi(config);

  const body = {
    // number
    id: 56,
    // CentroCostoRequest
    centroCostoRequest: ...,
  } satisfies ActualizarCentroCostoRequest;

  try {
    const data = await api.actualizarCentroCosto(body);
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
| **centroCostoRequest** | [CentroCostoRequest](CentroCostoRequest.md) |  | |

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


## cambiarEstadoCentroCosto

> MessageResponse cambiarEstadoCentroCosto(id, estadoCatalogoRequest)

Cambiar estado del centro de costo

### Example

```ts
import {
  Configuration,
  CentrosDeCostoApi,
} from '';
import type { CambiarEstadoCentroCostoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentrosDeCostoApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstadoCentroCostoRequest;

  try {
    const data = await api.cambiarEstadoCentroCosto(body);
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


## listarCentrosCosto

> CustomPageCentroCostoResponse listarCentrosCosto(nombre, pagina, tamPagina)

Listar centros de costo

### Example

```ts
import {
  Configuration,
  CentrosDeCostoApi,
} from '';
import type { ListarCentrosCostoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentrosDeCostoApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarCentrosCostoRequest;

  try {
    const data = await api.listarCentrosCosto(body);
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

[**CustomPageCentroCostoResponse**](CustomPageCentroCostoResponse.md)

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


## registrarCentroCosto

> MessageResponse registrarCentroCosto(centroCostoRequest)

Registrar centro de costo

### Example

```ts
import {
  Configuration,
  CentrosDeCostoApi,
} from '';
import type { RegistrarCentroCostoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentrosDeCostoApi(config);

  const body = {
    // CentroCostoRequest
    centroCostoRequest: ...,
  } satisfies RegistrarCentroCostoRequest;

  try {
    const data = await api.registrarCentroCosto(body);
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
| **centroCostoRequest** | [CentroCostoRequest](CentroCostoRequest.md) |  | |

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

