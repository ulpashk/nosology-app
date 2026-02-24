"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from "recharts"
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
  const lines = wrapText(payload.value, 20);
  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * 10 - (lines.length - 1) * 5}
          dy={3}
          fontSize={9}
          textAnchor="end"
          fill="#1b1b1b"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export default function PatientsBarChart({ year, month }) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month) params.append("month", month);
      const queryString = params.toString() ? `?${params.toString()}` : "";

      try {
        const response = await fetch(
          `https://admin.smartalmaty.kz/api/v1/healthcare/df-registry/stats_top_mo/${queryString}`
        );
        const json = await response.json();
        const results = json || [];
        const top10 = results.slice(0, 10);
        setData(top10);
      } catch (err) {
        console.error("Failed to fetch cause stats:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [year, month]);

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide truncate">
          ТОП-15 МО по числу пациентов
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
          <div className="absolute top-0 right-2 sm:right-3 text-xs text-left p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 z-50 w-[90%] sm:w-1/3 shadow-xl">
            «Алматинский онкологический центр» занимает около 50% всех пациентов.
          </div>
        }
        <div className="flex-1 p-2 sm:p-3 min-h-0 w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Загрузка...
            </div>
          ) : data.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs">
              Нет данных
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {/* Increased left margin for Y axis labels */}
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 15, left: 70, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis dataKey="name" type="category" width={75} tick={<CustomYAxisTick />} />
                <Tooltip
                  cursor={{fill: 'transparent'}}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #c1d3ff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill="url(#deathCauseGradient)" />
                  ))}
                  <LabelList dataKey="count" position="right" fontSize={9} fontWeight="700" />
                </Bar>
                <defs>
                  <linearGradient id="deathCauseGradient" x1="0" y1="0" x2="1" y2="0">
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