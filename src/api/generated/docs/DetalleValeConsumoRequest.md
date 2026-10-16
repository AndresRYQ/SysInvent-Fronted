
# DetalleValeConsumoRequest


## Properties

Name | Type
------------ | -------------
`productoId` | number
`precioUnitario` | number
`distribuciones` | [Array&lt;DistribucionValeConsumoRequest&gt;](DistribucionValeConsumoRequest.md)

## Example

```typescript
import type { DetalleValeConsumoRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "productoId": null,
  "precioUnitario": null,
  "distribuciones": null,
} satisfies DetalleValeConsumoRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DetalleValeConsumoRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


