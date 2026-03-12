"use client";

import { useState, useEffect } from "react";
 
export default function DeathMoTable({ year, month }){

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
        setIsLoading(true);

        const params = new URLSearchParams();
        if (year) params.append("year", year);
        if (month) params.append("month", month);
        const queryString = params.toString() ? `?${params.toString()}` : "";

        try {
            const response = await fetch(
                `https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_maternal_hospital/${queryString}`
            );
            const json = await response.json();
            const results = json.results || [];
            setData(results);
        } catch (err) {
            console.error("Failed to fetch cause stats:", err);
            setData([]);
        } finally {
            setIsLoading(false);
        }
        }
        fetchData();
    }, [year, month]);

    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col overflow-hidden relative">
            <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
                <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide truncate">
                    Материнская смерть по МО
                </h3>
                <button 
                    className="px-2 text-sm text-gray-500 rounded-full border border-gray-300 hover:text-black hover:border-black hover:cursor-pointer"
                    onClick={()=> setShowInfo(!showInfo)}
                >
                    i
                </button>
            </div>
            
            {/* 
               CRITICAL FIX FOR SCROLLING:
               1. relative: Establishes context.
               2. flex-1 min-h-0: Allows this div to fill remaining space but shrink if needed.
            */}
            <div className="flex-1 min-h-0 relative w-full group">
                {showInfo && 
                    <div className="absolute top-0 right-2 sm:right-3 text-xs text-left p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 z-50 w-[90%] sm:w-2/3 shadow-xl">
                        Таблица показывает количество материнских и детских смертей, распределенных по медицинским организациям на основе МКБ-кодов.
                    </div>
                }
                
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Загрузка...
                    </div>
                ) : data.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                         <p className="text-sm font-medium">Нет данных</p>
                    </div>
                ) : (
                    /* 
                       absolute inset-0: Forces the scroll container to be exactly the size of the parent.
                       This prevents the table from expanding the parent grid cell.
                    */
                    <div className="absolute inset-0 overflow-auto custom-scrollbar"> 
                        <table className="min-w-full border border-gray-100 text-xs sm:text-sm rounded-lg">
                            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-left border-b border-gray-100 font-semibold text-gov-text-primary">
                                        Название МО
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-center border-b border-gray-100 font-semibold text-gov-text-primary whitespace-nowrap">
                                        Материнская
                                    </th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3 text-center border-b border-gray-100 font-semibold text-gov-text-primary whitespace-nowrap">
                                        Детская
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-50 text-left text-gov-text-primary">
                                            {item.name}
                                        </td>
                                        <td className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-50 text-center font-medium">
                                            {item.maternal_count}
                                        </td>
                                        <td className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-50 text-center font-medium">
                                            {item.child_count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}