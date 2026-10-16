
# ActualizarUsuarioRequest


## Properties

Name | Type
------------ | -------------
`usuarioId` | number
`nombres` | string
`apePaterno` | string
`apeMaterno` | string
`email` | string
`rolesIds` | Array&lt;number&gt;

## Example

```typescript
import type { ActualizarUsuarioRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "usuarioId": null,
  "nombres": null,
  "apePaterno": null,
  "apeMaterno": null,
  "email": null,
  "rolesIds": null,
} satisfies ActualizarUsuarioRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActualizarUsuarioRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


