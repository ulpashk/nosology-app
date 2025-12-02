"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";

export default function CauseByYearBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/cause_by_year.json"); 
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Error loading mortality stats:", err);
      }
    }

    loadData();
  }, []);

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

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      
      {/* Title */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Смертность по нозологиям по годам
        </h3>
      </div>

      {/* Chart */}
      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /> */}

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
  );
}
