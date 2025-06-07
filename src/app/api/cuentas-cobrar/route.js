import pool from '@/lib/db';

// Api para obtener las cuentas por cobrar de una venta específica
// para probar en el navegador http://localhost:3000/api/cuentas-cobrar?venta_id=123
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ventaId = searchParams.get('venta_id');

  if (!ventaId) {
    return new Response('Falta el parámetro venta_id', { status: 400 });
  }

  try {
    const query = `
      SELECT
        CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
        CONCAT(v.serie, '-', RIGHT(CONCAT('0000000', v.nrofactura), 7)) AS factura,
        v.fechafactura AS fecha,
        m.moneda AS moneda,
        p.plazo AS cuotas_desc,
        CONCAT(COALESCE(cc.cuota, 1), '/', p.cuotas) AS cuota,
        cc.importe AS importe,
        cc.vence AS vence,
        cc.cobrado AS cobrado
      FROM VENTAS v
      INNER JOIN CUENTAS_COBRAR cc
        ON v.id = cc.tablaid AND cc.tabla = 'VENTAS'
      INNER JOIN PLAZOS p ON v.plazoid = p.id
      LEFT OUTER JOIN PLAZO_DETALLES pd ON p.id = pd.plazoid AND cc.cuota = pd.cuota
      INNER JOIN CLIENTES c ON v.clienteid = c.id
      INNER JOIN TALONARIOS t ON v.talonarioid = t.id
      INNER JOIN MONEDAS m ON m.id = v.monedaid
      WHERE v.id = $1
    `;
    
    const { rows } = await pool.query(query, [ventaId]);
    return Response.json(rows);
  } catch (error) {
    console.error('Error al obtener cuenta por cobrar:', error);
    return new Response('Error al obtener cuenta por cobrar', { status: 500 });
  }
}
