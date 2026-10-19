# CombosComunesApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**categorias**](CombosComunesApi.md#categorias) | **GET** /api/v1/comun/categorias | Listar categorías activas |
| [**centrosCosto**](CombosComunesApi.md#centroscosto) | **GET** /api/v1/comun/centros-costo | Listar centros de costo activos |
| [**destinos**](CombosComunesApi.md#destinos) | **GET** /api/v1/comun/destinos | Listar destinos activos |
| [**partesEquipo**](CombosComunesApi.md#partesequipo) | **GET** /api/v1/comun/partes-equipo | Listar partes de equipo activas |
| [**productos**](CombosComunesApi.md#productos) | **GET** /api/v1/comun/productos | Listar productos activos |
| [**proveedores**](CombosComunesApi.md#proveedores) | **GET** /api/v1/comun/proveedores | Listar proveedores activos |
| [**roles**](CombosComunesApi.md#roles) | **GET** /api/v1/comun/roles | Listar roles activos |
| [**tiposDocumento**](CombosComunesApi.md#tiposdocumento) | **GET** /api/v1/comun/tipos-documento | Listar tipos de documento activos |
| [**tiposProducto**](CombosComunesApi.md#tiposproducto) | **GET** /api/v1/comun/tipos-producto | Listar tipos de producto activos |
| [**unidadesMedida**](CombosComunesApi.md#unidadesmedida) | **GET** /api/v1/comun/unidades-medida | Listar unidades de medida activas |



## categorias

> Array&lt;ComunResponse&gt; categorias()

Listar categorías activas

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { CategoriasRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.categorias();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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


## centrosCosto

> Array&lt;ComunResponse&gt; centrosCosto()

Listar centros de costo activos

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { CentrosCostoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.centrosCosto();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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


## destinos

> Array&lt;ComunResponse&gt; destinos()

Listar destinos activos

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { DestinosRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.destinos();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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


## partesEquipo

> Array&lt;ComunResponse&gt; partesEquipo()

Listar partes de equipo activas

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { PartesEquipoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.partesEquipo();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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


## productos

> Array&lt;ComunResponse&gt; productos()

Listar productos activos

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { ProductosRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.productos();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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


## proveedores

> Array&lt;ComunResponse&gt; proveedores()

Listar proveedores activos

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { ProveedoresRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.proveedores();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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


## roles

> Array&lt;ComunResponse&gt; roles()

Listar roles activos

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { RolesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.roles();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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


## tiposDocumento

> Array&lt;ComunResponse&gt; tiposDocumento()

Listar tipos de documento activos

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { TiposDocumentoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.tiposDocumento();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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


## tiposProducto

> Array&lt;ComunResponse&gt; tiposProducto()

Listar tipos de producto activos

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { TiposProductoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.tiposProducto();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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


## unidadesMedida

> Array&lt;ComunResponse&gt; unidadesMedida()

Listar unidades de medida activas

### Example

```ts
import {
  Configuration,
  CombosComunesApi,
} from '';
import type { UnidadesMedidaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CombosComunesApi(config);

  try {
    const data = await api.unidadesMedida();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ComunResponse&gt;**](ComunResponse.md)

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

