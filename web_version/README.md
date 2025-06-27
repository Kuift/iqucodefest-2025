# Super Quantum Party (Web Version)

This folder contains an experimental rewrite of the original Pygame prototype using **Phaser 3** and a minimal JavaScript quantum simulator. It runs entirely in the browser.

## Running the game

1. From the repository root, start a simple HTTP server. Any static server works. For example using Python:

```bash
python -m http.server 8000
```

2. Open your browser and navigate to `http://localhost:8000/web_version/`.

Use the **Space** key to roll the quantum dice. Use **Left** and **Right** arrows to choose a path at intersections and press **Space** to confirm.

This version embeds the map from `the_game/maps/new_map.yml` directly in JavaScript and uses a small subset of `muqcs.js` to emulate quantum dice rolls.

## Deploying to itch.io

Zip the contents of this folder so that `index.html` is at the archive root. Upload the zip as an HTML5 game on itch.io.

