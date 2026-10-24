
# UsuarioResponse


## Properties

Name | Type
------------ | -------------
`usuarioId` | number
`codigo` | string
`usuario` | string
`dni` | string
`nombres` | string
`apePaterno` | string
`apeMaterno` | string
`nombreCompleto` | string
`correo` | string
`rolId` | number
`nombreRol` | string
`descripcionRol` | string
`estado` | boolean
`estadoDsc` | string

## Example

```typescript
import type { UsuarioResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "usuarioId": null,
  "codigo": null,
  "usuario": null,
  "dni": null,
  "nombres": null,
  "apePaterno": null,
  "apeMaterno": null,
  "nombreCompleto": null,
  "correo": null,
  "rolId": null,
  "nombreRol": null,
  "descripcionRol": null,
  "estado": null,
  "estadoDsc": null,
} satisfies UsuarioResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UsuarioResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


