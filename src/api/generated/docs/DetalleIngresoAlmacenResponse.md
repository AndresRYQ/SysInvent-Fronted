
# DetalleIngresoAlmacenResponse


## Properties

Name | Type
------------ | -------------
`detalleIngresoAlmacenId` | number
`productoId` | number
`codigoProducto` | string
`nombreProducto` | string
`unidadMedida` | string
`cantidad` | number
`precioUnitario` | number
`subtotal` | number
`stockResultante` | number

## Example

```typescript
import type { DetalleIngresoAlmacenResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "detalleIngresoAlmacenId": null,
  "productoId": null,
  "codigoProducto": null,
  "nombreProducto": null,
  "unidadMedida": null,
  "cantidad": null,
  "precioUnitario": null,
  "subtotal": null,
  "stockResultante": null,
} satisfies DetalleIngresoAlmacenResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DetalleIngresoAlmacenResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


