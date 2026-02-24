"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";

export default function CauseByYearBarChart({ year }) {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/cause_by_year.json"); 
        const json = await response.json();
        setOriginalData(json);
        setFilteredData(json);
      } catch (err) {
        console.error("Error loading mortality stats:", err);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (year) {
      const filtered = originalData.filter(d => d.year.toString() === year.toString());
      setFilteredData(filtered);
    } else {
      setFilteredData(originalData);
    }
  }, [year, originalData]);

  const keys = [
    "Материнская смертность",
    "Онкология",
    "Перинатальная/детская",
    "Прочее",
    "ССЗ",
    "Сахарный диабет",
    "Травмы и отравления",
    "Туберкулёз",
  ];

  const colors = [
    "#6E44FF",
    "#4D90FE",
    "#FF6B6B",
    "#FFB020",
    "#00C49F",
    "#0088FE",
    "#845EC2",
    "#C34A36",
  ];

  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    setShowInfo(!showInfo);
  }

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col overflow-hidden relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Смертность по нозологиям по годам
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
          <div className="absolute top-0 right-2 sm:right-3 text-xs text-left p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 z-50 w-[90%] sm:w-2/3 shadow-lg">
            График показывает распределение смертности по основным нозологиям за 2021–2025 годы. 
            <p>
              • В 2021 году наблюдаются максимальные значения, что связано с последствиями COVID-19.
            </p>
            <p>
              • В 2022 году фиксируется пик по туберкулёзу, а также по травмам и отравлениям, что может быть связано с постковидным периодом и задержками в диагностике. 
            </p>
            <p>
              • В 2023 году отмечается рост материнской смертности. 
            </p>
            В целом же основную долю ежегодно формируют сердечно-сосудистые заболевания. 
            Данные за 2025 год неполные.
          </div>
        }
        <div className="flex-1 p-3 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            >
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #c1d3ff",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: "10px",
                  paddingTop: "10px",
                }}
              />

              {keys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="mortality"
                  fill={colors[i]}
                  radius={i === keys.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}