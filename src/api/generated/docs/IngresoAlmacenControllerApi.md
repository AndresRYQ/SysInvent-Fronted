# IngresoAlmacenControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**crear1**](IngresoAlmacenControllerApi.md#crear1) | **POST** /api/ingresos-almacen |  |
| [**listar4**](IngresoAlmacenControllerApi.md#listar4) | **GET** /api/ingresos-almacen |  |
| [**obtener2**](IngresoAlmacenControllerApi.md#obtener2) | **GET** /api/ingresos-almacen/{id} |  |



## crear1

> object crear1(ingresoAlmacenRequest)



### Example

```ts
import {
  Configuration,
  IngresoAlmacenControllerApi,
} from '';
import type { Crear1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new IngresoAlmacenControllerApi(config);

  const body = {
    // IngresoAlmacenRequest
    ingresoAlmacenRequest: ...,
  } satisfies Crear1Request;

  try {
    const data = await api.crear1(body);
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
| **ingresoAlmacenRequest** | [IngresoAlmacenRequest](IngresoAlmacenRequest.md) |  | |

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


## listar4

> CustomPageIngresoAlmacenListadoResponse listar4(busqueda, proveedorId, estado, fechaDesde, fechaHasta, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  IngresoAlmacenControllerApi,
} from '';
import type { Listar4Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new IngresoAlmacenControllerApi(config);

  const body = {
    // string (optional)
    busqueda: busqueda_example,
    // number (optional)
    proveedorId: 56,
    // string (optional)
    estado: estado_example,
    // Date (optional)
    fechaDesde: 2013-10-20,
    // Date (optional)
    fechaHasta: 2013-10-20,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies Listar4Request;

  try {
    const data = await api.listar4(body);
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
| **proveedorId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **estado** | `string` |  | [Optional] [Defaults to `undefined`] |
| **fechaDesde** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **fechaHasta** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageIngresoAlmacenListadoResponse**](CustomPageIngresoAlmacenListadoResponse.md)

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


## obtener2

> object obtener2(id)



### Example

```ts
import {
  Configuration,
  IngresoAlmacenControllerApi,
} from '';
import type { Obtener2Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new IngresoAlmacenControllerApi(config);

  const body = {
    // number
    id: 56,
  } satisfies Obtener2Request;

  try {
    const data = await api.obtener2(body);
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

