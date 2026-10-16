# TipoDocumentoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar3**](TipoDocumentoControllerApi.md#actualizar3) | **PUT** /api/v1/catalogos/tipos-documento/{id} |  |
| [**cambiarEstado2**](TipoDocumentoControllerApi.md#cambiarestado2) | **PUT** /api/v1/catalogos/tipos-documento/{id}/estado |  |
| [**crear3**](TipoDocumentoControllerApi.md#crear3) | **POST** /api/v1/catalogos/tipos-documento |  |
| [**desactivar2**](TipoDocumentoControllerApi.md#desactivar2) | **DELETE** /api/v1/catalogos/tipos-documento/{id} |  |
| [**listar3**](TipoDocumentoControllerApi.md#listar3) | **GET** /api/v1/catalogos/tipos-documento |  |
| [**obtener3**](TipoDocumentoControllerApi.md#obtener3) | **GET** /api/v1/catalogos/tipos-documento/{id} |  |



## actualizar3

> object actualizar3(id, tipoDocumentoRequest)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Actualizar3Request } from '';

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
| **tipoDocumentoRequest** | [TipoDocumentoRequest](TipoDocumentoRequest.md) |  | |

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


## cambiarEstado2

> object cambiarEstado2(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { CambiarEstado2Request } from '';

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
  } satisfies CambiarEstado2Request;

  try {
    const data = await api.cambiarEstado2(body);
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


## crear3

> object crear3(tipoDocumentoRequest)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Crear3Request } from '';

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
| **tipoDocumentoRequest** | [TipoDocumentoRequest](TipoDocumentoRequest.md) |  | |

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


## desactivar2

> object desactivar2(id)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Desactivar2Request } from '';

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
  } satisfies Desactivar2Request;

  try {
    const data = await api.desactivar2(body);
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


## listar3

> CustomPageTipoDocumentoResponse listar3(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Listar3Request } from '';

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


## obtener3

> object obtener3(id)



### Example

```ts
import {
  Configuration,
  TipoDocumentoControllerApi,
} from '';
import type { Obtener3Request } from '';

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

