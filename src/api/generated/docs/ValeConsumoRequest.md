
# ValeConsumoRequest


## Properties

Name | Type
------------ | -------------
`fechaVale` | Date
`centroCostoId` | number
`solicitante` | string
`motivo` | string
`detalles` | [Array&lt;DetalleValeConsumoRequest&gt;](DetalleValeConsumoRequest.md)

## Example

```typescript
import type { ValeConsumoRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "fechaVale": null,
  "centroCostoId": null,
  "solicitante": null,
  "motivo": null,
  "detalles": null,
} satisfies ValeConsumoRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ValeConsumoRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


