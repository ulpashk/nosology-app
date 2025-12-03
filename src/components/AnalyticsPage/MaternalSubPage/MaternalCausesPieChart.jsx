"use client"

import { useEffect, useState, useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function MaternalCausesPieChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch("https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_maternal_causes/")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) =>
        console.error("Error fetching maternal causes stats:", err)
      )
  }, [])

  // 1. Process data: Group items where value is 1 into "Прочее"
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const groupedData = [];
    let othersCount = 0;

    data.forEach((item) => {
      if (item.value === 1) {
        othersCount += item.value; // Sum up single occurrences
      } else {
        groupedData.push(item);
      }
    });

    // If there are items in the 'Other' category, add them as a single slice
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

  // 2. Custom Tooltip to show Diagnosis and Value
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

  // 3. Label function to show Percentage
  const renderCustomizedLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">
          Причины материнской смертности
        </h3>
      </div>

      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} /> */}

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="mkb_code" // Uses 'mkb_code' or 'Прочее' for the Legend
              cx="50%"
              cy="50%"
              outerRadius={90}
              paddingAngle={3}
              startAngle={40}
              endAngle={400}
              labelLine={true}
              label={renderCustomizedLabel} // Renders percentage
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}