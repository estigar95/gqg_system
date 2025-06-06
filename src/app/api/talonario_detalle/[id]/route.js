import pool from '@/lib/db';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // obtener el último segmento
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return new Response('ID inválido', { status: 400 });
    }

    const { rows } = await pool.query(
      'SELECT * FROM TALONARIO_DETALLE WHERE talonarioid = $1',
      [idNum]
    );

    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener detalles de talonario:', error);
    return new Response('Error al obtener detalles de talonario', { status: 500 });
  }
}
