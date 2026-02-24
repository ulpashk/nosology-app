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


  useEffect(() => {
    if (mode === "year") {
      setChartData(
        stats.map((y) => ({
          label: y.year.toString(),
          maternal: (y.maternal_polyclinic_coeff || 0) + (y.maternal_hospital_coeff || 0),
          child: (y.child_polyclinic_coeff || 0) + (y.child_hospital_coeff || 0),
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
            maternal: (m.maternal_polyclinic_coeff || 0) + (m.maternal_hospital_coeff || 0),
            child: (m.child_polyclinic_coeff || 0) + (m.child_hospital_coeff || 0),
          }))
      )
    }
  }, [mode, selectedYear, stats])

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide truncate pr-2">
          Материнская и Детская смертность
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
            График показывает динамику на 1000 живорождений. 
            Пик детской смертности был в 2021 (5.1). 
            Материнская смертность остаётся на низком уровне.
          </div>
        }
        <div className="p-3 border-b border-gray-50">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              className={`px-2 py-1 text-[10px] sm:text-xs rounded-lg transition-colors whitespace-nowrap ${
                mode === "year"
                  ? "bg-[#3772ff] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setMode("year")}
            >
              По годам
            </button>

            <button
              className={`px-2 py-1 text-[10px] sm:text-xs rounded-lg transition-colors whitespace-nowrap ${
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

        <div className="flex-1 p-2 sm:p-3 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd"/>
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
                  fontSize={9}
                  fontWeight={600}
                />
              </Line>

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
                  fontSize={9}
                  fontWeight={600}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}