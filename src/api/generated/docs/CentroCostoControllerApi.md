# CentroCostoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar3**](CentroCostoControllerApi.md#actualizar3) | **PUT** /api/v1/catalogos/centros-costo/{id} |  |
| [**cambiarEstado3**](CentroCostoControllerApi.md#cambiarestado3) | **PUT** /api/v1/catalogos/centros-costo/{id}/estado |  |
| [**crear3**](CentroCostoControllerApi.md#crear3) | **POST** /api/v1/catalogos/centros-costo |  |
| [**desactivar3**](CentroCostoControllerApi.md#desactivar3) | **DELETE** /api/v1/catalogos/centros-costo/{id} |  |
| [**listar3**](CentroCostoControllerApi.md#listar3) | **GET** /api/v1/catalogos/centros-costo |  |
| [**obtener3**](CentroCostoControllerApi.md#obtener3) | **GET** /api/v1/catalogos/centros-costo/{id} |  |



## actualizar3

> MessageResponse actualizar3(id, centroCostoRequest)



### Example

```ts
import {
  Configuration,
  CentroCostoControllerApi,
} from '';
import type { Actualizar3Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentroCostoControllerApi(config);

  const body = {
    // number
    id: 56,
    // CentroCostoRequest
    centroCostoRequest: ...,
  } satisfies Actualizar3Request;

  try {
    const data = await api.actualizar3(body);
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


## cambiarEstado3

> MessageResponse cambiarEstado3(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CentroCostoControllerApi,
} from '';
import type { CambiarEstado3Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentroCostoControllerApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstado3Request;

  try {
    const data = await api.cambiarEstado3(body);
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


## crear3

> MessageResponse crear3(centroCostoRequest)



### Example

```ts
import {
  Configuration,
  CentroCostoControllerApi,
} from '';
import type { Crear3Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentroCostoControllerApi(config);

  const body = {
    // CentroCostoRequest
    centroCostoRequest: ...,
  } satisfies Crear3Request;

  try {
    const data = await api.crear3(body);
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


## desactivar3

> MessageResponse desactivar3(id)



### Example

```ts
import {
  Configuration,
  CentroCostoControllerApi,
} from '';
import type { Desactivar3Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentroCostoControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies Desactivar3Request;

  try {
    const data = await api.desactivar3(body);
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


## listar3

> CustomPageCentroCostoResponse listar3(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  CentroCostoControllerApi,
} from '';
import type { Listar3Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentroCostoControllerApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies Listar3Request;

  try {
    const data = await api.listar3(body);
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


## obtener3

> MessageResponse obtener3(id)



### Example

```ts
import {
  Configuration,
  CentroCostoControllerApi,
} from '';
import type { Obtener3Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CentroCostoControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies Obtener3Request;

  try {
    const data = await api.obtener3(body);
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

