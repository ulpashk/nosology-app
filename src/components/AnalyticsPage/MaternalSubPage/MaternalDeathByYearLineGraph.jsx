"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { useState, useEffect } from "react"

export default function MaternalDeathByYearLineGraph() {
  const [stats, setStats] = useState([])
  const [mode, setMode] = useState("year")
  const [selectedYear, setSelectedYear] = useState(null)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function loadAll() {
      try {
        const res = await fetch(
          "https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_maternal_responsibility_by_year/"
        )
        const json = await res.json()

        setStats(json)

        if (json.length > 0) {
          setSelectedYear(json[0].year)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }
    loadAll()
  }, [])

  useEffect(() => {
    if (mode === "year") {
      setChartData(
        stats.map((y) => ({
          label: y.year.toString(),
          count: y.count,
        }))
      )
    }

    if (mode === "year-month" && selectedYear) {
      const found = stats.find((y) => y.year == selectedYear)
      if (found) {
        const months = found.months || []

        setChartData(
          months
            .sort((a, b) => a.id - b.id)
            .map((m) => ({
              label: m.id.toString().padStart(2, "0"),
              count: m.total,
            }))
        )
      }
    }
  }, [mode, selectedYear, stats])

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Материнская смертность — Годы и Месяцы
        </h3>
      </div>

      <div className="p-3 border-b border-gray-50">
        <div className="flex flex-wrap gap-2 mb-3">
          {/* YEAR BUTTON */}
          <button
            className={`px-2 py-1 text-xs rounded-lg transition-colors ${
              mode === "year"
                ? "bg-[#3772ff] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setMode("year")}
          >
            По годам
          </button>

          {/* YEAR-MONTH BUTTON */}
          <button
            className={`px-2 py-1 text-xs rounded-lg transition-colors ${
              mode === "year-month"
                ? "bg-[#3772ff] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setMode("year-month")}
          >
            По месяцам
          </button>
        </div>

        {/* Show year selector only for Year-Month mode */}
        {mode === "year-month" && (
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3772ff]"
          >
            {stats.map((y) => (
              <option key={y.year} value={y.year}>
                {y.year}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* CHART */}
      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #c1d3ff",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3772ff"
              strokeWidth={2}
              dot={{ fill: "#3772ff", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
