import pool from '@/lib/db';

export async function GET(request) {
  try {
    // Extraer id desde la URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return new Response('ID inválido', { status: 400 });
    }

    const { rows } = await pool.query(
      'SELECT * FROM PLAZO_DETALLES WHERE plazoid = $1',
      [idNum]
    );

    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener detalles de plazo:', error);
    return new Response('Error al obtener detalles de plazo', { status: 500 });
  }
}
