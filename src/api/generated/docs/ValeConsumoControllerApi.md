# ValeConsumoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar**](ValeConsumoControllerApi.md#actualizar) | **PUT** /api/vales-consumo/{id} |  |
| [**anular**](ValeConsumoControllerApi.md#anular) | **PATCH** /api/vales-consumo/{id}/anular |  |
| [**crear**](ValeConsumoControllerApi.md#crear) | **POST** /api/vales-consumo |  |
| [**listar**](ValeConsumoControllerApi.md#listar) | **GET** /api/vales-consumo |  |
| [**obtener**](ValeConsumoControllerApi.md#obtener) | **GET** /api/vales-consumo/{id} |  |



## actualizar

> object actualizar(id, valeConsumoRequest)



### Example

```ts
import {
  Configuration,
  ValeConsumoControllerApi,
} from '';
import type { ActualizarRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ValeConsumoControllerApi(config);

  const body = {
    // number
    id: 56,
    // ValeConsumoRequest
    valeConsumoRequest: ...,
  } satisfies ActualizarRequest;

  try {
    const data = await api.actualizar(body);
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
| **valeConsumoRequest** | [ValeConsumoRequest](ValeConsumoRequest.md) |  | |

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


## anular

> object anular(id)



### Example

```ts
import {
  Configuration,
  ValeConsumoControllerApi,
} from '';
import type { AnularRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ValeConsumoControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies AnularRequest;

  try {
    const data = await api.anular(body);
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


## crear

> object crear(valeConsumoRequest)



### Example

```ts
import {
  Configuration,
  ValeConsumoControllerApi,
} from '';
import type { CrearRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ValeConsumoControllerApi(config);

  const body = {
    // ValeConsumoRequest
    valeConsumoRequest: ...,
  } satisfies CrearRequest;

  try {
    const data = await api.crear(body);
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
| **valeConsumoRequest** | [ValeConsumoRequest](ValeConsumoRequest.md) |  | |

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


## listar

> CustomPageValeConsumoListadoResponse listar(busqueda, centroCostoId, estado, fechaDesde, fechaHasta, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  ValeConsumoControllerApi,
} from '';
import type { ListarRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ValeConsumoControllerApi(config);

  const body = {
    // string (optional)
    busqueda: busqueda_example,
    // number (optional)
    centroCostoId: 56,
    // string (optional)
    estado: estado_example,
    // Date (optional)
    fechaDesde: 2013-10-20,
    // Date (optional)
    fechaHasta: 2013-10-20,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarRequest;

  try {
    const data = await api.listar(body);
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
| **busqueda** | `string` |  | [Optional] [Defaults to `undefined`] |
| **centroCostoId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **estado** | `string` |  | [Optional] [Defaults to `undefined`] |
| **fechaDesde** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **fechaHasta** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageValeConsumoListadoResponse**](CustomPageValeConsumoListadoResponse.md)

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


## obtener

> object obtener(id)



### Example

```ts
import {
  Configuration,
  ValeConsumoControllerApi,
} from '';
import type { ObtenerRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ValeConsumoControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ObtenerRequest;

  try {
    const data = await api.obtener(body);
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

