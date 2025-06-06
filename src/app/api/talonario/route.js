import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM TALONARIOS WHERE activo = 1');
    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener talonarios:', error);
    return new Response('Error al obtener talonarios', { status: 500 });
  }
}
