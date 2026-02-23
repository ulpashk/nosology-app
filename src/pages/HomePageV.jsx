"use client"

import { useState } from "react"
import Map from "../components/HomePage/MapV"
import MapFilter from "../components/HomePage/MapFilter"

export default function HomePage() {
  const [buildingData, setBuildingData] = useState([])
  const [showDetailCard, setShowDetailCard] = useState(true)
  const [selectedDistrict, setSelectedDistrict] = useState(["Все районы"])
  const [selectedYear, setSelectedYear] = useState(null)
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false)
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false)
  const [generalStats, setGeneralStats] = useState({})

  const handleBackdropClick = () => {
    if (showDetailCard && buildingData?.id && window.innerWidth < 768) {
      setShowDetailCard(false)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {showDetailCard && buildingData?.id && (
        <div
          className="md:hidden absolute inset-0 bg-black/20 z-20 transition-opacity duration-300"
          onClick={handleBackdropClick}
        />
      )}

      <div className="h-full w-full">
        <Map
          setBuildingData={setBuildingData}
          setShowDetailCard={setShowDetailCard}
          showDetailCard={showDetailCard}
          selectedDistrict={selectedDistrict}
          setGeneralStats={setGeneralStats}
          selectedYear={selectedYear}
        />
      </div>

      <div className="absolute top-[40px] left-4 z-20 w-44 sm:w-64 md:w-80">
          <MapFilter
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            districtDropdownOpen={districtDropdownOpen}
            setDistrictDropdownOpen={setDistrictDropdownOpen}
            buildingData={buildingData}
            generalStats={generalStats}
            yearDropdownOpen={yearDropdownOpen}
            setYearDropdownOpen={setYearDropdownOpen}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
      </div>
    </div>
  )
}
