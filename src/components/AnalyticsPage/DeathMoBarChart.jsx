"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from "recharts"
import { useState, useEffect } from "react"

export default function DeathMoBarChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_by_death_cause/"
        )
        const json = await response.json()

        // take top 10
        const top10 = json
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)

        setData(top10)
      } catch (err) {
        console.error("Failed to fetch cause stats", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-[#c1d3ff] h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">Месячные причины</h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis dataKey="name" type="category" width={75} tick={{ fontSize: 9 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #c1d3ff",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill="url(#deathCauseGradient)" />
              ))}
              <LabelList dataKey="count" position="right" fontSize={10} fontWeight="700" />
            </Bar>
            <defs>
              <linearGradient id="deathCauseGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3772ff" />
                <stop offset="100%" stopColor="#2956bf" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
