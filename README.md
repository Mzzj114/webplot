# Network Graph Editor

A tool for organizing ideas, featuring nodes that support rich text. This project aims to create an intuitive and visually appealing editor for network graphs.

## Features

- **Rich Text Nodes**: Each node in the graph can contain rich text, allowing for detailed and flexible content.
- **Customizable Design**: Nodes can be styled to look like sticky notes, with features like pushpins for added aesthetics.
- **Interactive Editing**: Right-click menus for nodes and the canvas make editing seamless.
- **Advanced Visuals**: Uses [AntV G6](https://g6.antv.antgroup.com/) for rendering high-quality topology graphs.

## Tech Stack

- **Backend**: Python
- **Frontend**: JavaScript, HTML (using Layui)
- **Application Framework**: pywebView

## Progress

| Feature                     | Status   | Notes                                                                |
| --------------------------- | -------- | -------------------------------------------------------------------- |
| Displaying topology graphs  | ✅ Done   |                                                                      |
| File reading and saving     | ✅ Done   | Supports saving and loading graph data.                              |
| Node content editing        | ✅ Done   | Tested with rich text and images.                                    |
| Canvas resizing             | ✅ Done   | Fully resizable canvas.                                              |
| Node aesthetics             | ✅ Done   | Styled nodes to resemble sticky notes with optional pushpin icons.   |
| Right-click menus           | ✅ Done   | Context menus for both nodes and the canvas are functional.          |
| Combo features              | ✅ Done   | Includes right-click menu options.                                   |
| Internationalization (i18n) | 🚧 To-Do | Plan to localize directly to English (l10n).                         |
| Window size synchronization | 🚧 To-Do | Match HTML and app window sizes, especially for maximize/restore.    |
| Undo functionality          | ✅ Done   | Implemented with deep copy but needs further testing for robustness. |
| Settings                    | 🚧 To-Do | Add configuration options.                                           |
| User-friendly features      | 🚧 To-Do | Include shortcuts and a toolbar for better usability.                |
| Optimization                | 🚧 To-Do | Improve performance and UI responsiveness.                           |
| AI integration              | 🚧 To-Do | Explore AI-powered features.                                         |
| Community repository        | 🚧 To-Do | Consider creating a community-driven plugin system.                  |

## Future Plans

- Add **AI capabilities** for node suggestions and graph optimization.
- Build a **community repository** to share graph templates and plugins.
- Continuously improve **user experience** with shortcuts, toolbars, and settings.

---

This project is a work in progress and serves as a personal tool for idea organization. While it isn't publicly shared, its features aim to make graph-based thinking and planning more intuitive and visually engaging.
