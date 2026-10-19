# ProductosApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarProducto**](ProductosApi.md#actualizarproducto) | **PUT** /api/v1/catalogos/productos/{id} | Actualizar producto |
| [**cambiarEstadoProducto**](ProductosApi.md#cambiarestadoproducto) | **PUT** /api/v1/catalogos/productos/{id}/estado | Cambiar estado del producto |
| [**eliminarProducto**](ProductosApi.md#eliminarproducto) | **DELETE** /api/v1/catalogos/productos/{id} | Desactivar producto |
| [**listarProductos**](ProductosApi.md#listarproductos) | **GET** /api/v1/catalogos/productos | Listar productos |
| [**obtenerProducto**](ProductosApi.md#obtenerproducto) | **GET** /api/v1/catalogos/productos/{id} | Obtener producto |
| [**registrarProducto**](ProductosApi.md#registrarproducto) | **POST** /api/v1/catalogos/productos | Registrar producto |



## actualizarProducto

> MessageResponse actualizarProducto(id, productoRequest)

Actualizar producto

### Example

```ts
import {
  Configuration,
  ProductosApi,
} from '';
import type { ActualizarProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductosApi(config);

  const body = {
    // number
    id: 56,
    // ProductoRequest
    productoRequest: ...,
  } satisfies ActualizarProductoRequest;

  try {
    const data = await api.actualizarProducto(body);
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
| **productoRequest** | [ProductoRequest](ProductoRequest.md) |  | |

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


## cambiarEstadoProducto

> MessageResponse cambiarEstadoProducto(id, estadoCatalogoRequest)

Cambiar estado del producto

### Example

```ts
import {
  Configuration,
  ProductosApi,
} from '';
import type { CambiarEstadoProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductosApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstadoProductoRequest;

  try {
    const data = await api.cambiarEstadoProducto(body);
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


## eliminarProducto

> MessageResponse eliminarProducto(id)

Desactivar producto

### Example

```ts
import {
  Configuration,
  ProductosApi,
} from '';
import type { EliminarProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductosApi(config);

  const body = {
    // number
    id: 56,
  } satisfies EliminarProductoRequest;

  try {
    const data = await api.eliminarProducto(body);
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


## listarProductos

> CustomPageProductoResponse listarProductos(nombre, pagina, tamPagina)

Listar productos

### Example

```ts
import {
  Configuration,
  ProductosApi,
} from '';
import type { ListarProductosRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductosApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarProductosRequest;

  try {
    const data = await api.listarProductos(body);
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

[**CustomPageProductoResponse**](CustomPageProductoResponse.md)

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


## obtenerProducto

> MessageResponse obtenerProducto(id)

Obtener producto

### Example

```ts
import {
  Configuration,
  ProductosApi,
} from '';
import type { ObtenerProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductosApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ObtenerProductoRequest;

  try {
    const data = await api.obtenerProducto(body);
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


## registrarProducto

> MessageResponse registrarProducto(productoRequest)

Registrar producto

### Example

```ts
import {
  Configuration,
  ProductosApi,
} from '';
import type { RegistrarProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProductosApi(config);

  const body = {
    // ProductoRequest
    productoRequest: ...,
  } satisfies RegistrarProductoRequest;

  try {
    const data = await api.registrarProducto(body);
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
| **productoRequest** | [ProductoRequest](ProductoRequest.md) |  | |

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

