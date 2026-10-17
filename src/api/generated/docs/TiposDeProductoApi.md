# TiposDeProductoApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarTipoProducto**](TiposDeProductoApi.md#actualizartipoproducto) | **PUT** /api/v1/catalogos/tipos-producto/{id} | Actualizar tipo de producto |
| [**cambiarEstadoTipoProducto**](TiposDeProductoApi.md#cambiarestadotipoproducto) | **PUT** /api/v1/catalogos/tipos-producto/{id}/estado | Cambiar estado del tipo de producto |
| [**listarTiposProducto**](TiposDeProductoApi.md#listartiposproducto) | **GET** /api/v1/catalogos/tipos-producto | Listar tipos de producto |
| [**registrarTipoProducto**](TiposDeProductoApi.md#registrartipoproducto) | **POST** /api/v1/catalogos/tipos-producto | Registrar tipo de producto |



## actualizarTipoProducto

> MessageResponse actualizarTipoProducto(id, tipoProductoRequest)

Actualizar tipo de producto

### Example

```ts
import {
  Configuration,
  TiposDeProductoApi,
} from '';
import type { ActualizarTipoProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TiposDeProductoApi(config);

  const body = {
    // number
    id: 56,
    // TipoProductoRequest
    tipoProductoRequest: ...,
  } satisfies ActualizarTipoProductoRequest;

  try {
    const data = await api.actualizarTipoProducto(body);
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
| **tipoProductoRequest** | [TipoProductoRequest](TipoProductoRequest.md) |  | |

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


## cambiarEstadoTipoProducto

> MessageResponse cambiarEstadoTipoProducto(id, estadoCatalogoRequest)

Cambiar estado del tipo de producto

### Example

```ts
import {
  Configuration,
  TiposDeProductoApi,
} from '';
import type { CambiarEstadoTipoProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TiposDeProductoApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstadoTipoProductoRequest;

  try {
    const data = await api.cambiarEstadoTipoProducto(body);
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


## listarTiposProducto

> CustomPageTipoProductoResponse listarTiposProducto(nombre, pagina, tamPagina)

Listar tipos de producto

### Example

```ts
import {
  Configuration,
  TiposDeProductoApi,
} from '';
import type { ListarTiposProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TiposDeProductoApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarTiposProductoRequest;

  try {
    const data = await api.listarTiposProducto(body);
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

[**CustomPageTipoProductoResponse**](CustomPageTipoProductoResponse.md)

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


## registrarTipoProducto

> MessageResponse registrarTipoProducto(tipoProductoRequest)

Registrar tipo de producto

### Example

```ts
import {
  Configuration,
  TiposDeProductoApi,
} from '';
import type { RegistrarTipoProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TiposDeProductoApi(config);

  const body = {
    // TipoProductoRequest
    tipoProductoRequest: ...,
  } satisfies RegistrarTipoProductoRequest;

  try {
    const data = await api.registrarTipoProducto(body);
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
| **tipoProductoRequest** | [TipoProductoRequest](TipoProductoRequest.md) |  | |

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

