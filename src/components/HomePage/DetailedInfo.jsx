"use client";

export default function DetailedInfo({buildingData}){
  const formatAvgPerson = (value) => {
    if (value == null) return "—";
    const rounded = Math.ceil(value * 100) / 100;
    return rounded.toLocaleString("en-US").replace(/,/g, " ");
  };

  return (
    <div className="space-y-2 text-[11px] md:text-xs bg-white/95 p-2 md:p-3 border-t">
      <h3 className="font-semibold text-gray-900 text-xs md:text-[16px]">{buildingData.facility_name}</h3>
      <p className="text-gray-500 text-[11px] md:text-xs">{buildingData.type}</p>
      <p className="text-gray-500 text-[11px] md:text-xs">{buildingData.district} район, {buildingData.address} </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
          <div className="font-semibold text-blue-800 text-xs md:text-[16px]">{formatAvgPerson(buildingData.death_certificate_count) || "-"}</div>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Кол-во смертности</p>
        </div>
        <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
          <div className="font-semibold text-blue-800 text-xs md:text-[16px]">{formatAvgPerson(buildingData.death_certificate_avg_year) || "-"}</div>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Смертность по годам</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
          <div className="font-semibold text-blue-800 text-xs md:text-[16px]">{buildingData.df_registry_count || "-"}</div>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Кол-во Д-учет</p>
        </div>
        <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
          <div className="font-semibold text-blue-800 text-xs md:text-[16px]">{formatAvgPerson(buildingData.total_population) || "-"}</div>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Население</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
          <div className="font-semibold text-blue-800 text-xs md:text-[16px]">{buildingData.overall_coverage_ratio || "-"}</div>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Покрытие</p>
        </div>
        <div className="text-center rounded-md md:rounded-lg border bg-white shadow-sm md:shadow p-1.5 md:p-2">
          <div className="font-semibold text-blue-800 text-xs md:text-[16px]">{formatAvgPerson(buildingData.visit_avg) || "-"}</div>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">Средняя посещаемость</p>
        </div>
      </div>
    </div>
  )
}