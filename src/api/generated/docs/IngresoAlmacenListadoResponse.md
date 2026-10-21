
# IngresoAlmacenListadoResponse


## Properties

Name | Type
------------ | -------------
`ingresoAlmacenId` | number
`numeroIngreso` | string
`fechaIngreso` | string
`proveedor` | string
`contacto` | string
`documento` | string
`productos` | number
`cantidadIngresada` | string
`total` | number
`estado` | string

## Example

```typescript
import type { IngresoAlmacenListadoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "ingresoAlmacenId": null,
  "numeroIngreso": null,
  "fechaIngreso": null,
  "proveedor": null,
  "contacto": null,
  "documento": null,
  "productos": null,
  "cantidadIngresada": null,
  "total": null,
  "estado": null,
} satisfies IngresoAlmacenListadoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as IngresoAlmacenListadoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


