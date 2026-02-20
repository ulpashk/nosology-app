"use client"

import { useState } from "react"
import MainSubPage from "./subpages/Analytics/MainSubPage"
import MaternalSubPage from "./subpages/Analytics/MaternalSubPage"
import DUchetSubPage from "./subpages/Analytics/DUchetSubPage"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("main")

  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")

  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false)

  const tabClasses = (tabId) =>
    `rounded-md px-4 py-1.5 text-xs font-semibold transition-colors border border-gray-300
     ${activeTab === tabId
        ? "bg-[#236FFF] text-white"
        : "bg-transparent text-gray-700 hover:bg-gray-100"
      }`

  const years = [2021, 2022, 2023, 2024, 2025]
  
  const months = [
    { value: "01", label: "Январь" },
    { value: "02", label: "Февраль" },
    { value: "03", label: "Март" },
    { value: "04", label: "Апрель" },
    { value: "05", label: "Май" },
    { value: "06", label: "Июнь" },
    { value: "07", label: "Июль" },
    { value: "08", label: "Август" },
    { value: "09", label: "Сентябрь" },
    { value: "10", label: "Октябрь" },
    { value: "11", label: "Ноябрь" },
    { value: "12", label: "Декабрь" },
  ]

  const handleYearChange = (year) => {
    setSelectedYear(year === null ? "" : year)
    setYearDropdownOpen(false)
  }

  const handleMonthChange = (monthValue) => {
    setSelectedMonth(monthValue === null ? "" : monthValue)
    setMonthDropdownOpen(false)
  }

  const getMonthLabel = (val) => {
    const m = months.find((item) => item.value === val)
    return m ? m.label : "Все месяцы"
  }

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#f5f6fa] to-[#eaebee] flex flex-col">
      <div className="px-4 sm:px-6 pt-2 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center relative z-20">
        
        <div className="flex gap-3">
          <button className={tabClasses("main")} onClick={() => setActiveTab("main")}>
            Главная
          </button>
          <button className={tabClasses("maternal")} onClick={() => setActiveTab("maternal")}>
            Материнская смертность
          </button>
          <button className={tabClasses("d_uchet")} onClick={() => setActiveTab("d_uchet")}>
            Д-учет
          </button>
        </div>

        <div className="flex gap-2">
          {(selectedYear !== "" || selectedMonth !== "") && (
            <button 
              onClick={clearFilters}
              className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
                ✕ Сбросить фильтры
            </button>
          )}

          <div className="relative w-32">
            <div
              onClick={() => {
                setYearDropdownOpen(!yearDropdownOpen)
                setMonthDropdownOpen(false)
              }}
              className="flex items-center justify-between px-3 py-1.5 border border-gray-300 bg-white rounded-md text-xs text-gray-700 cursor-pointer hover:bg-gray-50"
            >
              <span className="truncate">
                {selectedYear ? `${selectedYear} год` : "Все годы"}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  yearDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {yearDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-30 max-h-64 overflow-y-auto">
                <div className="p-2 space-y-1 text-xs">
                  <div
                    onClick={() => handleYearChange(null)}
                    className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded hover:bg-gray-50 ${
                      !selectedYear ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    <span>Все годы</span>
                    {!selectedYear && (
                      <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div className="border-b my-1"></div>

                  {years.map((year) => (
                    <div
                      key={year}
                      onClick={() => handleYearChange(year)}
                      className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded hover:bg-gray-50 ${
                        parseInt(selectedYear) === year ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      <span>{year} год</span>
                      {parseInt(selectedYear) === year && (
                        <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative w-36">
            <div
              onClick={() => {
                setMonthDropdownOpen(!monthDropdownOpen)
                setYearDropdownOpen(false)
              }}
              className="flex items-center justify-between px-3 py-1.5 border border-gray-300 bg-white rounded-md text-xs text-gray-700 cursor-pointer hover:bg-gray-50"
            >
              <span className="truncate">
                {getMonthLabel(selectedMonth)}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  monthDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {monthDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-30 max-h-64 overflow-y-auto">
                <div className="p-2 space-y-1 text-xs">
                  <div
                    onClick={() => handleMonthChange(null)}
                    className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded hover:bg-gray-50 ${
                      !selectedMonth ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    <span>Все месяцы</span>
                    {!selectedMonth && (
                      <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div className="border-b my-1"></div>

                  {months.map((m) => (
                    <div
                      key={m.value}
                      onClick={() => handleMonthChange(m.value)}
                      className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded hover:bg-gray-50 ${
                        selectedMonth === m.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      <span>{m.label}</span>
                      {selectedMonth === m.value && (
                        <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 sm:p-6 relative z-10">
        <div className="mx-auto h-full">
          {activeTab === "main" && (
            <MainSubPage 
              selectedYear={selectedYear} 
              selectedMonth={selectedMonth} 
            />
          )}
          {activeTab === "maternal" && (
            <MaternalSubPage 
              selectedYear={selectedYear} 
              selectedMonth={selectedMonth} 
            /> 
          )}
          {activeTab === "d_uchet" && ( 
            <DUchetSubPage 
              selectedYear={selectedYear} 
              selectedMonth={selectedMonth} 
            /> 
          )}
        </div>
      </div>
    </div>
  )
}