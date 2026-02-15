# Matured Node Type System

Plugin-artiges System fuer Custom Node Types mit formalisiertem Registry-Pattern und Lifecycle-Hooks. Ersetzt/erweitert den aktuellen `componentMap`-Ansatz.

## Motivation

- `componentMap` ist ein einfacher `Record<string, Component>` ohne Validierung, Defaults oder Lifecycle
- Custom Nodes (Code-Execution, Diagramme, Tabellen, Formulare) brauchen mehr Struktur:
  - Eigene Serialisierung/Deserialisierung
  - Toolbar-Actions pro Node-Typ
  - Validierung von `node.data`
  - Default-Groessen und Layout-Hints

## Scope

### NodeTypeDefinition

```typescript
interface NodeTypeDefinition<TData = unknown> {
  /** Unique type identifier (e.g. "code-execution", "diagram"). */
  type: string;
  /** Human-readable label. */
  label: string;
  /** Svelte component to render this node. */
  component: Component;
  /** Optional icon (emoji or SVG string). */
  icon?: string;
  /** Default width/height hints for layout. */
  defaultSize?: { width?: number; minHeight?: number };
  /** Validate node.data when creating/updating. */
  validateData?: (data: unknown) => data is TData;
  /** Serialize node.data for export (strip non-serializable parts). */
  serializeData?: (data: TData) => unknown;
  /** Deserialize node.data on import. */
  deserializeData?: (raw: unknown) => TData;
  /** Toolbar actions shown when this node type is active. */
  actions?: NodeTypeAction[];
  /** Called when a node of this type is created. */
  onCreate?: (node: Node) => void;
  /** Called when a node of this type is removed. */
  onDestroy?: (node: Node) => void;
}

interface NodeTypeAction {
  id: string;
  label: string;
  icon?: string;
  handler: (node: Node, engine: TraekEngine) => void;
}
```

### NodeTypeRegistry

```typescript
class NodeTypeRegistry {
  /** Register a node type definition. */
  register(definition: NodeTypeDefinition): void;
  /** Unregister by type string. */
  unregister(type: string): void;
  /** Get definition by type. */
  get(type: string): NodeTypeDefinition | undefined;
  /** List all registered types. */
  list(): NodeTypeDefinition[];
  /** Check if a type is registered. */
  has(type: string): boolean;
}
```

### Built-in Node Types

Die bestehenden Typen (`text`, `thought`) werden als erste NodeTypeDefinitions registriert:

- **`text`**: TextNode-Komponente, Markdown-Rendering, kein spezielles Data-Schema
- **`thought`**: Gedanken-Panel, wird im TraekNodeWrapper gehandhabt

### Integration in TraekCanvas

- Neuer Prop: `registry?: NodeTypeRegistry` (alternativ zu `componentMap`)
- Wenn `registry` gesetzt ist, wird `componentMap` ignoriert
- Node-Rendering: `registry.get(node.type)?.component` statt `componentMap[node.type]`
- Toolbar: Wenn der aktive Node einen registrierten Typ mit `actions` hat, zeige Toolbar-Buttons

### Migration von componentMap

- `componentMap` bleibt als einfache Alternative bestehen (kein Breaking Change)
- Intern wird `componentMap` in ein minimales Registry konvertiert
- Neue API ist opt-in

## Beispiel: Code-Execution Node

```typescript
const codeExecutionType: NodeTypeDefinition<CodeData> = {
  type: 'code-execution',
  label: 'Code',
  component: CodeExecutionNode,
  icon: '💻',
  defaultSize: { minHeight: 200 },
  validateData: (data): data is CodeData =>
    typeof data === 'object' && data !== null && 'language' in data,
  actions: [
    {
      id: 'run',
      label: 'Run',
      icon: '▶',
      handler: (node, engine) => { /* execute code */ }
    },
    {
      id: 'clear-output',
      label: 'Clear Output',
      handler: (node, engine) => { /* clear */ }
    }
  ],
  onCreate: (node) => console.log('Code node created:', node.id),
};

registry.register(codeExecutionType);
```

## Aenderungen an bestehenden Dateien

| Datei | Aenderung |
|-------|-----------|
| `TraekCanvas.svelte` | Neuer `registry` Prop, Rendering-Logik erweitern, Toolbar-UI |
| `TraekEngine.svelte.ts` | `addNode()` ruft `onCreate` auf, `removeNode()` ruft `onDestroy` auf |
| `index.ts` | Neue Exports |

## Neue Dateien

| Datei | Beschreibung |
|-------|-------------|
| `src/lib/node-types/types.ts` | `NodeTypeDefinition`, `NodeTypeAction` |
| `src/lib/node-types/NodeTypeRegistry.ts` | Registry-Klasse |
| `src/lib/node-types/builtins.ts` | Built-in Registrations (text, thought) |
| `src/lib/node-types/NodeToolbar.svelte` | Toolbar-UI fuer Node-Actions |

## Offene Fragen

- Soll das Registry reaktiv sein (`$state` Map) damit dynamisches Registrieren/Deregistrieren die UI updated?
- Toolbar-Position: Ueber dem Node, als Sidebar, oder als Floating-Element?
- Sollen Node-Typen auch eigene Connection-Styles definieren koennen?
- Priority: Vor oder nach Conversation Persistence? (Persistence profitiert von `serializeData`/`deserializeData`)

## Verifikation

1. Bestehende `componentMap`-Nutzung funktioniert weiterhin
2. Registry mit Custom Node Type → korrektes Rendering
3. `actions` auf Node Type → Toolbar erscheint bei aktivem Node
4. `onCreate`/`onDestroy` Hooks werden korrekt aufgerufen
5. `validateData` verhindert ungueltige Node-Daten
