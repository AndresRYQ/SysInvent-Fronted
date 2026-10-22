# ProveedorControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar**](ProveedorControllerApi.md#actualizar) | **PUT** /api/v1/catalogos/proveedores/{id} |  |
| [**cambiarEstado**](ProveedorControllerApi.md#cambiarestado) | **PUT** /api/v1/catalogos/proveedores/{id}/estado |  |
| [**crear**](ProveedorControllerApi.md#crear) | **POST** /api/v1/catalogos/proveedores |  |
| [**desactivar**](ProveedorControllerApi.md#desactivar) | **DELETE** /api/v1/catalogos/proveedores/{id} |  |
| [**listar**](ProveedorControllerApi.md#listar) | **GET** /api/v1/catalogos/proveedores |  |
| [**obtener**](ProveedorControllerApi.md#obtener) | **GET** /api/v1/catalogos/proveedores/{id} |  |



## actualizar

> MessageResponse actualizar(id, proveedorRequest)



### Example

```ts
import {
  Configuration,
  ProveedorControllerApi,
} from '';
import type { ActualizarRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedorControllerApi(config);

  const body = {
    // number
    id: 56,
    // ProveedorRequest
    proveedorRequest: ...,
  } satisfies ActualizarRequest;

  try {
    const data = await api.actualizar(body);
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


## cambiarEstado

> MessageResponse cambiarEstado(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  ProveedorControllerApi,
} from '';
import type { CambiarEstadoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedorControllerApi(config);

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


## crear

> MessageResponse crear(proveedorRequest)



### Example

```ts
import {
  Configuration,
  ProveedorControllerApi,
} from '';
import type { CrearRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedorControllerApi(config);

  const body = {
    // ProveedorRequest
    proveedorRequest: ...,
  } satisfies CrearRequest;

  try {
    const data = await api.crear(body);
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


## desactivar

> MessageResponse desactivar(id)



### Example

```ts
import {
  Configuration,
  ProveedorControllerApi,
} from '';
import type { DesactivarRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedorControllerApi(config);

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


## listar

> CustomPageProveedorResponse listar(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  ProveedorControllerApi,
} from '';
import type { ListarRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedorControllerApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarRequest;

  try {
    const data = await api.listar(body);
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


## obtener

> MessageResponse obtener(id)



### Example

```ts
import {
  Configuration,
  ProveedorControllerApi,
} from '';
import type { ObtenerRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ProveedorControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ObtenerRequest;

  try {
    const data = await api.obtener(body);
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

