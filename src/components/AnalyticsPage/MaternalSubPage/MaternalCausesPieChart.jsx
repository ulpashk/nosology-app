"use client"

import { useEffect, useState, useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function MaternalCausesPieChart({ year, month }) {
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
          `https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_maternal_causes/${queryString}`
        );
        const json = await response.json();
        const results = json || [];
        setData(results);
      } catch (err) {
        console.error("Failed to fetch maternal causes stats:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [year, month]);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const groupedData = [];
    let othersCount = 0;
    data.forEach((item) => {
      if (item.value === 1) {
        othersCount += item.value;
      } else {
        groupedData.push(item);
      }
    });
    if (othersCount > 0) {
      groupedData.push({
        id: "other",
        mkb_code: "Прочее",
        diagnosis: "Прочие причины (единичные случаи)",
        value: othersCount,
      });
    }
    return groupedData;
  }, [data]);

  const COLORS = ["#4B8DF8", "#FF7EBF", "#FFB84C", "#7CD1B8", "#A97FFF", "#FF6B6B", "#59C3C3", "#FFA6A6"]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { diagnosis, value } = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-blue-200 rounded-lg shadow-lg max-w-[200px] z-50 relative text-xs">
          <p className="font-semibold text-gray-800 mb-1">{diagnosis}</p>
          <p className="text-blue-600">Кол-во: <span className="font-bold">{value}</span></p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col overflow-hidden relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide truncate">
          Причины материнской смертности
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
          <div className="absolute top-0 right-2 sm:right-3 text-xs text-left p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 z-50 w-[90%] sm:w-2/3 shadow-xl">
            Включает болезни кровообращения, кровотечения, инфекции, преэклампсию.
          </div>
        }
        <div className="flex-1 p-2 sm:p-3 min-h-0 w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Загрузка...</div>
          ) : data.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs">
              Нет данных
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="mkb_code"
                  cx="50%"
                  cy="50%"
                  outerRadius="75%" 
                  paddingAngle={3}
                  startAngle={40}
                  endAngle={400}
                  labelLine={true}
                  label={renderCustomizedLabel}
                  isAnimationActive={true} 
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}