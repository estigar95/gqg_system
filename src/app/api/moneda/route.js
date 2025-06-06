import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM MONEDAS WHERE activo = 1');
    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener monedas:', error);
    return new Response('Error al obtener monedas', { status: 500 });
  }
}
