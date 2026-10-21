
# ActividadReciente


## Properties

Name | Type
------------ | -------------
`fecha` | string
`tipo` | string
`documento` | string
`producto` | string
`cantidad` | number
`responsable` | string

## Example

```typescript
import type { ActividadReciente } from ''

// TODO: Update the object below with actual values
const example = {
  "fecha": null,
  "tipo": null,
  "documento": null,
  "producto": null,
  "cantidad": null,
  "responsable": null,
} satisfies ActividadReciente

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActividadReciente
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


