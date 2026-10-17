# CategoriaCatalogoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar6**](CategoriaCatalogoControllerApi.md#actualizar6) | **PUT** /api/v1/catalogos/categorias/{id} |  |
| [**cambiarEstado6**](CategoriaCatalogoControllerApi.md#cambiarestado6) | **PUT** /api/v1/catalogos/categorias/{id}/estado |  |
| [**crear6**](CategoriaCatalogoControllerApi.md#crear6) | **POST** /api/v1/catalogos/categorias |  |
| [**desactivar6**](CategoriaCatalogoControllerApi.md#desactivar6) | **DELETE** /api/v1/catalogos/categorias/{id} |  |
| [**listar6**](CategoriaCatalogoControllerApi.md#listar6) | **GET** /api/v1/catalogos/categorias |  |
| [**obtener6**](CategoriaCatalogoControllerApi.md#obtener6) | **GET** /api/v1/catalogos/categorias/{id} |  |



## actualizar6

> MessageResponse actualizar6(id, categoriaCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Actualizar6Request } from '';

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
  } satisfies Actualizar6Request;

  try {
    const data = await api.actualizar6(body);
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


## cambiarEstado6

> MessageResponse cambiarEstado6(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { CambiarEstado6Request } from '';

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
  } satisfies CambiarEstado6Request;

  try {
    const data = await api.cambiarEstado6(body);
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


## crear6

> MessageResponse crear6(categoriaCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Crear6Request } from '';

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
  } satisfies Crear6Request;

  try {
    const data = await api.crear6(body);
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


## desactivar6

> MessageResponse desactivar6(id)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Desactivar6Request } from '';

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
  } satisfies Desactivar6Request;

  try {
    const data = await api.desactivar6(body);
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


## listar6

> CustomPageCategoriaCatalogoResponse listar6(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Listar6Request } from '';

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
  } satisfies Listar6Request;

  try {
    const data = await api.listar6(body);
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


## obtener6

> MessageResponse obtener6(id)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Obtener6Request } from '';

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
  } satisfies Obtener6Request;

  try {
    const data = await api.obtener6(body);
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

