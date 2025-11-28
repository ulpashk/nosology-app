"use client"

import { useState } from "react"
import MainPage from "./subpages/Analytics/MainPage"
import MaternalSubPage from "./subpages/Analytics/MaternalSubPage"
import DUchetSubPage from "./subpages/Analytics/DUchetSubPage"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("main")

  const tabClasses = (tabId) =>
    `rounded-md px-4 py-1.5 text-xs font-semibold transition-colors border border-gray-300
     ${activeTab === tabId 
        ? "bg-[#236FFF] text-white" 
        : "bg-transparent text-gray-700 hover:bg-gray-100"
     }`

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#f5f6fa] to-[#eaebee] flex flex-col">

      <div className="px-4 sm:px-6 pt-2 flex gap-3">
        <button className={tabClasses("main")} onClick={() => setActiveTab("main")}>
          Главная
        </button>
        <button className={tabClasses("maternal")} onClick={() => setActiveTab("maternal")}>
          Материнская смерть
        </button>
        <button className={tabClasses("d_uchet")} onClick={() => setActiveTab("d_uchet")}>
          Д-учет
        </button>
      </div>

      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        <div className="mx-auto h-full">
          {activeTab === "main" && <MainPage />}
          {activeTab === "maternal" && <MaternalSubPage /> }
          {activeTab === "d_uchet" && ( <DUchetSubPage /> )}
        </div>
      </div>

    </div>
  )
}
