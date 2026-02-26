import { useEffect, useState } from "react";
import MapFilterIndicators from "./MapFilterIndicator";
import DetailedInfo from "./DetailedInfo";

export default function MapFilter({
  setSelectedDistrict,
  setDistrictDropdownOpen,
  districtDropdownOpen,
  selectedDistrict,
  buildingData,
  generalStats,
  selectedYear,
  setSelectedYear,
}) {
  const [filtersHidden, setFiltersHidden] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const allDistricts = [
    "Все районы",
    "Алатауский",
    "Алмалинский",
    "Ауэзовский",
    "Бостандыкский",
    "Жетысуский",
    "Медеуский",
    "Наурызбайский",
    "Турксибский",
  ];

  const years = [2021, 2022, 2023, 2024, 2025];

  useEffect(() => {
    if (!selectedDistrict || selectedDistrict.length === 0) {
      setSelectedDistrict(["Все районы"]);
    }
  }, [selectedDistrict, setSelectedDistrict]);

  const handleDistrictChange = (city) => {
    if (city === "Все районы") {
      setSelectedDistrict(["Все районы"]);
    } else {
      setSelectedDistrict((prev) => {
        let updated = prev.includes(city)
          ? prev.filter((c) => c !== city)
          : [...prev.filter((c) => c !== "Все районы"), city];

        return updated.length === 0 ? ["Все районы"] : updated;
      });
    }
  };

  const handleYearChange = (year) => {
    if (selectedYear === year) {
      setSelectedYear(null); 
    } else {
      setSelectedYear(year);
    }
    setYearDropdownOpen(false);
  };

  const labelWithArrow = (children) => (
    <span className="flex items-center space-x-1">
      <span className="text-gray-400">|</span>
      <span>{children}</span>
    </span>
  );

  return (
    <>
      <div className="flex flex-col max-h-[80vh] bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl border shadow-md md:shadow-lg overflow-hidden text-xs md:text-sm">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between px-2 md:px-4 pt-2 md:pt-3 pb-2 font-semibold text-sm sm:text-base md:text-base">
            <span>Фильтры</span>

            <button
              onClick={() => setFiltersHidden(!filtersHidden)}
              className="text-gray-600 hover:text-gray-900 transition-transform"
              title={filtersHidden ? "Показать фильтры" : "Скрыть фильтры"}
            >
              <svg
                className={`w-4 h-4 transform transition-transform duration-300 ${
                  filtersHidden ? "" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <div className="px-2 md:px-4 pb-2 md:pb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="relative">
              <div
                onClick={() => setDistrictDropdownOpen(!districtDropdownOpen)}
                className="flex text-left justify-between px-2 md:px-3 py-1.5 md:py-2 border rounded-md text-xs md:text-sm cursor-pointer"
              >
                <span className="flex-1 truncate">
                  {selectedDistrict.length > 0
                    ? selectedDistrict.join(", ")
                    : "Выберите район"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    districtDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {districtDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-30 max-h-44 overflow-y-auto">
                  <div className="p-1.5 md:p-2 space-y-1 text-xs">
                    {/* Все районы */}
                    <div
                      onClick={() => handleDistrictChange("Все районы")}
                      className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded hover:bg-gray-50 ${
                        selectedDistrict.includes("Все районы")
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }`}
                    >
                      <span>Все районы</span>

                      {selectedDistrict.includes("Все районы") && (
                        <svg
                          className="w-3 h-3 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="border-b my-1"></div>

                    {/* Остальные районы */}
                    {allDistricts
                      .filter((district) => district !== "Все районы")
                      .map((district) => {
                        const isSelected = selectedDistrict.includes(district);

                        return (
                          <div
                            key={district}
                            onClick={() => handleDistrictChange(district)}
                            className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded hover:bg-gray-50 transition ${
                              isSelected ? "bg-blue-50 text-blue-600 font-medium" : ""
                            }`}
                          >
                            <span>{district}</span>

                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div
                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                className="flex text-left justify-between px-2 md:px-3 py-1.5 md:py-2 border rounded-md text-xs md:text-sm cursor-pointer"
              >
                <span className="flex-1 truncate">
                  {selectedYear ? `${selectedYear} год` : "Все годы"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    yearDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {yearDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-30 max-h-44 overflow-y-auto">
                  <div className="p-1.5 md:p-2 space-y-1 text-xs">
                    <div
                      onClick={() => handleYearChange(null)}
                      className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded hover:bg-gray-50 ${
                        !selectedYear ? "bg-blue-50 text-blue-600 font-medium" : ""
                      }`}
                    >
                      <span>Все годы</span>
                      {!selectedYear && (
                        <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="border-b my-1"></div>

                    {years.map((year) => (
                      <div
                        key={year}
                        onClick={() => handleYearChange(year)}
                        className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded hover:bg-gray-50 ${
                          selectedYear === year ? "bg-blue-50 text-blue-600 font-medium" : ""
                        }`}
                      >
                        <span>{year} год</span>
                        {selectedYear === year && (
                          <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            filtersHidden
              ? "max-h-0 opacity-0 overflow-hidden"
              : "max-h-[600px] opacity-100 overflow-y-auto"
          }`}
        >
          <MapFilterIndicators
            generalStats={generalStats}
            selectedDistrict={selectedDistrict}
          />
          {buildingData?.id && <DetailedInfo buildingData={buildingData} />}
        </div>
      </div>
    </>
  );
}