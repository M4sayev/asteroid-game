# 2D Asteroid Game
Fast-paced two-player arcade shooter built with TypeScript and HTML canvas, normal-collision, color selection, and an accessible menu system.


## 🎮 Gameplay

Two players share the same screen

Control agile ships with momentum-based movement

Shoot projectiles to eliminate your opponent

Dodge and collide with asteroids that bounce and interact with players

Last ship standing wins

Asteroids and players collide using simple physics-based reflection, making every match chaotic and unpredictable.


## 🕹️ Controls
Player One

Move: W, A, S, D
Shoot: T

Player Two
Move: Arrow keys
Shoot: M

Controls are displayed in the Settings menu with visual indicators for each key.


## ♿ Accessibility

Keyboard-only navigation supported

Focus trapping in modal dialogs

ARIA attributes for interactive elements

Visual feedback for selected options


## ⚙️ Features

⚡ Real-time game loop using requestAnimationFrame

🧠 Object-oriented entity system (Ship, Asteroid, Projectile)

💥 Collision detection with bounce physics

🎨 Customizable player ship colors

⏸️ Pause & resume menu

🎯 Diagonal movement normalization

🖼️ Sprite-based rendering with rotation

🔁 Screen wrap-around mechanics

🧩 Modular, scalable TypeScript architecture


## 🗂️ Project Structure

```
src/
├── assets/          # Custom game assets (background, ships, projectiles, asteroid)
├── entities/        # Game objects (Ship, Asteroid, Projectile)
├── menu/            # Menus, settings, state
├── constants/       # Controls, game constants
├── utils/           # Helpers and utilities
├── types/           # Shared TypeScript types
├── main.ts          # Game bootstrap
└── game.ts          # Core game loop
```


## 🧠 Design Notes

The game uses axis-aligned bounding box (AABB) collision detection

Entities share a common BaseEntity class

Physics behavior is intentionally arcade-style rather than realistic

Architecture is designed to be extensible (AI players, power-ups, scoring)


## 🛠️ Possible Improvements

Score tracking & rounds

Sound effects and music

Particle effects


