'use client';
import { useEffect, useState } from 'react';
import { format, isBefore } from 'date-fns';

export default function CuentasPorCobrar() {
  const [cuentas, setCuentas] = useState([]);

  useEffect(() => {
    fetch('/api/cuentas-cobrar')
      .then((res) => res.json())
      .then(setCuentas)
      .catch((err) => console.error('Error al cargar cuentas por cobrar:', err));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cuentas por Cobrar</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Tabla</th>
              <th className="px-4 py-3 text-left">Tabla ID</th>
              <th className="px-4 py-3 text-center">Cuota</th>
              <th className="px-4 py-3 text-right">Importe</th>
              <th className="px-4 py-3 text-center">Cobrado</th>
              <th className="px-4 py-3 text-center">Vence</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((cuenta) => {
              const vencida = isBefore(new Date(cuenta.vence), new Date());
              return (
                <tr key={cuenta.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{cuenta.id}</td>
                  <td className="px-4 py-2">{cuenta.tabla}</td>
                  <td className="px-4 py-2">{cuenta.tablaid}</td>
                  <td className="px-4 py-2 text-center">{cuenta.cuota}</td>
                  <td className="px-4 py-2 text-right">
                    {Number(cuenta.importe).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      cuenta.cobrado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {cuenta.cobrado ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      vencida ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {format(new Date(cuenta.vence), 'dd/MM/yyyy')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
