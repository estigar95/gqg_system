import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('select * from cuentas_cobrar where cobrado = 0');
    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener cuentas por cobrar:', error);
    return new Response('Error al obtener cuentas por cobrar', { status: 500 });
  }
}
