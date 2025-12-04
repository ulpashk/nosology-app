"use client"

import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function ChildCausesPieChart({ year, month }) { 
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
          `https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_child_causes/${queryString}`
        );
        const json = await response.json();
        const results = json || [];
        const top10 = results.slice(0, 10); // Take top 10

        setData(top10);
      } catch (err) {
        console.error("Failed to fetch child causes stats:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [year, month]);

  const COLORS = [
    "#4B8DF8",
    "#FF7EBF",
    "#FFB84C",
    "#7CD1B8",
    "#A97FFF",
    "#FF6B6B",
    "#59C3C3",
    "#FFA6A6",
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { diagnosis, value } = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg max-w-[250px] z-50 relative">
          <p className="text-xs font-semibold text-gray-800 mb-1">{diagnosis}</p>
          <p className="text-sm text-blue-600">
            Количество: <span className="font-bold">{value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    // Added 'overflow-hidden' to ensure content stays within rounded corners
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Причины детской смертности
        </h3>
      </div>

      {/* min-h-0 allows the chart container to shrink/grow with the parent grid cell */}
      <div className="flex-1 p-3 min-h-0 w-full">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Загрузка...
          </div>
        ) : data.length === 0 ? (
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
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="mkb_code"
                cx="50%"
                cy="50%"
                // CHANGED: Fixed pixel value (90) replaced with percentage (75%)
                // This allows the pie to scale based on the screen size.
                outerRadius="75%" 
                paddingAngle={3}
                startAngle={40}
                endAngle={400}
                labelLine={true}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}