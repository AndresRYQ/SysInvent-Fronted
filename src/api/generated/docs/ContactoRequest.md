
# ContactoRequest


## Properties

Name | Type
------------ | -------------
`proveedorId` | number
`nombreCompleto` | string
`cargo` | string
`telefono` | string
`correo` | string

## Example

```typescript
import type { ContactoRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "proveedorId": null,
  "nombreCompleto": null,
  "cargo": null,
  "telefono": null,
  "correo": null,
} satisfies ContactoRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ContactoRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


