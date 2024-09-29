const express = require('express');
const { obtenerJoyas, filtrarJoyas, obtenerJoyaPorId } = require('./consultas'); // Importar funciones desde consultas.js

const app = express();

// Middleware
app.use((req, res, next) => {
  console.log(`Consulta realizada a la ruta: ${req.path}`);
  next();
});

app.get('/joyas', async (req, res) => {
  try {
    const { limits, page, order_by } = req.query;
    const joyas = await obtenerJoyas(limits, page, order_by);

    // Estructura HATEOAS
    const result = {
      totalJoyas: joyas.length,
      stockTotal: joyas.reduce((acc, curr) => acc + curr.stock, 0),
      results: joyas.map(row => ({
        name: row.nombre,
        href: `/joyas/joya/${row.id}`,
      })),
    };
    
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las joyas' });
  }
});

// Ruta GET /joyas/filtros
app.get('/joyas/filtros', async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    const joyasFiltradas = await filtrarJoyas(precio_min, precio_max, categoria, metal);
    res.json(joyasFiltradas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al filtrar las joyas' });
  }
});


app.get('/joyas/joya/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const joya = await obtenerJoyaPorId(id);

    if (!joya) {
      return res.status(404).json({ error: 'Joya no encontrada' });
    }

    res.json(joya);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la joya' });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
