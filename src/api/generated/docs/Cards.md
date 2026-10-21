
# Cards


## Properties

Name | Type
------------ | -------------
`productosActivos` | number
`stockCritico` | number
`ingresosMes` | number
`valesMes` | number
`movimientosHoy` | number

## Example

```typescript
import type { Cards } from ''

// TODO: Update the object below with actual values
const example = {
  "productosActivos": null,
  "stockCritico": null,
  "ingresosMes": null,
  "valesMes": null,
  "movimientosHoy": null,
} satisfies Cards

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Cards
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


