"use client";

import { MapPin } from "lucide-react";

export default function DetailedInfo({buildingData}){
  const formatAvgPerson = (value) => {
    if (value == null) return "—";
    const rounded = Math.ceil(value * 100) / 100;
    return rounded.toLocaleString("en-US").replace(/,/g, " ");
  };

    return (
        <div className="space-y-2 text-xs bg-white/95 p-3 border-t">
          <h3 className="font-semibold text-gray-900">{buildingData.facility_name}</h3>
          <p className="text-gray-500">{buildingData.type}</p>
          <p className="text-gray-500">{buildingData.district} район, {buildingData.address} </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-center rounded-lg border bg-white shadow p-2">
              <div className="font-semibold text-blue-800 text-blue-800">{formatAvgPerson(buildingData.death_certificate_count) || "-"}</div>
              <p className="text-xs text-gray-500">Кол-во смертности</p>
            </div>
            <div className="text-center rounded-lg border bg-white shadow p-2">
              <div className="font-semibold text-blue-800">{formatAvgPerson(buildingData.death_certificate_avg_year) || "-"}</div>
              <p className="text-xs text-gray-500">Смертность по годам</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-center rounded-lg border bg-white shadow p-2">
              <div className="font-semibold text-blue-800">{buildingData.df_registry_count || "-"}</div>
              <p className="text-xs text-gray-500">Кол-во Д-учет</p>
            </div>
            <div className="text-center rounded-lg border bg-white shadow p-2">
              <div className="font-semibold text-blue-800">{formatAvgPerson(buildingData.total_population) || "-"}</div>
              <p className="text-xs text-gray-500">Население</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center rounded-lg border bg-white shadow p-2">
              <div className="font-semibold text-blue-800">{buildingData.overall_coverage_ratio || "-"}</div>
              <p className="text-xs text-gray-500">Покрытие</p>
            </div>
            <div className="text-center rounded-lg border bg-white shadow p-2">
              <div className="font-semibold text-blue-800">{formatAvgPerson(buildingData.visit_avg) || "-"}</div>
              <p className="text-xs text-gray-500">Средняя посещаемость</p>
            </div>
          </div>
        </div>
    )
}