
# ReporteValeListadoResponse


## Properties

Name | Type
------------ | -------------
`valeConsumoId` | number
`numeroVale` | string
`fechaVale` | string
`centroCosto` | string
`solicitante` | string
`codigoProducto` | string
`producto` | string
`destino` | string
`parteEquipo` | string
`cantidad` | number
`unidadMedida` | string
`precio` | number
`subtotal` | number
`estado` | string

## Example

```typescript
import type { ReporteValeListadoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "valeConsumoId": null,
  "numeroVale": null,
  "fechaVale": null,
  "centroCosto": null,
  "solicitante": null,
  "codigoProducto": null,
  "producto": null,
  "destino": null,
  "parteEquipo": null,
  "cantidad": null,
  "unidadMedida": null,
  "precio": null,
  "subtotal": null,
  "estado": null,
} satisfies ReporteValeListadoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReporteValeListadoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


