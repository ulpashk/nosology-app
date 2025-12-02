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
} from "recharts";
import { useState, useEffect } from "react";

export default function AgeGroupsBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://admin.smartalmaty.kz/api/v1/healthcare/df-registry/stats_age_groups/"
        );
        const json = await response.json();

        setData(json || []);
      } catch (err) {
        console.error("Failed to fetch age group stats:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Количество людей по возрастным группам
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /> */}

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
      </div>
    </div>
  );
}
