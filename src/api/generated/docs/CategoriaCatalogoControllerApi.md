# CategoriaCatalogoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar7**](CategoriaCatalogoControllerApi.md#actualizar7) | **PUT** /api/v1/catalogos/categorias/{id} |  |
| [**cambiarEstado7**](CategoriaCatalogoControllerApi.md#cambiarestado7) | **PUT** /api/v1/catalogos/categorias/{id}/estado |  |
| [**crear7**](CategoriaCatalogoControllerApi.md#crear7) | **POST** /api/v1/catalogos/categorias |  |
| [**desactivar7**](CategoriaCatalogoControllerApi.md#desactivar7) | **DELETE** /api/v1/catalogos/categorias/{id} |  |
| [**listar7**](CategoriaCatalogoControllerApi.md#listar7) | **GET** /api/v1/catalogos/categorias |  |
| [**obtener7**](CategoriaCatalogoControllerApi.md#obtener7) | **GET** /api/v1/catalogos/categorias/{id} |  |



## actualizar7

> MessageResponse actualizar7(id, categoriaCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Actualizar7Request } from '';

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
  } satisfies Actualizar7Request;

  try {
    const data = await api.actualizar7(body);
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


## cambiarEstado7

> MessageResponse cambiarEstado7(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { CambiarEstado7Request } from '';

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
  } satisfies CambiarEstado7Request;

  try {
    const data = await api.cambiarEstado7(body);
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


## crear7

> MessageResponse crear7(categoriaCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Crear7Request } from '';

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
  } satisfies Crear7Request;

  try {
    const data = await api.crear7(body);
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


## desactivar7

> MessageResponse desactivar7(id)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Desactivar7Request } from '';

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
  } satisfies Desactivar7Request;

  try {
    const data = await api.desactivar7(body);
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


## listar7

> CustomPageCategoriaCatalogoResponse listar7(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Listar7Request } from '';

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
  } satisfies Listar7Request;

  try {
    const data = await api.listar7(body);
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


## obtener7

> MessageResponse obtener7(id)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Obtener7Request } from '';

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
  } satisfies Obtener7Request;

  try {
    const data = await api.obtener7(body);
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

