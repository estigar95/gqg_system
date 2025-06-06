import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM TIPOS_DOCUMENTO WHERE activo = 1');
    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de documento:', error);
    return new Response('Error al obtener tipos de documento', { status: 500 });
  }
}
