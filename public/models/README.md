# 3D Suit Model Directory

Place your production `suit.glb` or `suit.gltf` inside this folder:

```
public/models/suit.glb
```

## Recommended Mesh Naming Convention

The application automatically maps meshes using `components/3d/meshMapping.ts`.
To achieve 1:1 plug-and-play mapping, name your Blender / Clo3D / Marvelous Designer meshes:

- **Jacket Body**: `jacket`, `jacket_body`, or `coat`
- **Lapel Variants**:
  - `lapel_notch` (Notch lapel geometry)
  - `lapel_peak` (Peak lapel geometry)
  - `lapel_shawl` (Shawl lapel geometry)
- **Trousers / Pants**: `trousers`, `pants`, or `suit_pants`
- **Shirt**: `shirt`, `dress_shirt`, or `collar`
- **Silk Tie**: `tie`, `necktie`, or `silk_tie`
- **Buttons**:
  - `button_single` (1-button stance)
  - `button_two` (2-button stance)
  - `buttons_db` (double-breasted 6x2 stance)
- **Pockets**:
  - `pocket_flap` (flap pocket)
  - `pocket_jetted` (besom jetted pocket)
  - `pocket_patch` (patch pocket)

## Fallback System

If `suit.glb` is not present, the website automatically displays the handcrafted procedural luxury atelier suit mannequin (`components/3d/StylizedSuitMannequin.tsx`), ensuring zero downtime or broken screens.
