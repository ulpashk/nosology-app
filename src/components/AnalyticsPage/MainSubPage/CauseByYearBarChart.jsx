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

export default function CauseByYearBarChart({ year }) { // Only Year usually makes sense for a "By Year" chart
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

  // Filter local data when year changes
  useEffect(() => {
    if (year) {
      // Assuming the data has a "year" field (e.g. 2021, 2022)
      // We filter to show ONLY that year, or highlight it. 
      // Usually "By Year" charts show trend, so maybe you don't want to filter this one?
      // But if you do:
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

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Смертность по нозологиям по годам
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
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
  );
}