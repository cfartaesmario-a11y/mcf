# Contador de calorías

Web: https://cfartaesmario-a11y.github.io/mcf/calorias/

Los datos están en `data.json`. Cada día se añade una entrada a `dias`:

```json
{
  "fecha": "2026-11-10",
  "comidas": [
    {
      "momento": "Desayuno",
      "items": [
        { "nombre": "Leche semidesnatada", "gramos": 250, "unidad": "ml", "kcal": 115, "nota": "Hacendado" }
      ]
    }
  ]
}
```

- `momento`: Desayuno, Almuerzo, Comida, Merienda, Cena, Picoteo…
- `gramos` y `kcal` son estimaciones a partir de fotos.
- `unidad` es opcional (por defecto `g`); `nota` es opcional (marca, supermercado).
