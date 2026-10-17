# DestinosApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarDestino**](DestinosApi.md#actualizardestino) | **PUT** /api/v1/catalogos/destinos/{id} | Actualizar destino |
| [**cambiarEstadoDestino**](DestinosApi.md#cambiarestadodestino) | **PUT** /api/v1/catalogos/destinos/{id}/estado | Cambiar estado del destino |
| [**desactivarDestino**](DestinosApi.md#desactivardestino) | **DELETE** /api/v1/catalogos/destinos/{id} | Desactivar destino |
| [**listarDestinos**](DestinosApi.md#listardestinos) | **GET** /api/v1/catalogos/destinos | Listar destinos |
| [**obtenerDestino**](DestinosApi.md#obtenerdestino) | **GET** /api/v1/catalogos/destinos/{id} | Obtener destino por ID |
| [**registrarDestino**](DestinosApi.md#registrardestino) | **POST** /api/v1/catalogos/destinos | Registrar destino |



## actualizarDestino

> MessageResponse actualizarDestino(id, destinoRequest)

Actualizar destino

### Example

```ts
import {
  Configuration,
  DestinosApi,
} from '';
import type { ActualizarDestinoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DestinosApi(config);

  const body = {
    // number
    id: 56,
    // DestinoRequest
    destinoRequest: ...,
  } satisfies ActualizarDestinoRequest;

  try {
    const data = await api.actualizarDestino(body);
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
| **destinoRequest** | [DestinoRequest](DestinoRequest.md) |  | |

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


## cambiarEstadoDestino

> MessageResponse cambiarEstadoDestino(id, estadoCatalogoRequest)

Cambiar estado del destino

### Example

```ts
import {
  Configuration,
  DestinosApi,
} from '';
import type { CambiarEstadoDestinoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DestinosApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstadoDestinoRequest;

  try {
    const data = await api.cambiarEstadoDestino(body);
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


## desactivarDestino

> MessageResponse desactivarDestino(id)

Desactivar destino

### Example

```ts
import {
  Configuration,
  DestinosApi,
} from '';
import type { DesactivarDestinoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DestinosApi(config);

  const body = {
    // number
    id: 56,
  } satisfies DesactivarDestinoRequest;

  try {
    const data = await api.desactivarDestino(body);
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


## listarDestinos

> CustomPageDestinoResponse listarDestinos(nombre, pagina, tamPagina)

Listar destinos

### Example

```ts
import {
  Configuration,
  DestinosApi,
} from '';
import type { ListarDestinosRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DestinosApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarDestinosRequest;

  try {
    const data = await api.listarDestinos(body);
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

[**CustomPageDestinoResponse**](CustomPageDestinoResponse.md)

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


## obtenerDestino

> MessageResponse obtenerDestino(id)

Obtener destino por ID

### Example

```ts
import {
  Configuration,
  DestinosApi,
} from '';
import type { ObtenerDestinoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DestinosApi(config);

  const body = {
    // number
    id: 56,
  } satisfies ObtenerDestinoRequest;

  try {
    const data = await api.obtenerDestino(body);
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


## registrarDestino

> MessageResponse registrarDestino(destinoRequest)

Registrar destino

### Example

```ts
import {
  Configuration,
  DestinosApi,
} from '';
import type { RegistrarDestinoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DestinosApi(config);

  const body = {
    // DestinoRequest
    destinoRequest: ...,
  } satisfies RegistrarDestinoRequest;

  try {
    const data = await api.registrarDestino(body);
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
| **destinoRequest** | [DestinoRequest](DestinoRequest.md) |  | |

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

