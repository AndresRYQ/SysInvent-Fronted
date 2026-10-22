# UnidadMedidaControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar**](UnidadMedidaControllerApi.md#actualizar) | **PUT** /api/v1/catalogos/unidades-medida/{id} |  |
| [**cambiarEstado**](UnidadMedidaControllerApi.md#cambiarestado) | **PUT** /api/v1/catalogos/unidades-medida/{id}/estado |  |
| [**crear**](UnidadMedidaControllerApi.md#crear) | **POST** /api/v1/catalogos/unidades-medida |  |
| [**desactivar**](UnidadMedidaControllerApi.md#desactivar) | **DELETE** /api/v1/catalogos/unidades-medida/{id} |  |
| [**listar**](UnidadMedidaControllerApi.md#listar) | **GET** /api/v1/catalogos/unidades-medida |  |
| [**obtener**](UnidadMedidaControllerApi.md#obtener) | **GET** /api/v1/catalogos/unidades-medida/{id} |  |



## actualizar

> MessageResponse actualizar(id, unidadMedidaRequest)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { ActualizarRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadMedidaControllerApi(config);

  const body = {
    // number
    id: 56,
    // UnidadMedidaRequest
    unidadMedidaRequest: ...,
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
| **unidadMedidaRequest** | [UnidadMedidaRequest](UnidadMedidaRequest.md) |  | |

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


## cambiarEstado

> MessageResponse cambiarEstado(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { CambiarEstadoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadMedidaControllerApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstadoRequest;

  try {
    const data = await api.cambiarEstado(body);
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


## crear

> MessageResponse crear(unidadMedidaRequest)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { CrearRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadMedidaControllerApi(config);

  const body = {
    // UnidadMedidaRequest
    unidadMedidaRequest: ...,
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
| **unidadMedidaRequest** | [UnidadMedidaRequest](UnidadMedidaRequest.md) |  | |

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


## desactivar

> MessageResponse desactivar(id)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { DesactivarRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadMedidaControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies DesactivarRequest;

  try {
    const data = await api.desactivar(body);
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


## listar

> CustomPageUnidadMedidaResponse listar(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { ListarRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadMedidaControllerApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
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
| **nombre** | `string` |  | [Optional] [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageUnidadMedidaResponse**](CustomPageUnidadMedidaResponse.md)

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

> MessageResponse obtener(id)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { ObtenerRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadMedidaControllerApi(config);

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

