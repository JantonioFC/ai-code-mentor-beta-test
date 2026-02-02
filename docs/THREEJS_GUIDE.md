# Visualizaciones 3D con Three.js - AI Code Mentor

Guía para agregar elementos 3D interactivos.

---

## 🎮 Casos de Uso

- Visualizar estructuras de datos (árboles, grafos)
- Animaciones de algoritmos
- Representaciones de arquitectura de software
- Badges y logros animados

---

## 🛠️ Setup Básico

### Dependencias

```bash
npm install three @react-three/fiber @react-three/drei
```

### Componente Base

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Tu contenido 3D aquí */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      
      <OrbitControls />
    </Canvas>
  );
}
```

---

## 📊 Ejemplos para Educación

### Visualizar Árbol Binario

```jsx
function BinaryTreeNode({ value, position, depth = 0 }) {
  const childOffset = 2 / (depth + 1);
  
  return (
    <group position={position}>
      {/* Nodo */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Valor del nodo */}
      <Text position={[0, 0, 0.4]} fontSize={0.2}>
        {value}
      </Text>
      
      {/* Hijos recursivos */}
      {value.left && (
        <BinaryTreeNode 
          value={value.left} 
          position={[-childOffset, -1, 0]} 
          depth={depth + 1}
        />
      )}
    </group>
  );
}
```

### Badge de Logro 3D

```jsx
function AchievementBadge({ icon, color, animate }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (animate) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[1, 1, 0.2, 32]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}
```

---

## 💡 Patrones Útiles

### Animación Automática

```jsx
import { useFrame } from '@react-three/fiber';

function RotatingCube() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
```

### Interactividad

```jsx
function ClickableCube() {
  const [active, setActive] = useState(false);

  return (
    <mesh 
      onClick={() => setActive(!active)}
      scale={active ? 1.5 : 1}
    >
      <boxGeometry />
      <meshStandardMaterial color={active ? 'hotpink' : 'orange'} />
    </mesh>
  );
}
```

---

## ⚡ Performance Tips

| Problema | Solución |
|----------|----------|
| FPS bajo | Reducir polígonos, usar instancing |
| Memoria alta | Dispose de geometrías/materiales |
| Carga lenta | Lazy load con Suspense |
| Mobile lento | Detectar y simplificar |

### Instancing para Muchos Objetos

```jsx
function ManyBoxes({ count = 1000 }) {
  const meshRef = useRef();
  
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const matrix = new Matrix4();
      matrix.setPosition(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      meshRef.current.setMatrixAt(i, matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="blue" />
    </instancedMesh>
  );
}
```

---

## 🎯 Integración con AI Code Mentor

### Idea: Visualizador de Progreso 3D

```jsx
// Esfera que crece con el progreso
function ProgressSphere({ progress }) {
  return (
    <Canvas>
      <ambientLight />
      <mesh scale={progress / 100}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={`hsl(${progress * 1.2}, 70%, 50%)`}
          metalness={0.5}
        />
      </mesh>
    </Canvas>
  );
}
```
