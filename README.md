# Webplot

A tool for organizing ideas, featuring nodes that support rich text. This project aims to create an intuitive and visually appealing editor for network graphs.
This project is a work in progress and serves as a personal tool for idea organization. Its features aim to make graph-based thinking and planning more intuitive and visually engaging.
It is much simpler and easy to use compare to other products in making mind maps or other network diagrams.

## Features

- **Rich Text Nodes**: Each node in the graph can contain rich text, allowing for detailed and flexible content.
- **Customizable Design**: Nodes can be styled to look like sticky notes, with features like pushpins for added aesthetics.
- **Interactive Editing**: Right-click menus for nodes and the canvas make editing seamless.
- **Advanced Visuals**: Uses [AntV G6](https://g6.antv.antgroup.com/) for rendering high-quality topology graphs.

## Usage
1. **Installation**: Clone the repository to your device.
2. **Dependencies**: Install the necessary Python packages using `pip install -r requirements.txt`.
3. **Run**: Run `python main.py` to start the application.

The executable file built with Pyinstaller is on progress.

## Tech Stack

- **Backend**: Python
- **Frontend**: JavaScript, HTML (using [Layui](https://github.com/layui/layui))
- **Application Framework**: [pywebView](https://github.com/r0x0r/pywebview)

## Progress

| Feature                     | Status   | Notes                                                             |
|-----------------------------| -------- |-------------------------------------------------------------------|
| Displaying topology graphs  | ✅ Done   |                                                                   |
| File reading and saving     | ✅ Done   | Supports saving and loading graph data.                           |
| Node content editing        | ✅ Done   | Tested with rich text and images.                                 |
| Right-click menus           | ✅ Done   | Context menus for both nodes and the canvas are functional.       |
| Combo features              | ✅ Done   | Includes right-click menu options.                                |
| Window size synchronization | ✅ Done | Match HTML and app window sizes, especially for maximize/restore. |
| Undo redo                   | ✅ Done   | Implemented with deep clone but needs further adjustments         |
| Settings                    | 🚧 To-Do | A poor version of configuration is provided                       |
| User-friendly features      | ✅ Done | Include shortcuts and a toolbar for better usability.             |
 | PyInstaller                 | 🚧 To-Do | Build release version for the app                                 | 
| Node customization          | 🚧 To-Do |                                                                   |
| AI integration              | 🚧 To-Do | Explore AI-powered features.                                      |


---

Webplot is under **MIT License**.
