"use client";

import { useState, useEffect } from "react";

export default function AttachedMoTable(){

    const [data, setData] = useState([])
    
    useEffect(() => {
        async function fetchData() {
            try { 
                const response = await fetch(
                    "https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_maternal_polyclinic/"
                )
                const json = await response.json()

                setData(json.results)
            } catch (err) {
                console.error("Failed to fetch cause stats", err)
            }
        }

        fetchData()
    }, [])


    return (
        <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
                    Материнская смерть по прикрепленному МО
                </h3>
            </div>
            <div className="p-2 pt-0">
                <div className="overflow-y-auto max-h-60 lg:max-h-85"> 
                    <table className="min-w-full border border-gray-100 text-sm rounded-lg">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left border-b border-gray-100 font-semibold text-gov-text-primary">
                                    Название прикрепленного МО
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
                                    <td className="px-4 py-3 border-b border-gray-50">
                                        {item.maternal_count}
                                    </td>
                                    <td className="px-4 py-3 border-b border-gray-50">
                                        {item.child_count}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}