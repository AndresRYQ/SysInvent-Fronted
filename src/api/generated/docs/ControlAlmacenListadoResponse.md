
# ControlAlmacenListadoResponse


## Properties

Name | Type
------------ | -------------
`productoId` | number
`codigo` | string
`producto` | string
`unidadMedida` | string
`tipo` | string
`categoria` | string
`proveedor` | string
`entradas` | number
`salidas` | number
`stock` | number
`estado` | string

## Example

```typescript
import type { ControlAlmacenListadoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "productoId": null,
  "codigo": null,
  "producto": null,
  "unidadMedida": null,
  "tipo": null,
  "categoria": null,
  "proveedor": null,
  "entradas": null,
  "salidas": null,
  "stock": null,
  "estado": null,
} satisfies ControlAlmacenListadoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ControlAlmacenListadoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


