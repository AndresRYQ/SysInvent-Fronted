# UnidadMedidaControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar1**](UnidadMedidaControllerApi.md#actualizar1) | **PUT** /api/v1/catalogos/unidades-medida/{id} |  |
| [**cambiarEstado**](UnidadMedidaControllerApi.md#cambiarestado) | **PUT** /api/v1/catalogos/unidades-medida/{id}/estado |  |
| [**crear1**](UnidadMedidaControllerApi.md#crear1) | **POST** /api/v1/catalogos/unidades-medida |  |
| [**desactivar**](UnidadMedidaControllerApi.md#desactivar) | **DELETE** /api/v1/catalogos/unidades-medida/{id} |  |
| [**listar1**](UnidadMedidaControllerApi.md#listar1) | **GET** /api/v1/catalogos/unidades-medida |  |
| [**obtener1**](UnidadMedidaControllerApi.md#obtener1) | **GET** /api/v1/catalogos/unidades-medida/{id} |  |



## actualizar1

> object actualizar1(id, unidadMedidaRequest)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { Actualizar1Request } from '';

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
  } satisfies Actualizar1Request;

  try {
    const data = await api.actualizar1(body);
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


## cambiarEstado

> object cambiarEstado(id, estadoCatalogoRequest)



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


## crear1

> object crear1(unidadMedidaRequest)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { Crear1Request } from '';

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
  } satisfies Crear1Request;

  try {
    const data = await api.crear1(body);
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


## desactivar

> object desactivar(id)



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


## listar1

> CustomPageUnidadMedidaResponse listar1(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { Listar1Request } from '';

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
  } satisfies Listar1Request;

  try {
    const data = await api.listar1(body);
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


## obtener1

> object obtener1(id)



### Example

```ts
import {
  Configuration,
  UnidadMedidaControllerApi,
} from '';
import type { Obtener1Request } from '';

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
  } satisfies Obtener1Request;

  try {
    const data = await api.obtener1(body);
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

