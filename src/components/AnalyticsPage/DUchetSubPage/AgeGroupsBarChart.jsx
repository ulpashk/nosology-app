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

export default function AgeGroupsBarChart({ year, month }) {
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
          `https://admin.smartalmaty.kz/api/v1/healthcare/df-registry/stats_age_groups/${queryString}`
        );
        const json = await response.json();
        const results = json || [];
        setData(results);
      } catch (err) {
        console.error("Failed to fetch age group stats:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [year, month]);


  const isAllZeros = data.every((item) => item.count === 0);

  const showNoData = data.length === 0 || isAllZeros;

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Количество людей по возрастным группам
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Загрузка...
          </div>
        ) : showNoData ? ( 
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
                dataKey="age_group" 
                tick={{ fontSize: 10 }} 
              />

              <YAxis 
                dataKey="count" 
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

              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={index} fill="url(#ageGradient)" />
                ))}

                <LabelList
                  dataKey="count"
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
  );
}