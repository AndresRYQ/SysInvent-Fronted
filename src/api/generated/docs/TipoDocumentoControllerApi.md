# TipoDocumentoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar1**](TipoDocumentoControllerApi.md#actualizar1) | **PUT** /api/v1/catalogos/tipos-documento/{id} |  |
| [**cambiarEstado1**](TipoDocumentoControllerApi.md#cambiarestado1) | **PUT** /api/v1/catalogos/tipos-documento/{id}/estado |  |
| [**crear1**](TipoDocumentoControllerApi.md#crear1) | **POST** /api/v1/catalogos/tipos-documento |  |
| [**desactivar1**](TipoDocumentoControllerApi.md#desactivar1) | **DELETE** /api/v1/catalogos/tipos-documento/{id} |  |
| [**listar1**](TipoDocumentoControllerApi.md#listar1) | **GET** /api/v1/catalogos/tipos-documento |  |
| [**obtener1**](TipoDocumentoControllerApi.md#obtener1) | **GET** /api/v1/catalogos/tipos-documento/{id} |  |



## actualizar1

> MessageResponse actualizar1(id, tipoDocumentoRequest)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Actualizar1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TipoDocumentoControllerApi(config);

  const body = {
    // number
    id: 56,
    // TipoDocumentoRequest
    tipoDocumentoRequest: ...,
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


## cambiarEstado1

> MessageResponse cambiarEstado1(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { CambiarEstado1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TipoDocumentoControllerApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstado1Request;

  try {
    const data = await api.cambiarEstado1(body);
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


## crear1

> MessageResponse crear1(tipoDocumentoRequest)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Crear1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TipoDocumentoControllerApi(config);

  const body = {
    // TipoDocumentoRequest
    tipoDocumentoRequest: ...,
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


## desactivar1

> MessageResponse desactivar1(id)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Desactivar1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TipoDocumentoControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies Desactivar1Request;

  try {
    const data = await api.desactivar1(body);
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


## listar1

> CustomPageTipoDocumentoResponse listar1(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Listar1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TipoDocumentoControllerApi(config);

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


## obtener1

> MessageResponse obtener1(id)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Obtener1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TipoDocumentoControllerApi(config);

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

