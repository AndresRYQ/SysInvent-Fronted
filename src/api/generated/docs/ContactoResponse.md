
# ContactoResponse


## Properties

Name | Type
------------ | -------------
`contactoId` | number
`proveedorId` | number
`nombreCompleto` | string
`cargo` | string
`telefono` | string
`correo` | string
`activo` | boolean
`fechaRegistro` | Date

## Example

```typescript
import type { ContactoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "contactoId": null,
  "proveedorId": null,
  "nombreCompleto": null,
  "cargo": null,
  "telefono": null,
  "correo": null,
  "activo": null,
  "fechaRegistro": null,
} satisfies ContactoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ContactoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


