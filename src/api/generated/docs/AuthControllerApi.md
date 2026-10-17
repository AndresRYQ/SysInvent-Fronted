# AuthControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**login1**](AuthControllerApi.md#login1) | **POST** /api/auth/login |  |



## login1

> LoginResponse login1(loginRequest)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { Login1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthControllerApi();

  const body = {
    // LoginRequest
    loginRequest: ...,
  } satisfies Login1Request;

  try {
    const data = await api.login1(body);
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
| **loginRequest** | [LoginRequest](LoginRequest.md) |  | |

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

