
# ReporteIngresoListadoResponse


## Properties

Name | Type
------------ | -------------
`ingresoAlmacenId` | number
`numeroIngreso` | string
`fechaIngreso` | string
`proveedor` | string
`documento` | string
`tipoProducto` | string
`producto` | string
`cantidad` | number
`unidadMedida` | string
`precioUnitario` | number
`subtotal` | number
`estado` | string

## Example

```typescript
import type { ReporteIngresoListadoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "ingresoAlmacenId": null,
  "numeroIngreso": null,
  "fechaIngreso": null,
  "proveedor": null,
  "documento": null,
  "tipoProducto": null,
  "producto": null,
  "cantidad": null,
  "unidadMedida": null,
  "precioUnitario": null,
  "subtotal": null,
  "estado": null,
} satisfies ReporteIngresoListadoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReporteIngresoListadoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


