# Componentes reutilizables

Importar desde `components/ui`. `SearchBar` se encuentra en
`components/common/SearchBar`. Usan Bootstrap (cargado por la aplicación) y
los estilos existentes de `maestros.css`. No contienen servicios ni reglas
de negocio, por lo que pueden utilizarse en cualquier módulo.

| Componente | Propiedades |
| --- | --- |
| Button | Atributos nativos, `variant`: primary, secondary o danger; `loading` deshabilita el botón. Por defecto `type="button"`. |
| Input | Atributos nativos, `label` obligatorio, `hint`, `error`. ID automático y descripciones accesibles. |
| Select | Igual que Input; `options` recibe objetos con `value`, `label` y `disabled` opcional. |
| FormField | `id`, `label`, `hint`, `error` y contenido hijo. Para otros controles, vincular el ID, aria-describedby y aria-invalid del hijo. |
| DataTable | `data`, `columns`, `rowKey`, `caption`, `emptyMessage`, `loading`. Cada columna define `key`, `header`, `render` y `className` opcional. |
| Modal | `open`, `title`, `onClose`, contenido hijo, `footer`, `size`: sm, md o lg; `closeOnBackdrop`. Escape solicita cerrar y se restaura el foco al cerrarse. |
| SearchBar | Propiedades de Input con `type="search"`. Usar dentro de un formulario para buscar con Enter. |
| TablePagination | Componente existente para total, página, tamaño y callbacks; el módulo pagina las filas antes de entregarlas a DataTable. |

## Formulario de productos

Las variables y callbacks de estos ejemplos pertenecen al módulo consumidor.

```tsx
import { Button, Input, Select, Modal } from '../../components/ui'

<Modal open={abierto} title="Producto" onClose={() => setAbierto(false)}>
  <form onSubmit={(event) => { event.preventDefault(); guardar() }}>
    <Input label="Nombre" name="nombre" required value={nombre}
      error={errorNombre} onChange={(event) => setNombre(event.target.value)} />
    <Select label="Estado" value={estado}
      onChange={(event) => setEstado(event.target.value)}
      options={[{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }]} />
    <Button type="submit" loading={guardando}>Guardar</Button>
  </form>
</Modal>
```

## Consulta de categorías

```tsx
import { Button, DataTable, type DataTableColumn } from '../../components/ui'
import { SearchBar } from '../../components/common/SearchBar'

type Categoria = { id: string; nombre: string }
const columnas: DataTableColumn<Categoria>[] = [
  { key: 'id', header: 'Código', render: (fila) => fila.id },
  { key: 'nombre', header: 'Nombre', render: (fila) => fila.nombre },
]

<>
  <form onSubmit={(event) => { event.preventDefault(); buscar() }}>
    <SearchBar label="Buscar categoría" value={busqueda}
      onChange={(event) => setBusqueda(event.target.value)} />
    <Button type="submit">Buscar</Button>
  </form>
  <DataTable data={categorias} columns={columnas} rowKey={(fila) => fila.id}
    caption="Categorías" loading={cargando} />
</>
```

Mantener el estado, filtros, validación y operaciones de datos en cada módulo.
Los controles aceptan `name`, `required`, `disabled`, `ref` y eventos nativos.
Usar claves estables para filas y columnas, y `aria-label` para botones de solo iconos.
`Modal.onClose` debe actualizar `open` a false. Requiere un navegador con
soporte de `HTMLDialogElement.showModal`. Los ejemplos son una guía de integración;
las pantallas existentes no se han migrado.
