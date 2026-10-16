
# DestinoResponse


## Properties

Name | Type
------------ | -------------
`destinoId` | number
`nombre` | string
`descripcion` | string
`activo` | boolean
`fechaRegistro` | Date

## Example

```typescript
import type { DestinoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "destinoId": null,
  "nombre": null,
  "descripcion": null,
  "activo": null,
  "fechaRegistro": null,
} satisfies DestinoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DestinoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


