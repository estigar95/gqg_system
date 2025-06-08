import pool from '@/lib/db';

// Api para obtener las ventas a crédito por número de documento
// para probar en el navegador http://localhost:3000/api/venta?documento=123456789
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const documento = searchParams.get('documento');

  if (!documento) {
    return new Response('Número de documento no proporcionado', { status: 400 });
  }

  try {
    // Obtener cliente
    const clienteQuery = `SELECT * FROM clientes WHERE documentonro = $1`;
    const clienteResult = await pool.query(clienteQuery, [documento]);
    const cliente = clienteResult.rows[0] || null;

    // Obtener ventas
    const ventasQuery = `
      select v.id as venta_ID, c.documentonro as nro_documento, CONCAT(c.nombres, ' ', c.apellidos) as cliente, 
v.fechafactura as fecha, CONCAT(v.serie, '-', right(CONCAT('0000000', v.nrofactura), 7) ) as factura, p.plazo as cuotas_desc,
m.moneda as moneda , v.totalexento as total_exento, v.totalbase as total_base, v.totalfactura as total_factura
from clientes c
inner join ventas v 
on c.id = v.clienteid
inner join PLAZOS p on
	v.plazoid = p.id
	inner join monedas m  
on m.id  = v.monedaid
where c.documentonro = $1 and v.tipodocid  = 2
order by v.id asc
    `;
    const ventasResult = await pool.query(ventasQuery, [documento]);
    const ventas = ventasResult.rows;

    return Response.json({ cliente, ventas });
  } catch (error) {
    console.error('Error al obtener ventas a crédito:', error);
    return new Response('Error al obtener ventas a crédito', { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      totalfactura,
      totalimpuesto,
      totalbase,
      clienteid,
      monedaid,
      tipodocid,
      plazoid,
      talonarioid,
      depositoid,
      totalexento = 0,
      serie = '001-001',
      fechaproceso = new Date(),
      fechafactura = new Date()
    } = body;

    // Obtén el nuevo id
    const idResult = await pool.query('SELECT COALESCE(MAX(id), 0) + 1 AS new_id FROM ventas');
    const newId = idResult.rows[0].new_id;

    // Obtén el nuevo nrofactura (puedes filtrar por serie si lo necesitas)
    const nroResult = await pool.query('SELECT COALESCE(MAX(nrofactura), 0) + 1 AS new_nro FROM ventas');
    const nrofactura = nroResult.rows[0].new_nro;

    await pool.query(
      `INSERT INTO ventas (
        id, fechaproceso, fechafactura, clienteid, serie, nrofactura, totalexento, totalimpuesto, totalbase, totalfactura,
        depositoid, monedaid, tipodocid, plazoid, talonarioid
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )`,
      [
        newId, fechaproceso, fechafactura, clienteid, serie, nrofactura, totalexento,
        totalimpuesto, totalbase, totalfactura, depositoid, monedaid, tipodocid, plazoid, talonarioid
      ]
    );

    return new Response('Venta registrada', { status: 200 });
  } catch (error) {
    console.error('Error al registrar venta:', error);
    return new Response('Error al registrar venta', { status: 500 });
  }
}