// app/layout.js
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Sistema de Gestión',
  description: 'Aplicación para gestión de cuentas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        
        <div className="fixed bottom-6 right-6 z-50">

          <Link
            href="/"
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out flex items-center justify-center text-xl"
            title="Volver al inicio"
          >
            🏠
          </Link>
        </div>
      </body>
    </html>
  );
}