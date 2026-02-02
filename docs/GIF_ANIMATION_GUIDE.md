# Creación de GIFs Animados - AI Code Mentor

Toolkit para crear GIFs para comunicación y feedback visual.

---

## 📏 Especificaciones

### Dimensiones

| Tipo | Tamaño | FPS | Duración |
|------|--------|-----|----------|
| Emoji/Icon | 128x128 | 10 | <3s |
| Badge | 256x256 | 15 | 2-4s |
| Demo | 480x480 | 20 | <10s |

### Optimización

| Parámetro | Valor | Impacto |
|-----------|-------|---------|
| FPS | 10-15 | Menor = archivo más pequeño |
| Colores | 48-128 | Menos = más pequeño |
| Duración | Corta | Menos frames = más pequeño |

---

## 🛠️ Workflow Básico (Python)

```python
from PIL import Image, ImageDraw

frames = []
size = 128

for i in range(12):
    frame = Image.new('RGB', (size, size), (255, 255, 255))
    draw = ImageDraw.Draw(frame)
    
    # Animar posición con seno
    import math
    offset = int(math.sin(i / 12 * 2 * math.pi) * 20)
    
    # Dibujar círculo bounceando
    draw.ellipse([
        40, 40 + offset,
        88, 88 + offset
    ], fill='#3b82f6')
    
    frames.append(frame)

# Guardar
frames[0].save(
    'bounce.gif',
    save_all=True,
    append_images=frames[1:],
    duration=100,  # ms por frame
    loop=0,
    optimize=True
)
```

---

## 🎨 Conceptos de Animación

### Shake/Vibrar
```python
offset_x = math.sin(i * 2) * 3
offset_y = math.cos(i * 2) * 2
```

### Pulso/Heartbeat
```python
scale = 1 + 0.2 * math.sin(i / frames * 2 * math.pi)
```

### Bounce
```python
# Caída con gravedad
y = initial_y + velocity * t + 0.5 * gravity * t**2
```

### Spin
```python
angle = (i / total_frames) * 360
rotated = image.rotate(angle, resample=Image.BICUBIC)
```

### Fade In/Out
```python
alpha = int(255 * (i / total_frames))  # Fade in
```

---

## 🎯 Casos de Uso en AI Code Mentor

### Badge de Logro Animado

```python
def create_achievement_gif(text, color='#10b981'):
    frames = []
    
    for i in range(20):
        frame = Image.new('RGBA', (128, 128), (0, 0, 0, 0))
        draw = ImageDraw.Draw(frame)
        
        # Escala con bounce
        progress = i / 19
        if progress < 0.5:
            scale = progress * 2
        else:
            scale = 1 + 0.1 * math.sin((progress - 0.5) * 4 * math.pi)
        
        r = int(50 * scale)
        center = 64
        
        draw.ellipse([
            center - r, center - r,
            center + r, center + r
        ], fill=color)
        
        frames.append(frame)
    
    return frames
```

### Indicador de Loading

```python
def create_loading_gif(color='#3b82f6'):
    frames = []
    
    for i in range(12):
        frame = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
        draw = ImageDraw.Draw(frame)
        
        # 8 puntos rotando
        for j in range(8):
            angle = (j / 8 + i / 12) * 2 * math.pi
            x = 32 + math.cos(angle) * 20
            y = 32 + math.sin(angle) * 20
            
            # Opacidad decrece
            alpha = int(255 * ((8 - j) / 8))
            
            draw.ellipse([x-4, y-4, x+4, y+4], fill=color)
        
        frames.append(frame)
    
    return frames
```

---

## 📦 Dependencias

```bash
pip install pillow imageio numpy
```

---

## 💡 Tips de Calidad

- **Líneas gruesas:** `width=2` mínimo, no `width=1`
- **Gradientes:** Agregar profundidad al fondo
- **Capas:** Combinar formas para complejidad
- **Colores:** Vibrantes y con contraste
- **Suavizado:** `resample=Image.BICUBIC` en rotaciones
