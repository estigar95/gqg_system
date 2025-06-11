// app/page.js
'use client';

import Link from 'next/link';

export default function HomePage() {
  return (

    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-gray-800">
      <h1 className="text-5xl font-bold mb-8">GQG System</h1>
      <p className="text-xl mb-12 text-center max-w-2xl">
        Módulo de VENTAS
      </p>
      <div className="flex flex-col gap-4">

        <Link
          href="/venta"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out"
        >
          Registrar Venta
        </Link>

        <Link
          href="/cuentas-cobrar"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out"
        >
          Cuentas por Cobrar
        </Link>

        <Link
          href="/clientes"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out"
        >
          Registrar Cliente
        </Link>
      </div>
    </main>
  );
}