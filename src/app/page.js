// app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-8">GQG System</h1>
      <p className="text-xl mb-12 text-center max-w-2xl">
        Módulo de VENTAS
      </p>
      <div className="flex flex-col gap-4">
        <Link href="/venta" legacyBehavior>
          <a className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out">
            Registrar Venta
          </a>
        </Link>
        <Link href="/cuentas-cobrar" legacyBehavior>
          <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out">
            Cuentas por Cobrar
          </a>
        </Link>
      </div>
    </main>
  );
}