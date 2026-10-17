# PartesDeEquipoApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizarParteEquipo**](PartesDeEquipoApi.md#actualizarparteequipo) | **PUT** /api/v1/catalogos/partes-equipo/{id} | Actualizar parte de equipo |
| [**cambiarEstadoParteEquipo**](PartesDeEquipoApi.md#cambiarestadoparteequipo) | **PUT** /api/v1/catalogos/partes-equipo/{id}/estado | Cambiar estado de la parte de equipo |
| [**listarPartesEquipo**](PartesDeEquipoApi.md#listarpartesequipo) | **GET** /api/v1/catalogos/partes-equipo | Listar partes de equipo |
| [**registrarParteEquipo**](PartesDeEquipoApi.md#registrarparteequipo) | **POST** /api/v1/catalogos/partes-equipo | Registrar parte de equipo |



## actualizarParteEquipo

> MessageResponse actualizarParteEquipo(id, parteEquipoRequest)

Actualizar parte de equipo

### Example

```ts
import {
  Configuration,
  PartesDeEquipoApi,
} from '';
import type { ActualizarParteEquipoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PartesDeEquipoApi(config);

  const body = {
    // number
    id: 56,
    // ParteEquipoRequest
    parteEquipoRequest: ...,
  } satisfies ActualizarParteEquipoRequest;

  try {
    const data = await api.actualizarParteEquipo(body);
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
| **parteEquipoRequest** | [ParteEquipoRequest](ParteEquipoRequest.md) |  | |

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


## cambiarEstadoParteEquipo

> MessageResponse cambiarEstadoParteEquipo(id, estadoCatalogoRequest)

Cambiar estado de la parte de equipo

### Example

```ts
import {
  Configuration,
  PartesDeEquipoApi,
} from '';
import type { CambiarEstadoParteEquipoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PartesDeEquipoApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstadoParteEquipoRequest;

  try {
    const data = await api.cambiarEstadoParteEquipo(body);
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


## listarPartesEquipo

> CustomPageParteEquipoResponse listarPartesEquipo(nombre, pagina, tamPagina)

Listar partes de equipo

### Example

```ts
import {
  Configuration,
  PartesDeEquipoApi,
} from '';
import type { ListarPartesEquipoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PartesDeEquipoApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarPartesEquipoRequest;

  try {
    const data = await api.listarPartesEquipo(body);
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

[**CustomPageParteEquipoResponse**](CustomPageParteEquipoResponse.md)

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


## registrarParteEquipo

> MessageResponse registrarParteEquipo(parteEquipoRequest)

Registrar parte de equipo

### Example

```ts
import {
  Configuration,
  PartesDeEquipoApi,
} from '';
import type { RegistrarParteEquipoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PartesDeEquipoApi(config);

  const body = {
    // ParteEquipoRequest
    parteEquipoRequest: ...,
  } satisfies RegistrarParteEquipoRequest;

  try {
    const data = await api.registrarParteEquipo(body);
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
| **parteEquipoRequest** | [ParteEquipoRequest](ParteEquipoRequest.md) |  | |

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

