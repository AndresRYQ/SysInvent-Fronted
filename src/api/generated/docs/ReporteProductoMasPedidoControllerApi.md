# ReporteProductoMasPedidoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**listar2**](ReporteProductoMasPedidoControllerApi.md#listar2) | **GET** /api/reportes/productos-mas-pedidos |  |



## listar2

> CustomPageReporteProductoMasPedidoResponse listar2(busqueda, tipoProductoId, categoriaId, destinoId, fechaDesde, fechaHasta, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  ReporteProductoMasPedidoControllerApi,
} from '';
import type { Listar2Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReporteProductoMasPedidoControllerApi(config);

  const body = {
    // string (optional)
    busqueda: busqueda_example,
    // number (optional)
    tipoProductoId: 56,
    // number (optional)
    categoriaId: 56,
    // number (optional)
    destinoId: 56,
    // Date (optional)
    fechaDesde: 2013-10-20,
    // Date (optional)
    fechaHasta: 2013-10-20,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies Listar2Request;

  try {
    const data = await api.listar2(body);
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
| **destinoId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **fechaDesde** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **fechaHasta** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageReporteProductoMasPedidoResponse**](CustomPageReporteProductoMasPedidoResponse.md)

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

