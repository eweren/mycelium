# Backlog

Features die langfristig interessant sind, aber aktuell nicht priorisiert werden.

---

## Node Collaboration / Multi-User

Mehrere Nutzer auf demselben Canvas mit Echtzeit-Cursors (Figma-Style). Passt zum Spatial-Ansatz.

### Scope

- Cursor-Presence (wer ist wo auf dem Canvas)
- Gleichzeitiges Editieren / Forking von Branches
- Conflict Resolution bei gleichzeitigem Node-Move
- User-Avatare an Cursor und aktiven Nodes

### Voraussetzungen

- WebSocket- oder CRDT-basierte Sync-Schicht
- Server-Komponente für Session-Management
- Conversation Persistence (als Grundlage für shared state)

### Offene Fragen

- CRDT vs. OT vs. einfacher Last-Write-Wins?
- Hosting: self-hosted only oder auch Cloud?
- Granularität: Canvas-Level oder Node-Level Locking?

---

## Minimap / Navigation

Bei grossen Baumen wird Orientierung schwierig. Eine Minimap (wie in VS Code) mit Viewport-Indikator.

### Scope

- Minimap-Overlay (Ecke des Canvas, konfigurierbar)
- Viewport-Rechteck das die aktuelle Ansicht zeigt
- Klick auf Minimap navigiert dorthin
- Farbcodierung: User-Nodes, Assistant-Nodes, aktiver Node
- Optional: Minimap ein-/ausblendbar

### Voraussetzungen

- Performante Berechnung der Node-Bounding-Box
- Canvas-Rendering im Miniatur-Massstab (vereinfacht, keine Textinhalte)

### Offene Fragen

- SVG-basiert oder Canvas-Element?
- Feste Groesse oder proportional zum Viewport?
- Threshold: Ab wie vielen Nodes wird die Minimap angezeigt?
