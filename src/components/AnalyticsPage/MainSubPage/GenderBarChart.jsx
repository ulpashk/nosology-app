"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GenderBarChart({ year, month }) {
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
          `https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_by_gender/${queryString}`
        );
        const json = await response.json();
        const results = json || [];
        setData(results);
      } catch (err) {
        console.error("Failed to fetch gender stats:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [year, month]);

  const COLORS = ["#FF7EBF", "#4B8DF8"];

  const female = data.find((d) => d.gender === "Женский");
  const male = data.find((d) => d.gender === "Мужской");

  const renderCustomizedLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col overflow-hidden relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide truncate">
          Распределение по полу
        </h3>
        <button 
          className="px-2 text-sm text-gray-500 rounded-full border border-gray-300 hover:text-black hover:border-black hover:cursor-pointer"
          onClick={()=> setShowInfo(!showInfo)}
        >
          i
        </button>
      </div>

      <div className="flex-1 p-2 sm:p-3 min-h-0 relative flex flex-col">
        {/* Average Age Badge - Scaled down for mobile */}
        {female && male && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-auto sm:right-3 bg-gray-50/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 text-[10px] sm:text-xs shadow-sm border border-gray-200 z-10 pointer-events-none">
            <p className="font-semibold text-gray-700 mb-0.5">Средний возраст:</p>
            <div className="flex gap-2 sm:block">
               <p className="text-gray-600">Ж: {female.avg_age}</p>
               <p className="text-gray-600">М: {male.avg_age}</p>
            </div>
          </div>
        )}

        {showInfo && 
          <div className="absolute top-0 right-2 sm:right-3 text-xs text-left p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 z-50 w-[90%] sm:w-2/3 shadow-xl">
            Женщины имеют более высокий средний возраст.
            При этом мужчины умирают чаще: их доля смертности выше.
            Это свидетельствует о более ранней и частой смертности среди мужчин.
          </div>
        }

        {/* CHART SECTION */}
        <div className="flex-1 min-h-0 w-full">
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
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #c1d3ff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend 
                    wrapperStyle={{ fontSize: "11px" }} 
                    verticalAlign="bottom" 
                    height={36}
                />
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="70%" 
                  paddingAngle={2}
                  startAngle={40}
                  endAngle={450}
                  labelLine={false} // Clean look for mobile
                  label={renderCustomizedLabel}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}