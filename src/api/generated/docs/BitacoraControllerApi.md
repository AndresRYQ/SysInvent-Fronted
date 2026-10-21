# BitacoraControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**listar5**](BitacoraControllerApi.md#listar5) | **GET** /api/bitacora |  |
| [**registrar**](BitacoraControllerApi.md#registrar) | **POST** /api/bitacora |  |



## listar5

> CustomPageBitacoraProjection listar5(busqueda, modulo, accion, fechaDesde, fechaHasta, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  BitacoraControllerApi,
} from '';
import type { Listar5Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BitacoraControllerApi(config);

  const body = {
    // string (optional)
    busqueda: busqueda_example,
    // string (optional)
    modulo: modulo_example,
    // string (optional)
    accion: accion_example,
    // Date (optional)
    fechaDesde: 2013-10-20,
    // Date (optional)
    fechaHasta: 2013-10-20,
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
| **busqueda** | `string` |  | [Optional] [Defaults to `undefined`] |
| **modulo** | `string` |  | [Optional] [Defaults to `undefined`] |
| **accion** | `string` |  | [Optional] [Defaults to `undefined`] |
| **fechaDesde** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **fechaHasta** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageBitacoraProjection**](CustomPageBitacoraProjection.md)

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


## registrar

> MessageResponse registrar(bitacoraRequest)



### Example

```ts
import {
  Configuration,
  BitacoraControllerApi,
} from '';
import type { RegistrarRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new BitacoraControllerApi(config);

  const body = {
    // BitacoraRequest
    bitacoraRequest: ...,
  } satisfies RegistrarRequest;

  try {
    const data = await api.registrar(body);
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
| **bitacoraRequest** | [BitacoraRequest](BitacoraRequest.md) |  | |

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

