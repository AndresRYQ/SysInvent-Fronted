
# ControlAlmacenMovimientoResponse


## Properties

Name | Type
------------ | -------------
`fecha` | Date
`movimiento` | string
`documento` | string
`cantidad` | number
`unidadMedida` | string
`destino` | string
`parteEquipo` | string
`centroCosto` | string
`responsable` | string
`estado` | string

## Example

```typescript
import type { ControlAlmacenMovimientoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "fecha": null,
  "movimiento": null,
  "documento": null,
  "cantidad": null,
  "unidadMedida": null,
  "destino": null,
  "parteEquipo": null,
  "centroCosto": null,
  "responsable": null,
  "estado": null,
} satisfies ControlAlmacenMovimientoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ControlAlmacenMovimientoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


