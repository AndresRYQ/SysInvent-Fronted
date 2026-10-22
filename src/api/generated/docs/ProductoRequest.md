
# ProductoRequest


## Properties

Name | Type
------------ | -------------
`codigo` | string
`nombre` | string
`descripcion` | string
`tipoProductoId` | number
`categoriaId` | number
`unidadMedidaId` | number
`proveedorId` | number
`stockMinimo` | number
`precioUnitario` | number

## Example

```typescript
import type { ProductoRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "codigo": null,
  "nombre": null,
  "descripcion": null,
  "tipoProductoId": null,
  "categoriaId": null,
  "unidadMedidaId": null,
  "proveedorId": null,
  "stockMinimo": null,
  "precioUnitario": null,
} satisfies ProductoRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProductoRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


