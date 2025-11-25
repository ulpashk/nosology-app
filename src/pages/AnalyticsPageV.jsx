"use client"

import { useState } from "react"
import DeathByYearLineGraph from "../components/AnalyticsPage/DeathByYearLineGraph"
import MkbBarChart from "../components/AnalyticsPage/MkbBarChart"
import DeathCauseBarChart from "../components/AnalyticsPage/DeathCauseBarChart"
import DeathMoBarChart from "../components/AnalyticsPage/DeathMoBarChart"
import GenderBarChart from "../components/AnalyticsPage/GenderBarChart"

export default function AnalyticsPage() {

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#f5f6fa] to-[#eaebee] flex flex-col">
      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        <div className=" mx-auto h-full">
          {/* Top row - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[45%] mb-4">
            <div className="min-h-0">
              <DeathByYearLineGraph />
            </div>
            <div className="min-h-0">
              <GenderBarChart />
            </div>
          </div>

          {/* Bottom row - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[50%]">
            <div className="min-h-0">
              <MkbBarChart />
            </div>
            <div className="min-h-0">
              <DeathCauseBarChart />
            </div>
            <div className="min-h-0 hidden lg:block">
              <DeathMoBarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
  // return (
  //   <div className="h-full bg-[#eaebee] p-6 overflow-y-auto">
  //     <div>
  //       {selectedDistrict && (
  //         <div className="mb-4 bg-gradient-to-r from-[#3772ff] to-[#2956bf] text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between">
  //           <span className="font-semibold">Выбранный район: {selectedDistrict}</span>
  //           <button
  //             onClick={() => setSelectedDistrict("")}
  //             className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
  //           >
  //             Сбросить фильтр
  //           </button>
  //         </div>
  //       )}

  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  //         {/* <div className="transition-all duration-200 hover:scale-[1.02] lg:col-span-2"> */}
  //         <div className="transition-all duration-200 hover:scale-[1.02]">
  //           <DeathByYearLineGraph/>
  //         </div>

  //         <div className="transition-all duration-200 hover:scale-[1.02]">
  //           <GenderBarChart/>
  //         </div>
  //       </div>
  //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
  //         <div className="transition-all duration-200 hover:scale-[1.02]">
  //           <MkbBarChart/>
  //         </div>
  //         <div className="transition-all duration-200 hover:scale-[1.02]">
  //           <DeathCauseBarChart/>
  //         </div>

  //         <div className="transition-all duration-200 hover:scale-[1.02]">
  //           <DeathMoBarChart/>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}
