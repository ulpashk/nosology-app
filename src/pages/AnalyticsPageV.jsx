// "use client"

// import { useState } from "react"
// import DeathByYearLineGraph from "../components/AnalyticsPage/DeathByYearLineGraph"
// import MkbBarChart from "../components/AnalyticsPage/MkbBarChart"
// import DeathCauseBarChart from "../components/AnalyticsPage/DeathCauseBarChart"
// import DeathMoBarChart from "../components/AnalyticsPage/DeathMoBarChart"
// import GenderBarChart from "../components/AnalyticsPage/GenderBarChart"

// export default function AnalyticsPage() {

//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-[#f5f6fa] to-[#eaebee] flex flex-col">
//       <div className="flex-1 overflow-hidden p-4 sm:p-6">
//         <div className=" mx-auto h-full">

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[45%] mb-4">
//             <div className="min-h-0">
//               <DeathByYearLineGraph />
//             </div>
//             <div className="min-h-0">
//               <GenderBarChart />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[50%]">
//             <div className="min-h-0">
//               <MkbBarChart />
//             </div>
//             <div className="min-h-0">
//               <DeathCauseBarChart />
//             </div>
//             <div className="min-h-0 hidden lg:block">
//               <DeathMoBarChart />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import DeathByYearLineGraph from "../components/AnalyticsPage/DeathByYearLineGraph"
import MkbBarChart from "../components/AnalyticsPage/MkbBarChart"
import DeathCauseBarChart from "../components/AnalyticsPage/DeathCauseBarChart"
import DeathMoBarChart from "../components/AnalyticsPage/DeathMoBarChart"
import GenderBarChart from "../components/AnalyticsPage/GenderBarChart"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("main") // ➜ default tab

  const tabClasses = (tabId) =>
    `px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200
     ${activeTab === tabId 
        ? "bg-blue-600 text-white shadow-md scale-105" 
        : "bg-white text-gray-600 border hover:bg-gray-100"
     }`

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#f5f6fa] to-[#eaebee] flex flex-col">

      {/* --- TOP BUTTONS --- */}
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

      {/* --- CONTENT --- */}
      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        <div className="mx-auto h-full">

          {/* --- SHOW ONLY MAIN TAB DIAGRAMS --- */}
          {activeTab === "main" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[45%] mb-4">
                <div className="min-h-0">
                  <DeathByYearLineGraph />
                </div>
                <div className="min-h-0">
                  <GenderBarChart />
                </div>
              </div>

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
            </>
          )}

          {/* --- MATERNAL MORTALITY TAB --- */}
          {activeTab === "maternal" && (
            <div className="text-gray-700 text-center mt-20">
              <p className="text-lg font-semibold">Материнская смертность (данные будут тут)</p>
            </div>
          )}

          {/* --- D-UCHET TAB --- */}
          {activeTab === "d_uchet" && (
            <div className="text-gray-700 text-center mt-20">
              <p className="text-lg font-semibold">Д-учет (данные будут тут)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
