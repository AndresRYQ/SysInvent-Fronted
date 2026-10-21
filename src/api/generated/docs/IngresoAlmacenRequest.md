
# IngresoAlmacenRequest


## Properties

Name | Type
------------ | -------------
`proveedorId` | number
`contactoId` | number
`tipoDocumentoId` | number
`numeroDocumento` | string
`fechaIngreso` | Date
`observacion` | string
`detalles` | [Array&lt;DetalleIngresoAlmacenRequest&gt;](DetalleIngresoAlmacenRequest.md)

## Example

```typescript
import type { IngresoAlmacenRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "proveedorId": null,
  "contactoId": null,
  "tipoDocumentoId": null,
  "numeroDocumento": null,
  "fechaIngreso": null,
  "observacion": null,
  "detalles": null,
} satisfies IngresoAlmacenRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as IngresoAlmacenRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


