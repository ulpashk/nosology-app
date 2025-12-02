"use client"

import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function ChildCausesPieChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch("https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_child_causes/")
      .then((res) => res.json())
      .then((json) => setData(json.slice(0, 10)))
      .catch((err) =>
        console.error("Error fetching maternal causes stats:", err)
      )
  }, [])

  // generate soft random pastel colors
  const COLORS = [
    "#4B8DF8",
    "#FF7EBF",
    "#FFB84C",
    "#7CD1B8",
    "#A97FFF",
    "#FF6B6B",
    "#59C3C3",
    "#FFA6A6",
  ]

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Причины детской смертности
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #c1d3ff",
                borderRadius: "8px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />

            <Pie
              data={data}
              dataKey="value"
              nameKey="mkb_code"
              cx="50%"
              cy="50%"
              outerRadius={90}
              paddingAngle={3}
              startAngle={40}
              endAngle={400}
              labelLine={true}
              label={({ value }) => `${value}`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
