# ProveedoresApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarProveedor**](ProveedoresApi.md#actualizarproveedor) | **PUT** /api/v1/catalogos/proveedores/{id} | Actualizar proveedor |
| [**cambiarEstadoProveedor**](ProveedoresApi.md#cambiarestadoproveedor) | **PUT** /api/v1/catalogos/proveedores/{id}/estado | Cambiar estado del proveedor |
| [**listarProveedores**](ProveedoresApi.md#listarproveedores) | **GET** /api/v1/catalogos/proveedores | Listar proveedores |
| [**registrarProveedor**](ProveedoresApi.md#registrarproveedor) | **POST** /api/v1/catalogos/proveedores | Registrar proveedor |



## actualizarProveedor

> MessageResponse actualizarProveedor(id, proveedorRequest)

Actualizar proveedor

### Example

```ts
import {
  Configuration,
  ProveedoresApi,
} from '';
import type { ActualizarProveedorRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedoresApi(config);

  const body = {
    // number
    id: 56,
    // ProveedorRequest
    proveedorRequest: ...,
  } satisfies ActualizarProveedorRequest;

  try {
    const data = await api.actualizarProveedor(body);
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
| **proveedorRequest** | [ProveedorRequest](ProveedorRequest.md) |  | |

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


## cambiarEstadoProveedor

> MessageResponse cambiarEstadoProveedor(id, estadoCatalogoRequest)

Cambiar estado del proveedor

### Example

```ts
import {
  Configuration,
  ProveedoresApi,
} from '';
import type { CambiarEstadoProveedorRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedoresApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstadoProveedorRequest;

  try {
    const data = await api.cambiarEstadoProveedor(body);
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


## listarProveedores

> CustomPageProveedorResponse listarProveedores(nombre, pagina, tamPagina)

Listar proveedores

### Example

```ts
import {
  Configuration,
  ProveedoresApi,
} from '';
import type { ListarProveedoresRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedoresApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarProveedoresRequest;

  try {
    const data = await api.listarProveedores(body);
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

[**CustomPageProveedorResponse**](CustomPageProveedorResponse.md)

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


## registrarProveedor

> MessageResponse registrarProveedor(proveedorRequest)

Registrar proveedor

### Example

```ts
import {
  Configuration,
  ProveedoresApi,
} from '';
import type { RegistrarProveedorRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedoresApi(config);

  const body = {
    // ProveedorRequest
    proveedorRequest: ...,
  } satisfies RegistrarProveedorRequest;

  try {
    const data = await api.registrarProveedor(body);
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
| **proveedorRequest** | [ProveedorRequest](ProveedorRequest.md) |  | |

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

