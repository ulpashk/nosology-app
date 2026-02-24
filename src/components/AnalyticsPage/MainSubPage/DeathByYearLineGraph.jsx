"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList} from "recharts"
import { useState, useEffect } from "react"

export default function DeathByYearLineGraph() {
  const [yearStats, setYearStats] = useState([])
  const [avgMonthStats, setAvgMonthStats] = useState([])
  const [mode, setMode] = useState("year")
  const [selectedYear, setSelectedYear] = useState(null)
  const [chartData, setChartData] = useState([])

  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    setShowInfo(!showInfo);
  }

  useEffect(() => {
    async function loadAll() {
      try {
        const yearRes = await fetch("https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_by_year/")
        const yearJson = await yearRes.json()

        const avgRes = await fetch("https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_by_months/")
        const avgJson = await avgRes.json()

        setYearStats(yearJson)
        setAvgMonthStats(avgJson)

        if (yearJson.length > 0) {
          setSelectedYear(yearJson[0].year)
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
        yearStats.map((y) => ({
          label: y.year.toString(),
          count: y.count,
        })),
      )
    }

    if (mode === "avg-month") {
      setChartData(
        avgMonthStats
          .sort((a, b) => a.month - b.month)
          .map((m) => ({
            label: m.month.toString().padStart(2, "0"),
            count: m.count,
          })),
      )
    }

    if (mode === "year-month" && selectedYear) {
      const found = yearStats.find((y) => y.year == selectedYear)
      if (found) {
        setChartData(
          found.months.map((m, i) => ({
            label: (i + 1).toString().padStart(2, "0"),
            count: m.m_count,
          })),
        )
      }
    }
  }, [mode, selectedYear, yearStats, avgMonthStats])

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col overflow-hidden relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
            Смертность по годам и месяцам
        </h3>
        <button 
          className="px-2 text-sm text-gray-500 rounded-full border border-gray-300 hover:text-black hover:border-black hover:cursor-pointer"
          onClick={()=> handleClick()}
        >
          i
        </button>
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col">
        {showInfo && 
          <div className="absolute top-0 right-2 sm:right-3 text-xs text-left p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 z-50 w-[90%] sm:w-2/3 shadow-lg">
            <p className="mb-2">
              На графике представлена динамика общей смертности за период 2021–2025 гг.
            </p>
            <p className="mb-2">
              После пикового значения в 2021 году смертность последовательно снижалась
              в 2022–2023 гг.
            </p>
            <p>Для детального анализа доступны вкладки:</p>
            <p>• «По месяцам года» — помесячная динамика</p>
            <p>• «По месяцам (в среднем)» — средние значения</p>
          </div>
        }
        
        <div className="p-3 border-b border-gray-50">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              className={`px-2 py-1 text-[10px] sm:text-xs rounded-lg transition-colors whitespace-nowrap ${
                mode === "year" ? "bg-[#3772ff] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setMode("year")}
            >
              По годам
            </button>

            <button
              className={`px-2 py-1 text-[10px] sm:text-xs rounded-lg transition-colors whitespace-nowrap ${
                mode === "year-month" ? "bg-[#3772ff] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setMode("year-month")}
            >
              По месяцам года
            </button>

            <button
              className={`px-2 py-1 text-[10px] sm:text-xs rounded-lg transition-colors whitespace-nowrap ${
                mode === "avg-month" ? "bg-[#3772ff] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setMode("avg-month")}
            >
              По месяцам (ср)
            </button>

          </div>

          {mode === "year-month" && (
            <select
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3772ff]"
            >
              {yearStats.map((y) => (
                <option key={y.year} value={y.year}>
                  {y.year}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex-1 p-2 sm:p-3 pt-0 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#f0f0f0" />
              {/* Responsive ticks */}
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #c1d3ff",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3772ff"
                strokeWidth={2}
                dot={{ fill: "#3772ff", r: 3 }}
              >
                <LabelList
                  dataKey="count"
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