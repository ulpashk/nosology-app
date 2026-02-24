"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ResponsiveContainer, Cell } from "recharts"
import { useState, useEffect } from "react"

function wrapText(text, maxCharsPerLine = 25) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  words.forEach((word) => {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += word + " ";
    } else {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    }
  });
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

const CustomYAxisTick = ({ x, y, payload }) => {
  // Shorter line length for mobile wrapping
  const lines = wrapText(payload.value, 20); 

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * 10 - (lines.length - 1) * 5}
          dy={3}
          fontSize={9} // Smaller font
          textAnchor="end"
          fill="#1b1b1b"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export default function MKBBarChart({ year, month }) {
  const [mkbData, setMkbData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    async function fetchMKB() {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month) params.append("month", month);
      const queryString = params.toString() ? `?${params.toString()}` : "";

      try {
        const response = await fetch(
          `https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_by_mkb_group/${queryString}`
        )
        const data = await response.json()
        const top10 = [...data].sort((a, b) => b.count - a.count).slice(0, 10)
        setMkbData(top10)
      } catch (error) {
        console.error("Failed to fetch MKB stats", error);
        setMkbData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMKB()
  }, [year, month])

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide truncate">Топ-10 МКБ группы</h3>
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
            <p className="mb-1">Сердечно-сосудистые, неврологические заболевания и онкология характерны для большинства стран.</p>
            <p>Высокий уровень связан с образом жизни и старением населения.</p>
          </div>
        }
        <div className="flex-1 p-2 sm:p-3 min-h-0">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Загрузка...</div>
          ) : mkbData.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <svg
                className="w-10 h-10 mb-2 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm font-medium">Нет данных</p>
              <p className="text-xs text-gray-400">за выбранный период</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={mkbData} margin={{ top: 5, right: 10, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis dataKey="name" type="category" width={70} tick={<CustomYAxisTick />} />
                <Tooltip
                  cursor={{fill: 'transparent'}}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #c1d3ff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {mkbData.map((entry, index) => (
                    <Cell key={index} fill="url(#mkbBlueGradient)" />
                  ))}
                  <LabelList dataKey="count" position="right" fontSize={9} fontWeight="700" />
                </Bar>
                <defs>
                  <linearGradient id="mkbBlueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3772ff" />
                    <stop offset="100%" stopColor="#2956bf" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}