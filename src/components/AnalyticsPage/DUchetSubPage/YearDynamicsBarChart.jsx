"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  Line,
  ComposedChart,
} from "recharts";
import { useState, useEffect } from "react";

export default function YearDynamicsBarChart({ year, month }) {
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
          `https://admin.smartalmaty.kz/api/v1/healthcare/df-registry/stats_dynamics_2021_2025/${queryString}`
        );
        const json = await response.json();
        const results = json || [];
        setData(results);
      } catch (err) {
        console.error("Failed to fetch year dynamics:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [year, month]);

  const [showInfo, setShowInfo] = useState(false);
  
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '';
    return `${value.toFixed(1)}%`;
  };

  const formatCount = (value) => {
    if (value === null || value === undefined) return '';
    return value.toLocaleString('ru-RU');
  };

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide truncate">
          Динамика пациентов
        </h3>
        <button 
          className="px-2 text-sm text-gray-500 rounded-full border border-gray-300 hover:text-black hover:border-black hover:cursor-pointer"
          onClick={()=> setShowInfo(!showInfo)}
        >
          i
        </button>
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col">
        {showInfo && 
          <div className="absolute top-0 right-2 sm:right-3 text-xs text-left p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 z-50 w-[90%] sm:w-2/3 shadow-xl">
             Устойчивый рост до 2024 года. Рост выявляемости и обращаемости.
          </div>
        }

        <div className="flex-1 p-2 sm:p-3 min-h-0">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Загрузка...</div>
          ) : data.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Нет данных</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  label={{ value: "Кол-во", position: "insideLeft", angle: -90, fontSize: 10 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  label={{ value: "%", position: "insideRight", angle: 90, fontSize: 10 }}
                />

                <Tooltip
                  cursor={{fill: 'transparent'}}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #c1d3ff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => {
                    if (name === 'count') return [formatCount(value), 'Число'];
                    if (name === 'index_2021') return [value, 'Индекс'];
                    return [value, name];
                  }}
                />

                <Bar dataKey="count" yAxisId="left" radius={[6, 6, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill="url(#yearGradient)" />
                  ))}
                  <LabelList 
                    dataKey="count" 
                    position="insideTop" 
                    fontSize={9} 
                    fill="#ffffff"      
                    offset={5}          
                    formatter={formatCount} 
                  />
                </Bar>

                <Line
                  type="monotone"
                  dataKey="index_2021"
                  yAxisId="right"
                  stroke="#f81a1aff"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                >
                  <LabelList
                    dataKey="growth_percentage"
                    position="top"
                    formatter={formatPercentage}
                    fontSize={9}
                    fill="#f81a1aff"
                    offset={10}
                  />
                </Line>

                <defs>
                  <linearGradient id="yearGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3772ff" />
                    <stop offset="100%" stopColor="#2956bf" />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}