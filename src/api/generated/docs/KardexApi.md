# KardexApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**movimientos**](KardexApi.md#movimientos) | **GET** /api/kardex/movimientos | Consultar movimientos del Kardex |
| [**stock**](KardexApi.md#stock) | **GET** /api/kardex/stock | Consultar stock actual |



## movimientos

> object movimientos(productoId, desde, hasta, tipoMovimiento)

Consultar movimientos del Kardex

Filtra por producto, fechas y tipo de movimiento

### Example

```ts
import {
  Configuration,
  KardexApi,
} from '';
import type { MovimientosRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new KardexApi(config);

  const body = {
    // number (optional)
    productoId: 56,
    // Date (optional)
    desde: 2013-10-20,
    // Date (optional)
    hasta: 2013-10-20,
    // string (optional)
    tipoMovimiento: tipoMovimiento_example,
  } satisfies MovimientosRequest;

  try {
    const data = await api.movimientos(body);
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


## stock

> object stock(soloMinimo)

Consultar stock actual

Use soloMinimo&#x3D;true para listar productos en nivel mínimo o por debajo

### Example

```ts
import {
  Configuration,
  KardexApi,
} from '';
import type { StockRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new KardexApi(config);

  const body = {
    // boolean (optional)
    soloMinimo: true,
  } satisfies StockRequest;

  try {
    const data = await api.stock(body);
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
| **soloMinimo** | `boolean` |  | [Optional] [Defaults to `false`] |

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

