import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM VENTAS');
    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return new Response('Error al obtener ventas', { status: 500 });
  }
}

export async function POST(request) {
  try {
    const {
      clienteId,
      monedaId,
      documentoId,
      plazoId,
      talonarioId,
      depositoId,
      fecha,
      total
    } = await request.json();

    // Validación básica
    if (
      !clienteId ||
      !monedaId ||
      !documentoId ||
      !plazoId ||
      !talonarioId ||
      !depositoId ||
      !fecha ||
      total == null
    ) {
      return new Response(JSON.stringify({ error: "Faltan datos obligatorios" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const insertQuery = `
      INSERT INTO VENTAS (cliente_id, moneda_id, tipo_documento_id, plazo_id, talonario_id, deposito_id, fecha, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const { rows } = await pool.query(insertQuery, [
      clienteId,
      monedaId,
      documentoId,
      plazoId,
      talonarioId,
      depositoId,
      fecha,
      total
    ]);

    return new Response(JSON.stringify({
      message: "Venta registrada correctamente",
      ventaId: rows[0].id
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error al registrar la venta:', error);
    return new Response(JSON.stringify({ error: "Error al registrar la venta" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
