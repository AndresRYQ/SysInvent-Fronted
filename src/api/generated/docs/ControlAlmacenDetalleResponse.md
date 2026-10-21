
# ControlAlmacenDetalleResponse


## Properties

Name | Type
------------ | -------------
`productoId` | number
`codigo` | string
`producto` | string
`unidadMedida` | string
`totalEntradas` | number
`totalSalidas` | number
`stockDisponible` | number
`movimientos` | [Array&lt;MovimientoAlmacenDetalleResponse&gt;](MovimientoAlmacenDetalleResponse.md)

## Example

```typescript
import type { ControlAlmacenDetalleResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "productoId": null,
  "codigo": null,
  "producto": null,
  "unidadMedida": null,
  "totalEntradas": null,
  "totalSalidas": null,
  "stockDisponible": null,
  "movimientos": null,
} satisfies ControlAlmacenDetalleResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ControlAlmacenDetalleResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


