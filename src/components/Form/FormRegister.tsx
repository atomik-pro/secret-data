"use client"

import { useEffect, useRef, useState } from "react";

function FormRegister() {

    const [isOpen, setIsOpen] = useState(false);
    const [ids, setIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/get-id');
            const data = await response.json();
            setIds(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error al obtener los IDs:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // Cargar datos cuando se abre el dropdown
    useEffect(() => {
        if (ids.length === 0) {
            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);


    return (
        <main className="">
            <h2>
                fORMULARIO DE REGISTRO
            </h2>
                <div
                    ref={dropdownRef}
                    className="absolute left-16 ml-2 w-48 bg-blanco shadow-custom rounded-md border border-gray-200 p-2 z-50"
                >
                    <div className="relative">
                        {/* IDS OPTIONS */}
                        <select
                            className="w-full text-left px-2 py-1 rounded text-violetaPrincipal font-semibold cursor-pointer"
                            disabled={isLoading}
                        >
                            <option value="">
                                {isLoading ? 'Cargando...' : 'Identificadores'}
                            </option>
                            {ids.map((id) => (
                                <option
                                    key={id}
                                    value={id}
                                    className="font-bold"
                                >
                                    {id}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
        </main>
    )
}

export default FormRegister;