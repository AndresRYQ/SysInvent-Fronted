
# IngresoAlmacenResponse


## Properties

Name | Type
------------ | -------------
`ingresoAlmacenId` | number
`numeroIngreso` | string
`fechaIngreso` | Date
`fechaRegistro` | Date
`proveedorId` | number
`proveedor` | string
`contactoId` | number
`contacto` | string
`tipoDocumentoId` | number
`tipoDocumento` | string
`numeroDocumento` | string
`observacion` | string
`estado` | string
`total` | number
`detalles` | [Array&lt;DetalleIngresoAlmacenResponse&gt;](DetalleIngresoAlmacenResponse.md)
`id` | number

## Example

```typescript
import type { IngresoAlmacenResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "ingresoAlmacenId": null,
  "numeroIngreso": null,
  "fechaIngreso": null,
  "fechaRegistro": null,
  "proveedorId": null,
  "proveedor": null,
  "contactoId": null,
  "contacto": null,
  "tipoDocumentoId": null,
  "tipoDocumento": null,
  "numeroDocumento": null,
  "observacion": null,
  "estado": null,
  "total": null,
  "detalles": null,
  "id": null,
} satisfies IngresoAlmacenResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as IngresoAlmacenResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


