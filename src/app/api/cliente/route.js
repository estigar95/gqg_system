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