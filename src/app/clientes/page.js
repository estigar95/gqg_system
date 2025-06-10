'use client';
import { useState } from 'react';

export default function CrearClientePage() {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    documentonro: '',
    direccion: '',
    email: '',
    telefono: '',
    activo: 1,
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await response.json();
        setMessage('Cliente creado con éxito');
        // Reiniciar el formulario
        setFormData({
          nombres: '',
          apellidos: '',
          documentonro: '',
          direccion: '',
          email: '',
          telefono: '',
          activo: 1,
        });
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error en la creación del cliente:', error);
      setMessage('Error en la creación del cliente');
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Crear Cliente</h1>
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow rounded-xl p-6 max-w-lg mx-auto"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombres
          </label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Ingrese nombres"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos
          </label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Ingrese apellidos"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Documento
          </label>
          <input
            type="text"
            name="documentonro"
            value={formData.documentonro}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Ingrese número de documento"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Ingrese dirección"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Ingrese email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Ingrese teléfono"
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Crear Cliente
        </button>
        {message && (
          <div className="mt-4 p-4 border border-green-400 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
      </form>
    </main>
  );
}