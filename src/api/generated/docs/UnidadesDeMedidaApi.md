# UnidadesDeMedidaApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarUnidadMedida**](UnidadesDeMedidaApi.md#actualizarunidadmedida) | **PUT** /api/v1/catalogos/unidades-medida/{id} | Actualizar unidad de medida |
| [**cambiarEstadoUnidadMedida**](UnidadesDeMedidaApi.md#cambiarestadounidadmedida) | **PUT** /api/v1/catalogos/unidades-medida/{id}/estado | Cambiar estado de unidad de medida |
| [**listarUnidadesMedida**](UnidadesDeMedidaApi.md#listarunidadesmedida) | **GET** /api/v1/catalogos/unidades-medida | Listar unidades de medida |
| [**registrarUnidadMedida**](UnidadesDeMedidaApi.md#registrarunidadmedida) | **POST** /api/v1/catalogos/unidades-medida | Registrar unidad de medida |



## actualizarUnidadMedida

> MessageResponse actualizarUnidadMedida(id, unidadMedidaRequest)

Actualizar unidad de medida

### Example

```ts
import {
  Configuration,
  UnidadesDeMedidaApi,
} from '';
import type { ActualizarUnidadMedidaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadesDeMedidaApi(config);

  const body = {
    // number
    id: 56,
    // UnidadMedidaRequest
    unidadMedidaRequest: ...,
  } satisfies ActualizarUnidadMedidaRequest;

  try {
    const data = await api.actualizarUnidadMedida(body);
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
| **unidadMedidaRequest** | [UnidadMedidaRequest](UnidadMedidaRequest.md) |  | |

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


## cambiarEstadoUnidadMedida

> MessageResponse cambiarEstadoUnidadMedida(id, estadoCatalogoRequest)

Cambiar estado de unidad de medida

### Example

```ts
import {
  Configuration,
  UnidadesDeMedidaApi,
} from '';
import type { CambiarEstadoUnidadMedidaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadesDeMedidaApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstadoUnidadMedidaRequest;

  try {
    const data = await api.cambiarEstadoUnidadMedida(body);
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


## listarUnidadesMedida

> CustomPageUnidadMedidaResponse listarUnidadesMedida(nombre, pagina, tamPagina)

Listar unidades de medida

### Example

```ts
import {
  Configuration,
  UnidadesDeMedidaApi,
} from '';
import type { ListarUnidadesMedidaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadesDeMedidaApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarUnidadesMedidaRequest;

  try {
    const data = await api.listarUnidadesMedida(body);
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

[**CustomPageUnidadMedidaResponse**](CustomPageUnidadMedidaResponse.md)

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


## registrarUnidadMedida

> MessageResponse registrarUnidadMedida(unidadMedidaRequest)

Registrar unidad de medida

### Example

```ts
import {
  Configuration,
  UnidadesDeMedidaApi,
} from '';
import type { RegistrarUnidadMedidaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UnidadesDeMedidaApi(config);

  const body = {
    // UnidadMedidaRequest
    unidadMedidaRequest: ...,
  } satisfies RegistrarUnidadMedidaRequest;

  try {
    const data = await api.registrarUnidadMedida(body);
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
| **unidadMedidaRequest** | [UnidadMedidaRequest](UnidadMedidaRequest.md) |  | |

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

