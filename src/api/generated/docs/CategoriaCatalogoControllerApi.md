# CategoriaCatalogoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar4**](CategoriaCatalogoControllerApi.md#actualizar4) | **PUT** /api/v1/catalogos/categorias/{id} |  |
| [**cambiarEstado4**](CategoriaCatalogoControllerApi.md#cambiarestado4) | **PUT** /api/v1/catalogos/categorias/{id}/estado |  |
| [**crear4**](CategoriaCatalogoControllerApi.md#crear4) | **POST** /api/v1/catalogos/categorias |  |
| [**desactivar4**](CategoriaCatalogoControllerApi.md#desactivar4) | **DELETE** /api/v1/catalogos/categorias/{id} |  |
| [**listar4**](CategoriaCatalogoControllerApi.md#listar4) | **GET** /api/v1/catalogos/categorias |  |
| [**obtener4**](CategoriaCatalogoControllerApi.md#obtener4) | **GET** /api/v1/catalogos/categorias/{id} |  |



## actualizar4

> MessageResponse actualizar4(id, categoriaCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Actualizar4Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategoriaCatalogoControllerApi(config);

  const body = {
    // number
    id: 56,
    // CategoriaCatalogoRequest
    categoriaCatalogoRequest: ...,
  } satisfies Actualizar4Request;

  try {
    const data = await api.actualizar4(body);
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
| **categoriaCatalogoRequest** | [CategoriaCatalogoRequest](CategoriaCatalogoRequest.md) |  | |

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


## cambiarEstado4

> MessageResponse cambiarEstado4(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { CambiarEstado4Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategoriaCatalogoControllerApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstado4Request;

  try {
    const data = await api.cambiarEstado4(body);
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


## crear4

> MessageResponse crear4(categoriaCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Crear4Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategoriaCatalogoControllerApi(config);

  const body = {
    // CategoriaCatalogoRequest
    categoriaCatalogoRequest: ...,
  } satisfies Crear4Request;

  try {
    const data = await api.crear4(body);
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
| **categoriaCatalogoRequest** | [CategoriaCatalogoRequest](CategoriaCatalogoRequest.md) |  | |

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


## desactivar4

> MessageResponse desactivar4(id)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Desactivar4Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategoriaCatalogoControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies Desactivar4Request;

  try {
    const data = await api.desactivar4(body);
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


## listar4

> CustomPageCategoriaCatalogoResponse listar4(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Listar4Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategoriaCatalogoControllerApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies Listar4Request;

  try {
    const data = await api.listar4(body);
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

[**CustomPageCategoriaCatalogoResponse**](CustomPageCategoriaCatalogoResponse.md)

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


## obtener4

> MessageResponse obtener4(id)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Obtener4Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategoriaCatalogoControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies Obtener4Request;

  try {
    const data = await api.obtener4(body);
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

