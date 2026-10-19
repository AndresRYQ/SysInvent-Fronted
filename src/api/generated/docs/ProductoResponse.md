
# ProductoResponse


## Properties

Name | Type
------------ | -------------
`productoId` | number
`codigo` | string
`nombre` | string
`descripcion` | string
`tipoProductoId` | number
`tipoProductoNombre` | string
`categoriaId` | number
`categoriaNombre` | string
`unidadMedidaId` | number
`unidadMedidaNombre` | string
`proveedorId` | number
`proveedorRazonSocial` | string
`stockActual` | number
`stockMinimo` | number
`precioUnitario` | number
`activo` | boolean
`fechaRegistro` | string

## Example

```typescript
import type { ProductoResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "productoId": null,
  "codigo": null,
  "nombre": null,
  "descripcion": null,
  "tipoProductoId": null,
  "tipoProductoNombre": null,
  "categoriaId": null,
  "categoriaNombre": null,
  "unidadMedidaId": null,
  "unidadMedidaNombre": null,
  "proveedorId": null,
  "proveedorRazonSocial": null,
  "stockActual": null,
  "stockMinimo": null,
  "precioUnitario": null,
  "activo": null,
  "fechaRegistro": null,
} satisfies ProductoResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProductoResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


