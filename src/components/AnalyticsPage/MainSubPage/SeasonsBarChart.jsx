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

  useEffect(() => {
    async function fetchData() {
      // Construct Query String
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
        console.error("Failed to fetch age group stats:", err);
      }
    }

    fetchData();
  }, [year, month]); // Add dependencies

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Средняя смертность по сезонам
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
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

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #c1d3ff",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />

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
      </div>
    </div>
  );
}