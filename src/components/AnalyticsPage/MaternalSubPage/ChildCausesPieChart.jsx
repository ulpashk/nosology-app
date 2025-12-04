"use client"

import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function ChildCausesPieChart({ year, month }) { 
  const [data, setData] = useState([])

  // useEffect(() => {
  //   fetch("https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_child_causes/")
  //     .then((res) => res.json())
  //     .then((json) => setData(json.slice(0, 10)))
  //     .catch((err) =>
  //       console.error("Error fetching maternal causes stats:", err)
  //     )
  // }, [])

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

        const top10 = results.slice(0, 10);

        setData(top10);
      } catch (err) {
        console.error("Failed to fetch maternal causes stats:", err);
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
        <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg max-w-[250px]">
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
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Причины детской смертности
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
        {isLoading ? (
          // Optional: Simple Loading State
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Загрузка...
          </div>
        ) : data.length === 0 ? (
          // NO DATA STATE
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
              {/* <Legend wrapperStyle={{ fontSize: "12px" }} /> */}

              <Pie
                data={data}
                dataKey="value"
                nameKey="mkb_code"
                cx="50%"
                cy="50%"
                outerRadius={90}
                paddingAngle={3}
                startAngle={40}
                endAngle={400}
                labelLine={true}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
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
