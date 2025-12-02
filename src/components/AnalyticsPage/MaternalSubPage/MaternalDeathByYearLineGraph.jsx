"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList
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

  // 🔥 Build chart data depending on mode
  useEffect(() => {
    if (mode === "year") {
      setChartData(
        stats.map((y) => ({
          label: y.year.toString(),

          // Sum for MATERnal
          maternal:
            (y.maternal_polyclinic_coeff || 0) +
            (y.maternal_hospital_coeff || 0),

          // Sum for CHILD
          child:
            (y.child_polyclinic_coeff || 0) +
            (y.child_hospital_coeff || 0),
        }))
      )
    }

    if (mode === "year-month" && selectedYear) {
      const found = stats.find((y) => y.year == selectedYear)
      if (!found) return

      const months = found.months || []

      setChartData(
        months
          .sort((a, b) => a.id - b.id)
          .map((m) => ({
            label: m.id.toString().padStart(2, "0"),

            // Monthly maternal coeff sum
            maternal:
              (m.maternal_polyclinic_coeff || 0) +
              (m.maternal_hospital_coeff || 0),

            // Monthly child coeff sum
            child:
              (m.child_polyclinic_coeff || 0) +
              (m.child_hospital_coeff || 0),
          }))
      )
    }
  }, [mode, selectedYear, stats])

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Материнская и Детская смертность — Годы и Месяцы
        </h3>
      </div>

      {/* MODE BUTTONS */}
      <div className="p-3 border-b border-gray-50">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            className={`px-2 py-1 text-xs rounded-lg ${
              mode === "year"
                ? "bg-[#3772ff] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setMode("year")}
          >
            По годам
          </button>

          <button
            className={`px-2 py-1 text-xs rounded-lg ${
              mode === "year-month"
                ? "bg-[#3772ff] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setMode("year-month")}
          >
            По месяцам
          </button>
        </div>

        {mode === "year-month" && (
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full text-xs border border-gray-300 px-2 py-1 rounded-lg"
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

            {/* Maternal line */}
            <Line
              type="monotone"
              dataKey="maternal"
              name="Материнская"
              stroke="#ff4d4f"
              strokeWidth={2}
              dot={{ r: 3 }}
            >
              <LabelList
                dataKey="maternal"
                position="top"
                offset={6}
                fontSize={10}
                fontWeight={600}
              />
            </Line>

            {/* Child line */}
            <Line
              type="monotone"
              dataKey="child"
              name="Детская"
              stroke="#3772ff"
              strokeWidth={2}
              dot={{ r: 3 }}
            >
              <LabelList
                dataKey="child"
                position="top"
                offset={6}
                fontSize={10}
                fontWeight={600}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
