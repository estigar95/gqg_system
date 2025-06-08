// src/app/api/cliente/route.js
import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM CLIENTES WHERE activo = 1');
    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return new Response('Error al obtener clientes', { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      nombres,
      apellidos,
      documentonro,
      direccion,
      email,
      telefono,
      activo
    } = data;
    
    // Obtiene el último id usado y suma 1
    const result = await pool.query('SELECT COALESCE(MAX(id), 0) AS maxid FROM CLIENTES');
    const newId = result.rows[0].maxid + 1;
    
    const query = `
      INSERT INTO CLIENTES 
        (id, nombres, apellidos, documentonro, direccion, email, telefono, activo)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      newId,
      nombres,
      apellidos,
      documentonro,
      direccion,
      email,
      telefono,
      activo
    ];

    const { rows } = await pool.query(query, values);
    return Response.json(rows[0]);
  } catch (error) {
    console.error('Error al insertar cliente:', error);
    return new Response('Error al insertar cliente', { status: 500 });
  }
}