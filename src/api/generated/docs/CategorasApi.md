# CategorasApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**eliminarCategoria**](CategorasApi.md#eliminarcategoria) | **DELETE** /api/categorias | Eliminar categoría |
| [**listarCategorias**](CategorasApi.md#listarcategorias) | **GET** /api/categorias | Listar categorías |
| [**registrarActualizarCategoria**](CategorasApi.md#registraractualizarcategoria) | **POST** /api/categorias | Registrar o actualizar categoría |



## eliminarCategoria

> object eliminarCategoria(categoriaId)

Eliminar categoría

Desactiva lógicamente una categoría

### Example

```ts
import {
  Configuration,
  CategorasApi,
} from '';
import type { EliminarCategoriaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategorasApi(config);

  const body = {
    // number
    categoriaId: 56,
  } satisfies EliminarCategoriaRequest;

  try {
    const data = await api.eliminarCategoria(body);
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
| **categoriaId** | `number` |  | [Defaults to `undefined`] |

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


## listarCategorias

> CustomPageCategoriaResponse listarCategorias(nombre, pagina, tamPagina)

Listar categorías

Lista las categorías activas con paginación

### Example

```ts
import {
  Configuration,
  CategorasApi,
} from '';
import type { ListarCategoriasRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategorasApi(config);

  const body = {
    // string (optional)
    nombre: nombre_example,
    // number (optional)
    pagina: 56,
    // number (optional)
    tamPagina: 56,
  } satisfies ListarCategoriasRequest;

  try {
    const data = await api.listarCategorias(body);
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

[**CustomPageCategoriaResponse**](CustomPageCategoriaResponse.md)

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


## registrarActualizarCategoria

> object registrarActualizarCategoria(categoriaRequest)

Registrar o actualizar categoría

Registra cuando categoriaId es 0 y actualiza cuando es mayor que 0

### Example

```ts
import {
  Configuration,
  CategorasApi,
} from '';
import type { RegistrarActualizarCategoriaRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CategorasApi(config);

  const body = {
    // CategoriaRequest
    categoriaRequest: ...,
  } satisfies RegistrarActualizarCategoriaRequest;

  try {
    const data = await api.registrarActualizarCategoria(body);
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
| **categoriaRequest** | [CategoriaRequest](CategoriaRequest.md) |  | |

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

