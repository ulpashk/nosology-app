"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ComposedChart,
} from "recharts";
import { useState, useEffect } from "react";

export default function YearDynamicsBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://admin.smartalmaty.kz/api/v1/healthcare/df-registry/stats_dynamics_2021_2025/"
        );
        const json = await response.json();
        setData(json || []);
      } catch (err) {
        console.error("Failed to fetch year dynamics:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Динамика числа пациентов по годам
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
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
            />

            {/* Bars */}
            <Bar dataKey="count" yAxisId="left" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill="url(#yearGradient)" />
              ))}

              <LabelList dataKey="count" position="top" fontSize={10} offset={24}/>
            </Bar>

            {/* Line on top */}
            <Line
              type="monotone"
              dataKey="index_2021"
              // dataKey="growth_percentage"
              yAxisId="right"
              stroke="#f81a1aff"
              // stroke="#ff7300"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            <defs>
              <linearGradient id="yearGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3772ff" />
                <stop offset="100%" stopColor="#2956bf" />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
