
# ValeConsumoListadoResponse


## Properties

Name | Type
------------ | -------------
`id` | number
`numeroVale` | string
`fechaVale` | Date
`centroCosto` | string
`solicitante` | string
`productos` | number
`destinos` | number
`cantidadTotal` | number
`total` | number
`estado` | string

## Example

```typescript
import type { ValeConsumoListadoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "numeroVale": null,
  "fechaVale": null,
  "centroCosto": null,
  "solicitante": null,
  "productos": null,
  "destinos": null,
  "cantidadTotal": null,
  "total": null,
  "estado": null,
} satisfies ValeConsumoListadoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ValeConsumoListadoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


