import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM PLAZOS');
    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener plazos:', error);
    return new Response('Error al obtener plazos', { status: 500 });
  }
}
