
# CategoriaCatalogoResponse


## Properties

Name | Type
------------ | -------------
`id` | number
`nombre` | string
`descripcion` | string
`activo` | boolean
`fechaRegistro` | string

## Example

```typescript
import type { CategoriaCatalogoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "nombre": null,
  "descripcion": null,
  "activo": null,
  "fechaRegistro": null,
} satisfies CategoriaCatalogoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CategoriaCatalogoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


