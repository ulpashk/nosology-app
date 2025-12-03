"use client";

import { useEffect, useRef } from 'react';
import { useMapInitialization } from '../../hooks/useMapInitialization';
import { useHealthcareData } from '../../hooks/useHealthcareData';
import { MapControls } from '../comps/MapControls';
import { MapLegend } from '../comps/MapLegend';
import { LoadingOverlay } from '../comps/LoadingOverlay';
import {
  clearFeatureStates,
  setupPolygonLayers,
  setupPointLayers,
  createPopup,
  updateFeatureStates,
} from '../../utils/mapLayers';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapView({
  setBuildingData,
  setShowDetailCard,
  selectedDistrict,
  // 1. Receive selectedYear prop
  selectedYear, 
  setTotalCount,
  setTotalPopulation,
  setAvgVisit,
  setAvgPerson,
  setGeneralStats,
}) {
  const mapContainer = useRef(null);
  const { mapRef, isLoading: mapLoading, zoomIn, zoomOut, resetView, highlightDistrict} = useMapInitialization(mapContainer);
  const { fetchHealthcareData, isLoading: dataLoading } = useHealthcareData();

  const selectedMarkerRef = useRef(null); 
  const polygonMappingRef = useRef({});
  const popupRef = useRef(null);

  const isLoading = mapLoading || dataLoading;

  // Fetch and render data when district OR year changes
  useEffect(() => {
    if (!mapRef.current) return;

    const fetchAndRender = async () => {
      // Reset selection when changing filters
      selectedMarkerRef.current = null;
      // Optional: Close detail card when filter changes
      setShowDetailCard(false); 

      try {
        // 2. Pass selectedYear to the fetch function
        const data = await fetchHealthcareData(selectedDistrict, selectedYear);

        // Update stats
        setTotalCount(data.stats.totalCount);
        setTotalPopulation(data.stats.totalPopulation);
        setAvgVisit(data.stats.avgVisit);
        setAvgPerson(data.stats.avgPerson);
        setGeneralStats(data.statsgeneral);

        const addOrUpdateLayers = () => {
          const map = mapRef.current;

          const oldPolygonMapping = { ...polygonMappingRef.current };
          polygonMappingRef.current = data.polygonMapping;

          clearFeatureStates(map, oldPolygonMapping);

          setupPolygonLayers(map, data.polygons);
          setupPointLayers(map, data.points);

          // Click handler
          const handlePointClick = (e) => {
            const feature = e.features?.[0];
            if (!feature) return;

            if (popupRef.current) {
              popupRef.current.remove();
            }

            popupRef.current = createPopup(map, feature, e.lngLat);

            popupRef.current.on("close", () => {
              setShowDetailCard(false);
            });

            const newMarkerId = feature.properties.id;

            updateFeatureStates(
              map,
              selectedMarkerRef.current,
              newMarkerId,
              polygonMappingRef.current
            );

            selectedMarkerRef.current = newMarkerId;
 
            setBuildingData(feature.properties);
            setShowDetailCard(true);

            map.flyTo({
              center: feature.geometry.coordinates,
              zoom: Math.max(map.getZoom(), 13),
              duration: 1000,
            });
          };

          const handleMouseEnter = () => {
            map.getCanvas().style.cursor = 'pointer';
          };

          const handleMouseLeave = () => {
            map.getCanvas().style.cursor = '';
          };

          map.off('click', 'policlinic-points-circle', handlePointClick);
          map.off('mouseenter', 'policlinic-points-circle', handleMouseEnter);
          map.off('mouseleave', 'policlinic-points-circle', handleMouseLeave);

          map.on('click', 'policlinic-points-circle', handlePointClick);
          map.on('mouseenter', 'policlinic-points-circle', handleMouseEnter);
          map.on('mouseleave', 'policlinic-points-circle', handleMouseLeave);
        };

        if (!mapRef.current.isStyleLoaded()) {
          mapRef.current.once('load', addOrUpdateLayers);
        } else {
          addOrUpdateLayers();
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchAndRender();
    
    // 3. Add selectedYear to dependency array so it refetches when year changes
  }, [selectedDistrict, selectedYear, fetchHealthcareData, setBuildingData, setShowDetailCard, setTotalCount, setTotalPopulation, setAvgVisit, setAvgPerson, setGeneralStats, mapRef]);


  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const validDistricts = selectedDistrict
      .filter(d => d !== "Все районы")
      .map(d => `${d} район`);

    const selectedDistrictFull =
      validDistricts.length > 0 ? validDistricts : [];

    if (!map.isStyleLoaded()) {
      map.once("load", () => highlightDistrict(selectedDistrictFull));
    } else {
      highlightDistrict(selectedDistrictFull);
    }
  }, [selectedDistrict, mapRef, highlightDistrict]);


  return (
    <div className="relative w-full h-full">
      <MapControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
      />

      <div
        className="w-full h-full"
        ref={mapContainer}
      />

      <MapLegend />

      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
}