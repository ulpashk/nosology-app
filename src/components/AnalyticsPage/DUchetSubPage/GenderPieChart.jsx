"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

export default function PopulationPyramid() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      "https://admin.smartalmaty.kz/api/v1/healthcare/df-registry/stats_population_pyramid/"
    )
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) =>
        console.error("Error fetching population pyramid stats:", err)
      );
  }, []);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Распределение по полам
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            stackOffset="sign"
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            barCategoryGap="20%"
            barGap={8}
          >

            {/* Left side (negative male values) */}
            <XAxis
              type="number"
              tickFormatter={(v) => Math.abs(v)}
              fontSize={10}
            />

            <YAxis
              type="category"
              dataKey="age_group"
              width={40}
              tick={{ fontSize: 10 }}
            />

            <Tooltip
              formatter={(value) => Math.abs(value)}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #c1d3ff",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />

            <Legend wrapperStyle={{ fontSize: "12px" }} />

            {/* MALE (Left, blue) */}
            <Bar
              dataKey="male_negative"
              name="Мужчины"
              fill="#4B8DF8"
              radius={[0, 6, 6, 0]}
              barSize={18}
            >
              <LabelList
                dataKey="male"
                position="right"
                offset={6}
                formatter={(v) => v}
                fontSize={10}
              />
            </Bar>

            {/* FEMALE (Right, pink) */}
            <Bar
              dataKey="female"
              name="Женщины"
              fill="#FF7EBF"
              radius={[6, 0, 0, 6]}
              barSize={18}
            >
              <LabelList
                dataKey="female"
                position="right"
                offset={6}
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
