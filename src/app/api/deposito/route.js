import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM DEPOSITOS');
    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener depósitos:', error);
    return new Response('Error al obtener depósitos', { status: 500 });
  }
}
