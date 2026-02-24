"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

export default function PopulationPyramid({ year, month }) {
  const [data, setData] = useState([]);
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
          `https://admin.smartalmaty.kz/api/v1/healthcare/df-registry/stats_population_pyramid/${queryString}`
        );
        const json = await response.json();
        const results = json || [];
        setData(results);
      } catch (err) {
        console.error("Error fetching population pyramid stats:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [year, month]);

  const isAllZeros = data.every((item) => item.male === 0 && item.female === 0);
  const showNoData = data.length === 0 || isAllZeros;
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col relative">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-row items-center justify-between gap-3 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-bold text-[#1b1b1b] uppercase tracking-wide truncate">
          Распределение по полам
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
            Молодой возраст: больше мужчин (травмы). 
            После 40 лет: пик у женщин (хронические заболевания).
          </div>
        }

        <div className="flex-1 p-2 sm:p-3 min-h-0">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Загрузка...
            </div>
          ) : showNoData ? ( 
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs">
              Нет данных
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                stackOffset="sign"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                barCategoryGap="20%"
                barGap={4}
              >
                <XAxis
                  type="number"
                  tickFormatter={(v) => Math.abs(v)}
                  fontSize={10}
                />
                <YAxis
                  type="category"
                  dataKey="age_group"
                  width={35}
                  tick={{ fontSize: 9 }}
                />
                <Tooltip
                  cursor={{fill: 'transparent'}}
                  formatter={(value) => Math.abs(value)}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #c1d3ff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />

                <Bar
                  dataKey="male_negative"
                  name="Мужчины"
                  fill="#4B8DF8"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                >
                  <LabelList
                    dataKey="male"
                    position="right"
                    offset={5}
                    formatter={(v) => v}
                    fontSize={9}
                  />
                </Bar>

                <Bar
                  dataKey="female"
                  name="Женщины"
                  fill="#FF7EBF"
                  radius={[4, 0, 0, 4]}
                  barSize={16}
                >
                  <LabelList
                    dataKey="female"
                    position="right"
                    offset={5}
                    fontSize={9}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}