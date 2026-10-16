
# CentroCostoResponse


## Properties

Name | Type
------------ | -------------
`centroCostoId` | number
`nombre` | string
`descripcion` | string
`activo` | boolean
`fechaRegistro` | Date

## Example

```typescript
import type { CentroCostoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "centroCostoId": null,
  "nombre": null,
  "descripcion": null,
  "activo": null,
  "fechaRegistro": null,
} satisfies CentroCostoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CentroCostoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


