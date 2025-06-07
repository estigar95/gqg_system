'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { format, isBefore } from 'date-fns';

export default function CuentasPorCobrar() {
  const [documento, setDocumento] = useState('');
  const [ventas, setVentas] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState(null);

  // Buscar ventas por documento
  const buscarVentas = async () => {
    setLoading(true);
    setCliente(null);
    setVentas([]);
    setCuentas([]);
    try {
      const doc = documento.trim(); // Elimina espacios al inicio y final
      const res = await fetch(`/api/venta?documento=${encodeURIComponent(doc)}`);
      const data = await res.json();
      console.log('Respuesta de /api/venta:', data);
      setCliente(data.cliente);
      setVentas(data.ventas || []);
    } catch (err) {
      alert('Error al buscar ventas');
    }
    setLoading(false);
  };

  // Consultar cuentas por cobrar para una venta específica
  const toggleExpand = async (venta_id) => {
    if (!venta_id) return; // No hagas nada si es undefined
    setExpanded((prev) => ({
      ...prev,
      [venta_id]: !prev[venta_id],
    }));
    if (!expanded[venta_id]) {
      try {
        const res = await fetch(`/api/cuentas-cobrar?venta_id=${venta_id}`);
        const data = await res.json();
        setCuentas((prev) => ({
          ...prev,
          [venta_id]: data || [],
        }));
      } catch (err) {
        alert('Error al consultar cuentas por cobrar');
      }
    }
  };

  console.log('IDs de ventas:', ventas.map(v => v.venta_id));

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cuentas por Cobrar</h1>
      <div className="mb-6 flex gap-2 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nro. Documento</label>
          <input
            type="text"
            value={documento}
            onChange={e => setDocumento(e.target.value)}
            className="border rounded px-3 py-2 w-48"
            placeholder="Ingrese documento"
          />
        </div>
        <button
          onClick={buscarVentas}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading || !documento}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {cliente && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <div><strong>Cliente:</strong> {cliente.nombres} {cliente.apellidos}</div>
          <div><strong>Documento:</strong> {cliente.documentonro}</div>
        </div>
      )}
      {ventas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th></th>
                <th className="px-4 py-3 text-left">ID Venta</th>
                <th className="px-4 py-3 text-left">Nro. Documento</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Factura</th>
                <th className="px-4 py-3 text-left">Plazo</th>
                <th className="px-4 py-3 text-left">Moneda</th>
                <th className="px-4 py-3 text-right">Exento</th>
                <th className="px-4 py-3 text-right">Base</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <React.Fragment key={venta.venta_id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => venta.venta_id && toggleExpand(venta.venta_id)}
                        className="text-xl font-bold text-blue-600 hover:text-blue-800"
                        aria-label="Expandir"
                      >
                        {expanded[venta.venta_id] ? '−' : '+'}
                      </button>
                    </td>
                    <td className="px-4 py-2">{venta.venta_id}</td>
                    <td className="px-4 py-2">{venta.nro_documento}</td>
                    <td className="px-4 py-2">{venta.cliente}</td>
                    <td className="px-4 py-2">{venta.fecha ? format(new Date(venta.fecha), 'dd/MM/yyyy') : 'Sin fecha'}</td>
                    <td className="px-4 py-2">{venta.factura}</td>
                    <td className="px-4 py-2">{venta.cuotas_desc}</td>
                    <td className="px-4 py-2">{venta.moneda}</td>
                    <td className="px-4 py-2 text-right">{Number(venta.total_exento).toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{Number(venta.total_base).toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{Number(venta.total_factura).toLocaleString()}</td>
                  </tr>
                  {expanded[venta.venta_id] && (
                    <tr key={`expanded-${venta.venta_id}`}>
                      <td colSpan={8} className="bg-gray-50">
                        <CuentasDetalle cuentas={cuentas[venta.venta_id] || []} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

// Componente para mostrar detalle de cuentas por cobrar
function CuentasDetalle({ cuentas }) {
  if (!cuentas.length) return <div className="text-gray-500 p-2">Sin cuentas por cobrar.</div>;
  return (
    <table className="min-w-full text-sm mt-2">
      <thead>
        <tr>
          <th className="px-2 py-1 text-center">Cuota</th>
          <th className="px-2 py-1 text-right">Importe</th>
          <th className="px-2 py-1 text-center">Cobrado</th>
          <th className="px-2 py-1 text-center">Vence</th>
        </tr>
      </thead>
      <tbody>
        {cuentas.map((cuenta, idx) => {
          // Cambia los nombres de los campos si tu backend los cambió
          const vencida = isBefore(new Date(cuenta.vence), new Date());
          return (
            <tr key={cuenta.id ? cuenta.id : `${cuenta.cuota}-${cuenta.vence}-${idx}`} className="border-b">
              <td className="px-2 py-1 text-center">{cuenta.cuota}</td>
              <td className="px-2 py-1 text-right">{Number(cuenta.importe).toFixed(2)}</td>
              <td className="px-2 py-1 text-center">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${cuenta.cobrado === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {cuenta.cobrado === 1 ? 'Sí' : 'No'}
                </span>
              </td>
              <td className="px-2 py-1 text-center">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${vencida ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                  {cuenta.vence ? format(new Date(cuenta.vence), 'dd/MM/yyyy') : 'Sin fecha'}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}