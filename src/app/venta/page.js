'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [clientes, setClientes] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [plazos, setPlazos] = useState([]);
  const [talonarios, setTalonarios] = useState([]);
  const [depositos, setDepositos] = useState([]);

  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedMoneda, setSelectedMoneda] = useState('');
  const [selectedDocumento, setSelectedDocumento] = useState('');
  const [selectedPlazo, setSelectedPlazo] = useState('');
  const [selectedTalonario, setSelectedTalonario] = useState('');
  const [selectedDeposito, setSelectedDeposito] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint, setState) => {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Error al cargar ${endpoint}`);
      const data = await res.json();
      setState(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchData('/api/cliente', setClientes),
      fetchData('/api/moneda', setMonedas),
      fetchData('/api/tipo-documento', setDocumentos),
      fetchData('/api/plazo', setPlazos),
      fetchData('/api/talonario', setTalonarios),
      fetchData('/api/deposito', setDepositos)
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Registrar Venta</h1>
      <form className="grid gap-4">
        <select
          value={selectedCliente}
          onChange={e => setSelectedCliente(e.target.value)}
          required
        >
          <option value="">Seleccione Cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombres} {c.apellidos}
            </option>
          ))}
        </select>

        <select
          value={selectedMoneda}
          onChange={e => setSelectedMoneda(e.target.value)}
          required
        >
          <option value="">Seleccione Moneda</option>
          {monedas.map(m => (
            <option key={m.id} value={m.id}>
              {m.moneda}
            </option>
          ))}
        </select>

        <select
          value={selectedDocumento}
          onChange={e => setSelectedDocumento(e.target.value)}
          required
        >
          <option value="">Seleccione Tipo Documento</option>
          {documentos.map(d => (
            <option key={d.id} value={d.id}>
              {d.tipo}
            </option>
          ))}
        </select>

        <select
          value={selectedPlazo}
          onChange={e => setSelectedPlazo(e.target.value)}
          required
        >
          <option value="">Seleccione Plazo</option>
          {plazos.map(p => (
            <option key={p.id} value={p.id}>
              {p.plazo}
            </option>
          ))}
        </select>

        <select
          value={selectedTalonario}
          onChange={e => setSelectedTalonario(e.target.value)}
          required
        >
          <option value="">Seleccione Talonario</option>
          {talonarios.map(t => (
            <option key={t.id} value={t.id}>
              {t.serieb}
            </option>
          ))}
        </select>

        <select
          value={selectedDeposito}
          onChange={e => setSelectedDeposito(e.target.value)}
          required
        >
          <option value="">Seleccione Deposito</option>
          {depositos.map(d => (
            <option key={d.id} value={d.id}>
              {d.deposito}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded"
          // onClick handler para enviar el formulario
        >
          Registrar Venta
        </button>
      </form>
    </main>
  );
}
