"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  // CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
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

  const handleClick = () => {
    setShowInfo(!showInfo);
  }
  
  // Helper function to format any index/percentage value as X.X%
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '';
    // Use Math.abs and a custom sign logic for growth_percentage if needed, 
    // but the provided data has the sign, so simple toFixed(1) is fine.
    return `${value.toFixed(1)}%`;
  };

  // Custom component to format the count value (adds a thousands separator)
  const formatCount = (value) => {
    if (value === null || value === undefined) return '';
    return value.toLocaleString('ru-RU');
  };

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Динамика числа пациентов по годам
        </h3>
        <button 
          className="px-2 text-sm text-gray-500 rounded-full border border-gray-300 hover:text-black hover:border-black hover:cursor-pointer"
          onClick={()=> handleClick()}
        >
          i
        </button>
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col">
        {showInfo && 
          <div className="absolute top-0 right-3 text-xs text-left p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 z-50 w-2/3">
            Диаграмма показывает устойчивый рост числа пациентов с 2021 по 2024 год,
            когда достигается максимальное значение. Индекс динамики также отражает восходящий тренд, 
            что может быть связано с улучшением выявляемости заболеваний, 
            расширением диспансерного наблюдения и ростом обращаемости населения. 
          </div>
        }

        <div className="flex-1 p-3 min-h-0">
          {isLoading ? (
            // Optional: Simple Loading State
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Загрузка...
            </div>
          ) : data.length === 0 ? (
            // NO DATA STATE
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <svg
                className="w-10 h-10 mb-2 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm font-medium">Нет данных</p>
              <p className="text-xs text-gray-400">за выбранный период</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                {/* <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /> */}

                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10 }}
                />

                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  label={{ value: "Кол-во", position: "insideLeft", angle: -90 }}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  label={{
                    value: "Индекс %",
                    position: "insideRight",
                    angle: 90,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #c1d3ff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value, name, props) => {
                    if (name === 'count') return [formatCount(value), 'Число пациентов'];
                    if (name === 'index_2021') return [value, 'Индекс к 2021г.'];
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
                    fontSize={10} 
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
                  strokeWidth={3}
                  dot={{ r: 4 }}
                >
                  <LabelList
                    dataKey="growth_percentage"
                    position="top"
                    formatter={formatPercentage}
                    fontSize={10}
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