"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

export default function ForecastLineGraph() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://admin.smartalmaty.kz/api/v1/healthcare/forecast-nosology/?limit=200"
        );
        const json = await res.json();

        const rows = json.results || [];

        // 1. Filter data starting from year 2021
        const filteredRows = rows.filter((item) => {
          const year = parseInt(item.date.substring(0, 4));
          return year >= 2021; 
        });

        // 2. Map the filtered data
        const merged = filteredRows.map((item) => ({
          date: item.date.substring(0, 7), // YYYY-MM
          registry_actual: item.registry_count,
          deaths_actual: item.deaths_count,
          registry_forecast: item.registry_forecast,
          deaths_forecast: item.deaths_forecast,
        }));

        setChartData(merged);
      } catch (err) {
        console.error("Error loading forecast:", err);
      }
    }

    load();
  }, []);

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide truncate">
          Прогноз до 2030 года
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
            Прогноз (Gradient Boosting). R²=0.73, MAE=30.24. Учитывает динамику и сезонность.
          </div>
        }
        <div className="flex-1 p-2 sm:p-3 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#eaeaea" />

              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }} 
                minTickGap={30}
              />
              <YAxis tick={{ fontSize: 10 }} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #c1d3ff",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="registry_actual"
                name="Registry (actual)"
                stroke="#3772ff"
                strokeWidth={2}
                dot={{ r: 2 }}
                connectNulls
              />

              <Line
                type="monotone"
                dataKey="deaths_actual"
                name="Deaths (actual)"
                stroke="#ff4d4f"
                strokeWidth={2}
                dot={{ r: 2 }}
                connectNulls
              />

              <Line
                type="monotone"
                dataKey="registry_forecast"
                name="Registry (forecast)"
                stroke="#6b5bff"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
              />

              <Line
                type="monotone"
                dataKey="deaths_forecast"
                name="Deaths (forecast)"
                stroke="#ff6b81"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}