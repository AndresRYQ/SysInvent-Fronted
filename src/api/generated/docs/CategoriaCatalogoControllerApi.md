# CategoriaCatalogoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar9**](CategoriaCatalogoControllerApi.md#actualizar9) | **PUT** /api/v1/catalogos/categorias/{id} |  |
| [**cambiarEstado8**](CategoriaCatalogoControllerApi.md#cambiarestado8) | **PUT** /api/v1/catalogos/categorias/{id}/estado |  |
| [**crear9**](CategoriaCatalogoControllerApi.md#crear9) | **POST** /api/v1/catalogos/categorias |  |
| [**desactivar8**](CategoriaCatalogoControllerApi.md#desactivar8) | **DELETE** /api/v1/catalogos/categorias/{id} |  |
| [**listar9**](CategoriaCatalogoControllerApi.md#listar9) | **GET** /api/v1/catalogos/categorias |  |
| [**obtener9**](CategoriaCatalogoControllerApi.md#obtener9) | **GET** /api/v1/catalogos/categorias/{id} |  |



## actualizar9

> object actualizar9(id, categoriaCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Actualizar9Request } from '';

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
  } satisfies Actualizar9Request;

  try {
    const data = await api.actualizar9(body);
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


## cambiarEstado8

> object cambiarEstado8(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { CambiarEstado8Request } from '';

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
  } satisfies CambiarEstado8Request;

  try {
    const data = await api.cambiarEstado8(body);
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


## crear9

> object crear9(categoriaCatalogoRequest)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Crear9Request } from '';

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
  } satisfies Crear9Request;

  try {
    const data = await api.crear9(body);
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


## desactivar8

> object desactivar8(id)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Desactivar8Request } from '';

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
  } satisfies Desactivar8Request;

  try {
    const data = await api.desactivar8(body);
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


## listar9

> CustomPageCategoriaCatalogoResponse listar9(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Listar9Request } from '';

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
  } satisfies Listar9Request;

  try {
    const data = await api.listar9(body);
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


## obtener9

> object obtener9(id)



### Example

```ts
import {
  Configuration,
  CategoriaCatalogoControllerApi,
} from '';
import type { Obtener9Request } from '';

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
  } satisfies Obtener9Request;

  try {
    const data = await api.obtener9(body);
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

