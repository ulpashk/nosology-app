"use client"

import { useState } from "react"
import Map from "../components/HomePage/MapV"
// import DetailCard from "../components/HomePage/DetailCardV"
import Indicators from "../components/HomePage/IndicatorsV"
import MapFilter from "../components/HomePage/MapFilter"

export default function HomePage() {
  const [buildingData, setBuildingData] = useState([])
  const [showDetailCard, setShowDetailCard] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPopulation, setTotalPopulation] = useState(0)
  const [avgVisit, setAvgVisit] = useState(0)
  const [avgPerson, setAvgPerson] = useState(0)
  const [selectedDistrict, setSelectedDistrict] = useState(["Все районы"])
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false)
  const [enginNodes, setEnginNodes] = useState({
    "Родильные дома": false,
    "Поликлиники": false,
    "Больницы": false,
  })

  // Handle click outside sidebar to close (mobile only)
  const handleBackdropClick = () => {
    if (showDetailCard && buildingData?.id && window.innerWidth < 768) {
      setShowDetailCard(false)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Backdrop overlay - click to close (mobile only) */}
      {showDetailCard && buildingData?.id && (
        <div
          className="md:hidden absolute inset-0 bg-black/20 z-20 transition-opacity duration-300"
          onClick={handleBackdropClick}
        />
      )}

      {/* Map - Full screen */}
      <div className="h-full w-full">
        <Map
          setBuildingData={setBuildingData}
          setShowDetailCard={setShowDetailCard}
          showDetailCard={showDetailCard}
          selectedDistrict={selectedDistrict}
          setTotalCount={setTotalCount}
          setTotalPopulation={setTotalPopulation}
          setAvgVisit={setAvgVisit}
          setAvgPerson={setAvgPerson}
        />
      </div>

      <div className="absolute top-[40px] left-4 z-20 w-80">
          <MapFilter
            enginNodes={enginNodes} 
            setEnginNodes={setEnginNodes}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            districtDropdownOpen={districtDropdownOpen}
            setDistrictDropdownOpen={setDistrictDropdownOpen}
            buildingData={buildingData}
          />
      </div>
    </div>
  )
}
