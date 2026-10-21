
# DashboardResponse


## Properties

Name | Type
------------ | -------------
`cards` | [Cards](Cards.md)
`seguimiento` | [Array&lt;Alerta&gt;](Alerta.md)
`actividadReciente` | [Array&lt;ActividadReciente&gt;](ActividadReciente.md)

## Example

```typescript
import type { DashboardResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "cards": null,
  "seguimiento": null,
  "actividadReciente": null,
} satisfies DashboardResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DashboardResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


