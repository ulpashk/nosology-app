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
          return year >= 2021; // Change this to 2022 if that was intended
        });

        // 2. Map the filtered data
        const merged = filteredRows.map((item) => ({
          date: item.date.substring(0, 7), // YYYY-MM

          // Actual values
          registry_actual: item.registry_count,
          deaths_actual: item.deaths_count,

          // Forecast values
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

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Прогноз до 2030 года
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eaeaea" />

            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }} 
              // Optional: reduce clutter if too many dates appear
              minTickGap={30}
            />
            <YAxis tick={{ fontSize: 10 }} />

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #c1d3ff",
                borderRadius: "8px",
              }}
            />

            {/* ---- ACTUAL LINES ---- */}
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

            {/* ---- FORECAST LINES (dashed) ---- */}
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
  );
}