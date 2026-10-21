# ReporteValeControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**listar1**](ReporteValeControllerApi.md#listar1) | **GET** /api/reportes/vales |  |



## listar1

> CustomPageReporteValeListadoResponse listar1(busqueda, centroCostoId, destinoId, parteEquipoId, tipoProductoId, productoId, estado, fechaDesde, fechaHasta, pagina, tamPagina)



### Example

```ts
import {
  Configuration,
  ReporteValeControllerApi,
} from '';
import type { Listar1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReporteValeControllerApi(config);

  const body = {
    // string (optional)
    busqueda: busqueda_example,
    // number (optional)
    centroCostoId: 56,
    // number (optional)
    destinoId: 56,
    // number (optional)
    parteEquipoId: 56,
    // number (optional)
    tipoProductoId: 56,
    // number (optional)
    productoId: 56,
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
  } satisfies Listar1Request;

  try {
    const data = await api.listar1(body);
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
| **centroCostoId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **destinoId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **parteEquipoId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **tipoProductoId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **productoId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **estado** | `string` |  | [Optional] [Defaults to `undefined`] |
| **fechaDesde** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **fechaHasta** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **pagina** | `number` |  | [Optional] [Defaults to `1`] |
| **tamPagina** | `number` |  | [Optional] [Defaults to `10`] |

### Return type

[**CustomPageReporteValeListadoResponse**](CustomPageReporteValeListadoResponse.md)

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

