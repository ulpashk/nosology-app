import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
 
export default function GenderDonutChart({ year, month }) {
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   // Construct Query String
  //   const params = new URLSearchParams();
  //   if (year) params.append("year", year);
  //   if (month) params.append("month", month);
  //   const queryString = params.toString() ? `?${params.toString()}` : "";

  //   fetch(`https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_by_gender/${queryString}`)
  //     .then((res) => res.json())
  //     .then((json) => setData(json))
  //     .catch((err) => console.error("Error fetching gender stats:", err));
  // }, [year, month]); 

  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); // Start loading
      
      // Build Query String
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (month) params.append("month", month);
      const queryString = params.toString() ? `?${params.toString()}` : "";

      try {
        const response = await fetch(
          `https://admin.smartalmaty.kz/api/v1/healthcare/death-certificates/stat_by_gender/${queryString}`
        );
        const json = await response.json();

        // API returns { count, next, previous, results: [...] }
        const results = json || [];

        setData(results);
      } catch (err) {
        console.error("Failed to fetch MO stats:", err);
        setData([]); // Ensure data is empty on error
      } finally {
        setIsLoading(false); // Stop loading regardless of success/fail
      }
    }

    fetchData();
  }, [year, month]);

  const COLORS = ["#FF7EBF", "#4B8DF8"]; 

  const female = data.find((d) => d.gender === "Женский");
  const male = data.find((d) => d.gender === "Мужской");

  const renderCustomizedLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="histogram-container bg-white rounded-xl shadow-md border border-gray-300 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wide">Распределение по полу</h3>
      </div>
      
      <div className="flex-1 p-3 min-h-0 relative flex flex-col">
        {female && male && (
          <div className="absolute top-3 right-3 bg-gray-50 rounded-lg p-2 text-xs shadow-sm border border-gray-200 z-10">
            <p className="font-semibold text-gray-700">Средний возраст:</p>
            <p className="text-gray-600">Женский: {female.avg_age}</p>
            <p className="text-gray-600">Мужской: {male.avg_age}</p>
          </div>
        )}

        <div className="flex-1 min-h-0">
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
                  label={renderCustomizedLabel}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}