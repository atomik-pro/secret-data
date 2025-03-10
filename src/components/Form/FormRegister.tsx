"use client"
import { useEffect, useRef, useState } from "react";

interface IdData {
    id: string;
    naming: string;
}

interface ClientData {
    Clientes: string;
}

function FormRegister() {

    const [isOpen, setIsOpen] = useState(false);
    const [ids, setIds] = useState<IdData[]>([]);
    const [clientes, setClientes] = useState<ClientData[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>("");
    const [selectedId, setSelectedId] = useState<string>("");
    const [selectedChange, setSelectedChange] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchClientData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/get-clients');
            if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            const data = await res.json();
            console.log('Datos recibidos:', data);
            setClientes(data);
        } catch (error) {
            console.error('Error al obtener los IDs:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchIdData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/get-id');
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            const data = await response.json();
            console.log('Datos recibidos:', data);
            setIds(data);
        } catch (error) {
            console.error('Error al obtener los IDs:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // Cargar datos cuando se abre el dropdown
    useEffect(() => {
        fetchIdData();
        fetchClientData();
    }, []);

    // Manejar clics fuera del dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedId(e.target.value);
        setSelectedClient(e.target.value);
        setSelectedChange(e.target.value);
    };

    return (
        <main className="abolute m-6">
            <div
                ref={dropdownRef}
                className="flex-col items-center gap-10 m-2 p-2 bg-blanco shadow-custom rounded-md border border-gray-200"
            >
                <div className="flex justify-around p-2" >
                    {/* CLIENTES OPTIONS */}
                    <select
                        className="text-left px-2 py-1 w-1/3 h-12 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom"
                        disabled={isLoading}
                        value={selectedClient}
                        onChange={handleSelectChange}
                    >
                        <option value="">
                            {isLoading ? 'Cargando...' : 'Seleccione el cliente'}
                        </option>
                        {clientes.map((cliente) => (
                            <option
                                key={cliente.Clientes}
                                value={cliente.Clientes}
                                className="font-bold"
                            >
                                {cliente.Clientes}
                            </option>
                        ))}
                    </select>
                    {/* IDS OPTIONS */}
                    <select
                        className="text-left px-2 py-1 h-12 w-1/3 rounded-md text-violetaPrincipal shadow-custom border border-gray-200 font-semibold cursor-pointer"
                        disabled={isLoading}
                        value={selectedId}
                        onChange={handleSelectChange}
                    >
                        <option value="">
                            {isLoading ? 'Cargando...' : 'Seleccione el identificador'}
                        </option>
                        {ids.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                                className="font-bold"
                            >
                                {item.id}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="relative flex justify-around p-2">
                    {/* AJUSTE OPTIONS */}
                    <select
                        className="text-left px-2 py-1 h-12 w-1/3 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom"
                        value={selectedId}
                        onChange={handleSelectChange}
                    >
                        <option value="nulo">¿Que ajuste desea registrar?</option>
                        <option className="font-bold" value="Objetivo">Objetivo</option>
                        <option className="font-bold" value="Consumo">Consumo</option>
                        <option className="font-bold" value="Ambas">Ambas</option>
                    </select>
                    {selectedChange && (
                        <>
                            {selectedChange === 'Objetivo' && (
                                <input
                                    type="number"
                                    name='numeroMultiplicar'
                                    id='numeroMultiplicar'
                                    className='text-left px-2 py-1 h-12 w-1/3 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom'
                                    placeholder='Número a multiplicar'
                                    required
                                />
                            )}
                            {selectedChange === 'Consumo' && (
                                <input
                                    type="number"
                                    name='ajusteConsumo'
                                    id='ajusteConsumo'
                                    className='text-left px-2 py-1 h-12 w-1/3 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom'
                                    placeholder='Factor multiplicador a usar'
                                    required
                                />
                            )}
                        </>
                    )}
                    {/* TIPO SEGUN ELECCION OPTIONS */}
                </div>
                <div className="flex justify-around p-2">
                    {/* DIARIO OPTIONS */}
                    <select
                        className="text-left px-2 py-1 h-12 w-1/3 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom"
                        value={selectedId}
                        onChange={handleSelectChange}
                    >
                        <option value="">¿El ajuste es diario o total campaña?</option>
                        <option className="font-bold" value="Diario">Diario</option>
                        <option className="font-bold" value="Total">Total Campaña</option>
                    </select>
                    {/* AJUSTE OPTIONS */}
                    <textarea
                        className="text-left px-2 py-1 h-12 w-1/3 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom"
                        name="observaciones"
                        id="observaciones"
                        placeholder="Descripción del ajuste, fechas, detalles de interés, etc."
                    >
                    </textarea>
                </div>
            </div>
        </main>
    )
}

export default FormRegister;