"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, ResponsiveContainer, Cell } from "recharts"
import { useState, useEffect } from "react"

// ---- WRAP HELPER ----
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

// ---- CUSTOM Y-AXIS TICK ----
const CustomYAxisTick = ({ x, y, payload }) => {
  const lines = wrapText(payload.value);

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

export default function MKBBarChart() {
  const [mkbData, setMkbData] = useState([])

  useEffect(() => { 
    async function fetchMKB() {
      try {
        const response = await fetch(
          "https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_by_mkb_group/"
        )
        const data = await response.json()

        const top10 = [...data]
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)

        setMkbData(top10)
      } catch (error) {
        console.error("Failed to fetch MKB stats", error)
      }
    }
    fetchMKB()
  }, [])

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border-2 border-[#c1d3ff] h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">Топ-10 МКБ группы</h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={mkbData} margin={{ top: 5, right: 10, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis dataKey="name" type="category" width={75} tick={<CustomYAxisTick />} />
            <Tooltip
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
              <LabelList dataKey="count" position="right" fontSize={10} fontWeight="700" />
            </Bar>
            <defs>
              <linearGradient id="mkbBlueGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3772ff" />
                <stop offset="100%" stopColor="#2956bf" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
