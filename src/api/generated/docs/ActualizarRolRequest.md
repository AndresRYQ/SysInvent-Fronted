
# ActualizarRolRequest


## Properties

Name | Type
------------ | -------------
`rolId` | number
`nombre` | string
`descripcion` | string
`modulos` | Array&lt;number&gt;

## Example

```typescript
import type { ActualizarRolRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "rolId": null,
  "nombre": null,
  "descripcion": null,
  "modulos": null,
} satisfies ActualizarRolRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActualizarRolRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


