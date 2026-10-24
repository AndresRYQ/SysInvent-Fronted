
# ActualizarPerfilRequest


## Properties

Name | Type
------------ | -------------
`nombres` | string
`apePaterno` | string
`apeMaterno` | string
`email` | string

## Example

```typescript
import type { ActualizarPerfilRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "nombres": null,
  "apePaterno": null,
  "apeMaterno": null,
  "email": null,
} satisfies ActualizarPerfilRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActualizarPerfilRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


