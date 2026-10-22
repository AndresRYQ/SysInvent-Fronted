# ReportesApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**obtener1**](ReportesApi.md#obtener1) | **GET** /api/reportes/kardex | Generar reporte de Kardex |



## obtener1

> object obtener1(productoId, desde, hasta, tipoMovimiento)

Generar reporte de Kardex

Filtra movimientos por producto, fechas y tipo

### Example

```ts
import {
  Configuration,
  ReportesApi,
} from '';
import type { Obtener1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ReportesApi(config);

  const body = {
    // number (optional)
    productoId: 56,
    // Date (optional)
    desde: 2013-10-20,
    // Date (optional)
    hasta: 2013-10-20,
    // string (optional)
    tipoMovimiento: tipoMovimiento_example,
  } satisfies Obtener1Request;

  try {
    const data = await api.obtener1(body);
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
| **productoId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **desde** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **hasta** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **tipoMovimiento** | `string` |  | [Optional] [Defaults to `undefined`] |

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

