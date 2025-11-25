import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GenderDonutChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_by_gender/")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error fetching gender stats:", err));
  }, []);

  const COLORS = ["#FF7EBF", "#4B8DF8"]; // Pink for women, blue for men

  const female = data.find((d) => d.gender === "Женский");
  const male = data.find((d) => d.gender === "Мужской");

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border-2 border-[#c1d3ff] h-full flex flex-col">
      {/* <h2 className="text-lg font-bold mb-4">Распределение по полу</h2> */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">Распределение по полу</h3>
      </div>
      {/* Average age badge */}
      <div className="flex-1 p-3 min-h-0 relative flex flex-col">
        {female && male && (
          <div className="absolute top-3 right-3 bg-gray-50 rounded-lg p-2 text-xs shadow-sm border border-gray-200 z-10">
            <p className="font-semibold text-gray-700">Средний возраст:</p>
            <p className="text-gray-600">Женский: {female.avg_age}</p>
            <p className="text-gray-600">Мужской: {male.avg_age}</p>
          </div>
        )}

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #c1d3ff",
                  borderRadius: "8px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Pie
                data={data}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={2}
                startAngle={40}
                endAngle={450}
                labelLine={true}
                label={({value }) => `${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
