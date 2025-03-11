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
    const [selectedType, setSelectedType] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isIdDropdownOpen, setIsIdDropdownOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchClientData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/get-clients');
            if (!res.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            const data = await res.json();
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
            setIds(data);
        } catch (error) {
            console.error('Error al obtener los IDs:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // Filtrar IDs basados en el término de búsqueda
    const filteredIds = ids.filter(item => 
        item && item.id && typeof item.id === 'string' && 
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar la selección de un ID desde la lista desplegable
    const handleIdSelect = (id: string) => {
        setSelectedId(id);
        setSearchTerm(id);
        setIsIdDropdownOpen(false);
    };

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
        const { name, value } = e.target;

        // Actualizar el estado correspondiente según el nombre del select
        if (name === "client") {
            setSelectedClient(value);
        } else if (name === "id") {
            setSelectedId(value);
        } else if (name === "change") {
            setSelectedChange(value);
        } else if (name === "type") {
            setSelectedType(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validar que todos los campos requeridos estén completos
        if (!selectedClient || !selectedId || !selectedChange || !selectedType) {
            alert("Por favor complete todos los campos requeridos");
            return;
        }

        setIsSubmitting(true);
        try {
            let numeroMultiplicar = "";
            let ajusteConsumo = "";

            if (selectedChange === 'Objetivo') {
                numeroMultiplicar = (document.getElementById('numeroMultiplicar') as HTMLInputElement)?.value || "";
            } else if (selectedChange === 'Consumo') {
                ajusteConsumo = (document.getElementById('ajusteConsumo') as HTMLInputElement)?.value || "";
            } else if (selectedChange === 'Ambas') {
                numeroMultiplicar = (document.getElementById('numeroMultiplicar') as HTMLInputElement)?.value || "";
                ajusteConsumo = (document.getElementById('ajusteConsumo') as HTMLInputElement)?.value || "";
            }

            const observaciones = (document.getElementById('observaciones') as HTMLTextAreaElement)?.value || "";

            const dataToSend = {
                identificadorCampana: selectedId,
                cliente: selectedClient,
                ajuste: selectedChange,
                numeroMultiplicar,
                ajusteConsumo,
                observaciones,
                tipoAjuste: selectedType
            };

            // Enviar los datos como JSON
            const response = await fetch('/api/post-to-sheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();

            // Opcional: resetear el formulario
            setSelectedClient("");
            setSelectedId("");
            setSelectedChange("");
            setSelectedType("");

            // Limpiar los campos de texto si existen
            if (document.getElementById('numeroMultiplicar')) {
                (document.getElementById('numeroMultiplicar') as HTMLInputElement).value = "";
            }
            if (document.getElementById('ajusteConsumo')) {
                (document.getElementById('ajusteConsumo') as HTMLInputElement).value = "";
            }
            if (document.getElementById('observaciones')) {
                (document.getElementById('observaciones') as HTMLTextAreaElement).value = "";
            }

        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            alert("Ocurrió un error al enviar los datos");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="abolute m-6">
            <div
                ref={dropdownRef}
                className="flex-col items-center gap-10 m-2 p-2 bg-blanco shadow-custom rounded-md border border-gray-200"
            >
                <div className="flex justify-around p-2" >
                    {/* CLIENTES OPTIONS */}
                    <select
                        className="text-left px-2 py-1 w-1/3 h-12 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom"
                        name="client"
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
                    <div
                        className="flex items-center text-left px-2 py-1 h-12 w-1/3 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom"
                        onClick={() => {
                            setIsIdDropdownOpen(!isIdDropdownOpen);
                            setTimeout(() => {
                                searchInputRef.current?.focus();
                            }, 100);
                        }}
                    >
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="w-full bg-transparent outline-none"
                            placeholder={isLoading ? 'Cargando...' : 'Buscar identificador...'}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsIdDropdownOpen(true);
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsIdDropdownOpen(true);
                            }}
                            disabled={isLoading}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-violetaPrincipal"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isIdDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                            />
                        </svg>
                    </div>

                    {/* Lista desplegable de opciones filtradas */}
                    {isIdDropdownOpen && (
                        <div className="absolute z-10 mt-14 right-44 bg-blanco w-1/12 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredIds.length > 0 ? (
                                filteredIds.map((item) => (
                                    <div
                                        key={item.id}
                                        className="text-left px-2 py-1 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom"
                                        onClick={() => handleIdSelect(item.id)}
                                    >
                                        {item.id}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500">
                                    No se encontraron resultados
                                </div>
                            )}
                        </div>
                    )}
                    {/* Campo oculto para mantener la compatibilidad con la validación del formulario */}
                    <input
                        type="hidden"
                        name="id"
                        value={selectedId}
                        required
                    />
                </div>
                <div className="relative flex justify-around p-2">
                    {/* AJUSTE OPTIONS */}
                    <select
                        className="text-left px-2 py-1 h-12 w-1/3 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom"
                        name="change"
                        value={selectedChange}
                        onChange={handleSelectChange}
                        required
                    >
                        <option value="">¿Que ajuste desea registrar?</option>
                        <option className="font-bold" value="Objetivo">Objetivo</option>
                        <option className="font-bold" value="Consumo">Consumo</option>
                        <option className="font-bold" value="Ambas">Ambas</option>
                    </select>
                    {/* TIPO SEGUN ELECCION OPTIONS */}
                    <div className="w-1/3">
                        {selectedChange && (
                            <>
                                {selectedChange === 'Objetivo' && (
                                    <input
                                        type="number"
                                        name='numeroMultiplicar'
                                        id='numeroMultiplicar'
                                        className='text-left px-2 py-1 h-12 w-full rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom'
                                        placeholder='Número a multiplicar'
                                        required
                                    />
                                )}
                                {selectedChange === 'Consumo' && (
                                    <input
                                        type="number"
                                        name='ajusteConsumo'
                                        id='ajusteConsumo'
                                        className='text-left px-2 py-1 h-12 w-full rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom'
                                        placeholder='Factor multiplicador a usar'
                                        required
                                    />
                                )}
                                {selectedChange === 'Ambas' && (
                                    <div className="flex gap-4">
                                        <input
                                            type="number"
                                            name='numeroMultiplicar'
                                            id='numeroMultiplicar'
                                            className='text-left px-2 py-1 h-12 w-[45%] rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom'
                                            placeholder='Ajuste de objetivo'
                                            required
                                        />
                                        <input
                                            type="number"
                                            name='ajusteConsumo'
                                            id='ajusteConsumo'
                                            className='text-left px-2 py-1 h-12 w-[45%] rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom'
                                            placeholder='Ajuste de consumo'
                                            required
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="flex justify-around p-2">
                    {/* DIARIO OPTIONS */}
                    <select
                        className="text-left px-2 py-1 h-12 w-1/3 rounded-md text-violetaPrincipal border border-gray-200 font-semibold cursor-pointer shadow-custom"
                        name="type"
                        value={selectedType}
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
                {/* Botón de envío */}
                <div className="flex justify-center mt-6 mb-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-violetaPrincipal hover:bg-violetaSecundario text-white font-bold py-3 px-8 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violetaPrincipal focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando...
                            </span>
                        ) : (
                            "Registrar ajuste"
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default FormRegister;