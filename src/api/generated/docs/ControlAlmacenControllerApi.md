# ControlAlmacenControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**detalle**](ControlAlmacenControllerApi.md#detalle) | **GET** /api/almacen/existencias/{productoId}/detalle |  |
| [**listar6**](ControlAlmacenControllerApi.md#listar6) | **GET** /api/almacen/existencias |  |



## detalle

> CustomPageControlAlmacenMovimientoResponse detalle(productoId, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  ControlAlmacenControllerApi,
} from '';
import type { DetalleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ControlAlmacenControllerApi(config);

  const body = {
    // number
    productoId: 56,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies DetalleRequest;

  try {
    const data = await api.detalle(body);
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
| **productoId** | `number` |  | [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageControlAlmacenMovimientoResponse**](CustomPageControlAlmacenMovimientoResponse.md)

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


## listar6

> CustomPageControlAlmacenListadoResponse listar6(busqueda, tipoProductoId, categoriaId, estado, fechaDesde, fechaHasta, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  ControlAlmacenControllerApi,
} from '';
import type { Listar6Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ControlAlmacenControllerApi(config);

  const body = {
    // string (optional)
    busqueda: busqueda_example,
    // number (optional)
    tipoProductoId: 56,
    // number (optional)
    categoriaId: 56,
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
  } satisfies Listar6Request;

  try {
    const data = await api.listar6(body);
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
| **tipoProductoId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **categoriaId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **estado** | `string` |  | [Optional] [Defaults to `undefined`] |
| **fechaDesde** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **fechaHasta** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageControlAlmacenListadoResponse**](CustomPageControlAlmacenListadoResponse.md)

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

