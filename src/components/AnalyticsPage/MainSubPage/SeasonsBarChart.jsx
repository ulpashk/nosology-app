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
} from "recharts";
import { useState, useEffect } from "react";

export default function SeasonsBarChart({ year, month }) {
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
          `https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_season_severity/${queryString}`
        );
        const json = await response.json();

        setData(json.seasons || []);
      } catch (err) {
        console.error("Failed to fetch seasons stats:", err);
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

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const {
      label,
      average_value,
      mkb_groups = [],
      top_3_age = [],
    } = payload[0].payload;

    return (
      <div className="text-left bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-700 shadow-md max-w-xs">
        <p className="font-semibold mb-1">{label}</p>
        <p className="mb-2">Среднее значение: {average_value}</p>

        {mkb_groups.length > 0 && (
          <div className="mb-2">
            <p className="font-medium">МКБ-группы:</p>
            {mkb_groups.map((item, idx) => (
              <p key={idx}>
                • «{item.name}» — {item.count}
              </p>
            ))}
          </div>
        )}

        {top_3_age.length > 0 && (
          <div>
            <p className="font-medium">Топ-возраст:</p>
            {top_3_age.map((item, idx) => (
              <p key={idx}>
                • {item.age} лет — {item.count}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-3 flex-shrink-0">
        <h2 className="text-sm text-left font-bold text-[#1b1b1b] uppercase tracking-wide">
          Средняя смертность по сезонам (2022-2024)
        </h2>
        <button 
          className="px-2 text-sm text-gray-500 rounded-full border border-gray-300 hover:text-black hover:border-black hover:cursor-pointer"
          onClick={()=> handleClick()}
        >
          i
        </button>
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col">
        {showInfo && 
          <div className="absolute top-0 right-3 text-xs text-left p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 z-50 w-3/4">
            <p>Данные за 2022-2024 потому что 2021 год имел аномальные всплески, а 2025 год неполный, и их исключение делает картину более стабильной.</p>
            <p>• Зима остаётся самым тяжёлым сезоном: значительно выше смертность по сердечно-сосудистым (4314) и дыхательным заболеваниям (986).</p>
            <p>• Весна — наиболее благоприятный период, когда показатели снижаются по всем МКБ-группам.</p>
            <p>• Летом наблюдается умеренный рост по неврологическим причинам (1720) и “прочим” (3475). </p>
            <p>• Осень — наиболее стабильный сезон с показателями, близкими к среднегодовым, без резких всплесков.</p>    
          </div>
        }
        <div className="flex-1 p-3 min-h-0">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Загрузка...
            </div>
          ) : data.length === 0 ? (
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
              <BarChart
                data={data}
                layout="horizontal"
                margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
              >
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 10 }} 
                />

                <YAxis 
                  dataKey="average_value" 
                  type="number" 
                  tick={{ fontSize: 10 }} 
                />

                {/* <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #c1d3ff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                /> */}
                <Tooltip content={<CustomTooltip />} position={{ y: 80 }}/>

                <Bar dataKey="average_value" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill="url(#ageGradient)" />
                  ))}

                  <LabelList
                    dataKey="average_value"
                    position="top"
                    fontSize={10}
                    fontWeight="700"
                  />
                </Bar>

                <defs>
                  <linearGradient id="ageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3772ff" />
                    <stop offset="100%" stopColor="#2956bf" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}