
# PerfilUsuarioResponse


## Properties

Name | Type
------------ | -------------
`codigo` | string
`usuario` | string
`dni` | string
`nombres` | string
`apePaterno` | string
`apeMaterno` | string
`nombreCompleto` | string
`correo` | string
`nombreRol` | string
`estado` | boolean
`estadoDsc` | string

## Example

```typescript
import type { PerfilUsuarioResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "codigo": null,
  "usuario": null,
  "dni": null,
  "nombres": null,
  "apePaterno": null,
  "apeMaterno": null,
  "nombreCompleto": null,
  "correo": null,
  "nombreRol": null,
  "estado": null,
  "estadoDsc": null,
} satisfies PerfilUsuarioResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PerfilUsuarioResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


