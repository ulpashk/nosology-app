import { useState, useEffect } from "react";

export default function MapFilterIndicators({ selectedDistrict, generalStats }) {
  const [vopData, setVopData] = useState([]);
 
  const formatPopulation = (value) => {
    if (value == null) return "—";
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} млн`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)} тыс`;
    return value.toString();
  };

  const formatAvgPerson = (value) => {
    if (value == null) return "—";
    const rounded = Math.ceil(value * 100) / 100;
    return rounded.toLocaleString("en-US").replace(/,/g, " ");
  };

  useEffect(() => {
    async function fetchData() {
      const filter = selectedDistrict !== "Все районы" ? `district=${selectedDistrict}` : "";
      try {
        const response = await fetch(
          `https://admin.smartalmaty.kz/api/v1/healthcare/org-capacity/count_by_district/?${filter}`
        );
        const data = await response.json();
        setVopData(data.totals);
      } catch (err) {
        console.error("Failed to fetch deficit data", err);
      }
    }
    fetchData();
  }, [selectedDistrict]);

  return (
    <div className="space-y-2 text-[11px] md:text-xs bg-white/95 p-2 md:p-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
          <div className="font-semibold text-blue-800 text-xs md:text-[16px]">{generalStats.totalCount || "-"}</div>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Всего поликлиник</p>
        </div>

        <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
          <div className="font-semibold text-blue-800 text-xs md:text-[16px]">
            {formatPopulation(generalStats.totalPopulation)}
          </div>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Обслуживаемое население</p>
        </div>
      </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
                <div className="font-semibold text-blue-800 text-xs md:text-[16px]">
                    {formatAvgPerson((generalStats.deathCertificateCount)) || "-"}
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Кол-во смертности</p>
            </div>

            <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
                <div className="font-semibold text-blue-800 text-xs md:text-[16px]">
                    {formatAvgPerson((generalStats.deathCertificateAvgYear)) || "-"}
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">
                    Кол-во смертности в год
                </p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
                <div className="font-semibold text-blue-800 text-xs md:text-[16px]">
                    {formatAvgPerson(generalStats.dfRegistryCount)}
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">
                    Кол-во Д-учет 
                </p>
            </div>
            <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
                <div className="font-semibold text-blue-800 text-xs md:text-[16px]">
                    {formatAvgPerson((generalStats.avgVisit))}
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Ср. посещении на поликлинику</p>
            </div>
        </div>

      <div className="bg-blue-200/30 p-2 md:p-3 rounded-md md:rounded-lg border-l-2 md:border-l-4 border-blue-500">
        <div className="text-left text-[9px] md:text-[10px]">
          <b>Примечание:</b> Для просмотра детальной информации по медицинским учреждениям кликните на соответствующую точку на карте.
        </div>
      </div>

    </div>
  );
}
