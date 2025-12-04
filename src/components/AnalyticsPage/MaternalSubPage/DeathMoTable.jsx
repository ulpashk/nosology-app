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


    return (
        <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex-shrink-0">
                <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
                    Материнская смерть по МО
                </h3>
            </div>
            
            <div className="flex-1 min-h-0 relative">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Загрузка...
                    </div>
                ) : data.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-medium">Нет данных</p>
                        <p className="text-xs text-gray-400">за выбранный период</p>
                    </div>
                ) : (
                    // CHANGED HERE: Removed max-h-*, added h-full
                    <div className="h-full overflow-y-auto"> 
                        <table className="min-w-full border border-gray-100 text-sm rounded-lg">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-left border-b border-gray-100 font-semibold text-gov-text-primary">
                                        Название МО
                                    </th>
                                    <th className="px-4 py-3 text-left border-b border-gray-100 font-semibold text-gov-text-primary">
                                        Материнская смертность
                                    </th>
                                    <th className="px-4 py-3 text-left border-b border-gray-100 font-semibold text-gov-text-primary">
                                        Детская смертность
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 border-b border-gray-50 text-left text-gov-text-primary">
                                            {item.name}
                                        </td>
                                        <td className={`px-4 py-3 border-b border-gray-50`}>
                                            {item.maternal_count}
                                        </td>
                                        <td className={`px-4 py-3 border-b border-gray-50`}>
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