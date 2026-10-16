
# ProveedorRequest


## Properties

Name | Type
------------ | -------------
`ruc` | string
`razonSocial` | string
`correo` | string
`telefono` | string
`direccion` | string

## Example

```typescript
import type { ProveedorRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "ruc": null,
  "razonSocial": null,
  "correo": null,
  "telefono": null,
  "direccion": null,
} satisfies ProveedorRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProveedorRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


