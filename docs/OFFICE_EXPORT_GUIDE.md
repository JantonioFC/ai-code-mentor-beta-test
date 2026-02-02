# Guía de Exportación Office - AI Code Mentor

Estrategias para exportar contenido a formatos PPTX y DOCX.

---

## 📊 PowerPoint (PPTX)

### Casos de Uso
- Exportar lecciones como presentaciones
- Crear resúmenes visuales de progreso
- Material de estudio offline

### Herramientas

| Herramienta | Propósito |
|-------------|-----------|
| `html2pptx.js` | HTML → PowerPoint |
| `pptxgenjs` | Creación programática |
| `python-pptx` | Manipulación en Python |

### Workflow Básico

```javascript
// Usando pptxgenjs (Node.js)
const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();

// Slide de título
const slide1 = pptx.addSlide();
slide1.addText('Mi Lección', { 
  x: 1, y: 1, 
  fontSize: 44, 
  bold: true 
});

// Slide de contenido
const slide2 = pptx.addSlide();
slide2.addText('Puntos clave:', { x: 0.5, y: 0.5, fontSize: 24 });
slide2.addText([
  { text: '• Concepto 1\n', bullet: true },
  { text: '• Concepto 2\n', bullet: true },
], { x: 0.5, y: 1.5 });

// Exportar
pptx.writeFile({ fileName: 'leccion.pptx' });
```

### Paletas de Colores Sugeridas

| Tema | Colores |
|------|---------|
| Profesional | Navy #1C2833, Gray #AAB7B8, White #F4F6F6 |
| Energético | Teal #5EA8A7, Coral #FE4447, White |
| Elegante | Burgundy #5D1D2E, Gold #997929, Cream |

---

## 📄 Word (DOCX)

### Casos de Uso
- Exportar notas de lecciones
- Generar certificados
- Crear documentos de referencia

### Herramientas

| Herramienta | Propósito |
|-------------|-----------|
| `docx` (npm) | Creación desde JS |
| `python-docx` | Creación desde Python |
| `pandoc` | Conversión Markdown → DOCX |

### Workflow Básico (Node.js)

```javascript
const { Document, Paragraph, TextRun, Packer } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: 'Título de Lección', bold: true, size: 48 })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun('Contenido de la lección...')
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('leccion.docx', buffer);
});
```

### Workflow con Pandoc

```bash
# Markdown a DOCX
pandoc leccion.md -o leccion.docx

# Con template personalizado
pandoc leccion.md --reference-doc=template.docx -o leccion.docx
```

---

## 🎯 Implementación Sugerida para AI Code Mentor

### Componente de Exportación

```javascript
// components/ExportLesson.js
export function ExportLesson({ lesson, format }) {
  const handleExport = async () => {
    const response = await fetch('/api/export', {
      method: 'POST',
      body: JSON.stringify({ lesson, format })
    });
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.title}.${format}`;
    a.click();
  };

  return (
    <button onClick={handleExport}>
      Exportar como {format.toUpperCase()}
    </button>
  );
}
```

### API Endpoint

```javascript
// pages/api/export.js
export default async function handler(req, res) {
  const { lesson, format } = req.body;

  if (format === 'pptx') {
    // Generar PPTX
    const buffer = await generatePPTX(lesson);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.send(buffer);
  } else if (format === 'docx') {
    // Generar DOCX
    const buffer = await generateDOCX(lesson);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  }
}
```

---

## 📦 Dependencias

```bash
# Node.js
npm install pptxgenjs docx

# Python
pip install python-pptx python-docx

# Sistema
sudo apt-get install pandoc libreoffice
```
