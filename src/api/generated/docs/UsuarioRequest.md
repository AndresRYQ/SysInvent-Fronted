
# UsuarioRequest


## Properties

Name | Type
------------ | -------------
`dni` | string
`nombres` | string
`apePaterno` | string
`apeMaterno` | string
`email` | string
`contrasena` | string
`rolesIds` | Array&lt;number&gt;

## Example

```typescript
import type { UsuarioRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "dni": null,
  "nombres": null,
  "apePaterno": null,
  "apeMaterno": null,
  "email": null,
  "contrasena": null,
  "rolesIds": null,
} satisfies UsuarioRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UsuarioRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


