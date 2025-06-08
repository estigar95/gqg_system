'use client';
import { useEffect, useState } from 'react';

export default function RegistrarVenta() {
    const [clientes, setClientes] = useState([]);
    const [monedas, setMonedas] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [plazos, setPlazos] = useState([]);
    const [depositos, setDepositos] = useState([]);

    const [selectedCliente, setSelectedCliente] = useState('');
    const [selectedMoneda, setSelectedMoneda] = useState('');
    const [selectedDocumento, setSelectedDocumento] = useState('');
    const [selectedPlazo, setSelectedPlazo] = useState('');
    const [selectedDeposito, setSelectedDeposito] = useState('');

    const [totalFactura, setTotalFactura] = useState('');
    const [totalImpuesto, setTotalImpuesto] = useState(0);
    const [totalBase, setTotalBase] = useState(0);
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Para UX: saber si el plazo está deshabilitado
    const [plazoDisabled, setPlazoDisabled] = useState(false);

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
            fetchData('/api/deposito', setDepositos)
        ]).finally(() => setLoading(false));
    }, []);

    // Lógica para el select de plazo según tipo de documento
    useEffect(() => {
        if (!selectedDocumento) {
            setSelectedPlazo('');
            setPlazoDisabled(false);
            return;
        }
        // Busca el objeto del tipo de documento seleccionado
        const doc = documentos.find(d => d.id === Number(selectedDocumento));
        if (!doc) {
            setSelectedPlazo('');
            setPlazoDisabled(false);
            return;
        }
        if (doc.tipo.toLowerCase() === 'contado') {
            // Busca el plazo que sea "Contado"
            const plazoContado = plazos.find(p => p.plazo.toLowerCase().includes('contado'));
            setSelectedPlazo(plazoContado ? plazoContado.id : '');
            setPlazoDisabled(true);
        } else if (doc.tipo.toLowerCase() === 'credito') {
            setSelectedPlazo('');
            setPlazoDisabled(false);
        } else {
            setSelectedPlazo('');
            setPlazoDisabled(false);
        }
    }, [selectedDocumento, plazos, documentos]);

    // Calcula automáticamente los valores cuando cambia el totalFactura
    const handleTotalFacturaChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setTotalFactura(e.target.value);
        const impuesto = +(value * 0.09).toFixed(5);
        const base = +(value - impuesto).toFixed(5);
        setTotalImpuesto(impuesto);
        setTotalBase(base);
    };

    const registrarVenta = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/venta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clienteid: selectedCliente,
                    monedaid: selectedMoneda,
                    tipodocid: selectedDocumento,
                    plazoid: selectedPlazo,
                    depositoid: selectedDeposito,
                    talonarioid: 1, // <--- talonarioid fijo en 1
                    totalfactura: parseFloat(totalFactura),
                    totalimpuesto: totalImpuesto,
                    totalbase: totalBase,
                    totalexento: 0,
                }),
            });
            if (res.ok) {
                setMensaje('Venta registrada correctamente');
            } else {
                setMensaje('Error al registrar venta');
            }
        } catch (err) {
            setMensaje('Error de red');
        }
    };

    if (loading) return <p className="text-center text-gray-500">Cargando datos...</p>;
    if (error) return <p className="text-center text-red-600">Error: {error}</p>;

    // Filtrado de plazos según tipo de documento
    let plazosFiltrados = plazos;
    const docObj = documentos.find(d => d.id === Number(selectedDocumento));
    if (docObj && docObj.tipo.toLowerCase() === 'credito') {
        plazosFiltrados = plazos.filter(
            p => p.plazo.toLowerCase().includes('credito') && !p.plazo.toLowerCase().includes('contado')
        );
        // Si el plazo seleccionado no es de crédito, lo limpiamos
        if (
            selectedPlazo &&
            !plazosFiltrados.some(p => String(p.id) === String(selectedPlazo))
        ) {
            setSelectedPlazo('');
        }
    } else if (docObj && docObj.tipo.toLowerCase() === 'contado') {
        plazosFiltrados = plazos.filter(p => p.plazo.toLowerCase().includes('contado'));
        // Si el plazo seleccionado no es contado, lo limpiamos
        if (
            selectedPlazo &&
            !plazosFiltrados.some(p => String(p.id) === String(selectedPlazo))
        ) {
            setSelectedPlazo('');
        }
    }
    return (
        <main className="p-4 max-w-xl mx-auto bg-white rounded-lg shadow-md mt-8">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Registrar Venta</h1>
            <form className="grid gap-4" onSubmit={registrarVenta}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <select
                        value={selectedCliente}
                        onChange={e => setSelectedCliente(e.target.value)}
                        required
                        className="w-full border rounded px-2 py-1"
                    >
                        <option value="">Seleccione Cliente</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombres} {c.apellidos}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                    <select
                        value={selectedMoneda}
                        onChange={e => setSelectedMoneda(e.target.value)}
                        required
                        className="w-full border rounded px-2 py-1"
                    >
                        <option value="">Seleccione Moneda</option>
                        {monedas.map(m => (
                            <option key={m.id} value={m.id}>
                                {m.moneda}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Documento</label>
                    <select
                        value={selectedDocumento}
                        onChange={e => setSelectedDocumento(e.target.value)}
                        required
                        className="w-full border rounded px-2 py-1"
                    >
                        <option value="">Seleccione Tipo Documento</option>
                        {documentos.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.tipo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plazo</label>
                    <select
                        value={selectedPlazo}
                        onChange={e => setSelectedPlazo(e.target.value)}
                        required
                        className={`w-full border rounded px-2 py-1 ${plazoDisabled ? 'bg-gray-100 text-gray-500' : ''}`}
                        disabled={plazoDisabled}
                    >
                        <option value="">Seleccione Plazo</option>
                        {plazosFiltrados.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.plazo}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Depósito</label>
                    <select
                        value={selectedDeposito}
                        onChange={e => setSelectedDeposito(e.target.value)}
                        required
                        className="w-full border rounded px-2 py-1"
                    >
                        <option value="">Seleccione Depósito</option>
                        {depositos.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.deposito}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Factura</label>
                    <input
                        type="number"
                        value={totalFactura}
                        onChange={handleTotalFacturaChange}
                        placeholder="Total Factura"
                        required
                        className="w-full border rounded px-2 py-1"
                        min={0}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Impuesto (10%)</label>
                    <input
                        type="number"
                        value={totalImpuesto}
                        readOnly
                        placeholder="Total Impuesto (9%)"
                        className="w-full border rounded px-2 py-1 bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Base</label>
                    <input
                        type="number"
                        value={totalBase}
                        readOnly
                        placeholder="Total Base"
                        className="w-full border rounded px-2 py-1 bg-gray-100"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Registrar Venta
                </button>
                {mensaje && (
                    <div className={`mt-2 text-center ${mensaje.includes('correctamente') ? 'text-green-600' : 'text-red-600'}`}>
                        {mensaje}
                    </div>
                )}
            </form>
        </main>
    );
}