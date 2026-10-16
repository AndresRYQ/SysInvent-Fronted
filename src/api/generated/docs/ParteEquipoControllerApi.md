# ParteEquipoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**actualizar5**](ParteEquipoControllerApi.md#actualizar5) | **PUT** /api/v1/catalogos/partes-equipo/{id} |  |
| [**cambiarEstado4**](ParteEquipoControllerApi.md#cambiarestado4) | **PUT** /api/v1/catalogos/partes-equipo/{id}/estado |  |
| [**crear5**](ParteEquipoControllerApi.md#crear5) | **POST** /api/v1/catalogos/partes-equipo |  |
| [**desactivar4**](ParteEquipoControllerApi.md#desactivar4) | **DELETE** /api/v1/catalogos/partes-equipo/{id} |  |
| [**listar5**](ParteEquipoControllerApi.md#listar5) | **GET** /api/v1/catalogos/partes-equipo |  |
| [**obtener5**](ParteEquipoControllerApi.md#obtener5) | **GET** /api/v1/catalogos/partes-equipo/{id} |  |



## actualizar5

> object actualizar5(id, parteEquipoRequest)



### Example

```ts
import {
  Configuration,
  ParteEquipoControllerApi,
} from '';
import type { Actualizar5Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ParteEquipoControllerApi(config);

  const body = {
    // number
    id: 56,
    // ParteEquipoRequest
    parteEquipoRequest: ...,
  } satisfies Actualizar5Request;

  try {
    const data = await api.actualizar5(body);
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


## cambiarEstado4

> object cambiarEstado4(id, estadoCatalogoRequest)



### Example

```ts
import {
  Configuration,
  ParteEquipoControllerApi,
} from '';
import type { CambiarEstado4Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ParteEquipoControllerApi(config);

  const body = {
    // number
    id: 56,
    // EstadoCatalogoRequest
    estadoCatalogoRequest: ...,
  } satisfies CambiarEstado4Request;

  try {
    const data = await api.cambiarEstado4(body);
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


## crear5

> object crear5(parteEquipoRequest)



### Example

```ts
import {
  Configuration,
  ParteEquipoControllerApi,
} from '';
import type { Crear5Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ParteEquipoControllerApi(config);

  const body = {
    // ParteEquipoRequest
    parteEquipoRequest: ...,
  } satisfies Crear5Request;

  try {
    const data = await api.crear5(body);
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


## desactivar4

> object desactivar4(id)



### Example

```ts
import {
  Configuration,
  ParteEquipoControllerApi,
} from '';
import type { Desactivar4Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ParteEquipoControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies Desactivar4Request;

  try {
    const data = await api.desactivar4(body);
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


## listar5

> CustomPageParteEquipoResponse listar5(nombre, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  ParteEquipoControllerApi,
} from '';
import type { Listar5Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ParteEquipoControllerApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies Listar5Request;

  try {
    const data = await api.listar5(body);
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


## obtener5

> object obtener5(id)



### Example

```ts
import {
  Configuration,
  ParteEquipoControllerApi,
} from '';
import type { Obtener5Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ParteEquipoControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies Obtener5Request;

  try {
    const data = await api.obtener5(body);
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

