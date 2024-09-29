const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '123',
    database: 'joyas',
    allowExitOnIdle: true
});

//paginas, límites, y ordenamiento
const obtenerJoyas = async (limits, page, order_by) => {
  try {
    const limite = parseInt(limits) || 10;
    const pagina = parseInt(page) || 1;
    const offset = (pagina - 1) * limite;

    const orden = (order_by && ['stock_ASC', 'stock_DESC', 'precio_ASC', 'precio_DESC'].includes(order_by))
      ? order_by.replace('_', ' ')
      : 'id ASC';

    const query = `
      SELECT * FROM inventario
      ORDER BY ${orden} 
      LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(query, [limite, offset]);
    return rows;
  } catch (error) {
    throw new Error('Error al obtener las joyas');
  }
};

const filtrarJoyas = async (precio_min, precio_max, categoria, metal) => {
  try {
    let query = `SELECT * FROM inventario WHERE 1=1`;
    const params = [];

    if (precio_min) {
      query += ` AND precio >= $${params.length + 1}`;
      params.push(precio_min);
    }
    if (precio_max) {
      query += ` AND precio <= $${params.length + 1}`;
      params.push(precio_max);
    }
    if (categoria) {
      query += ` AND categoria = $${params.length + 1}`;
      params.push(categoria);
    }
    if (metal) {
      query += ` AND metal = $${params.length + 1}`;
      params.push(metal);
    }

    const { rows } = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw new Error('Error al filtrar las joyas');
  }
};

const obtenerJoyaPorId = async (id) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inventario WHERE id = $1', [id]);
    return rows[0];
  } catch (error) {
    throw new Error('Error al obtener la joya');
  }
};

module.exports = {
  obtenerJoyas,
  filtrarJoyas,
  obtenerJoyaPorId
};
