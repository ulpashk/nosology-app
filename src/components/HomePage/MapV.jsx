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
  selectedYear,
  setGeneralStats,
}) {
  const mapContainer = useRef(null);
  const { mapRef, isLoading: mapLoading, zoomIn, zoomOut, resetView, highlightDistrict} = useMapInitialization(mapContainer);
  const { data: healthData, isFetching } = useHealthcareData(selectedDistrict, selectedYear);

  const selectedMarkerRef = useRef(null); 
  const polygonMappingRef = useRef({});
  const popupRef = useRef(null);
  const isLoading = mapLoading || isFetching;

  useEffect(() => {
    if (healthData && healthData.statsgeneral) {
      setGeneralStats(healthData.statsgeneral);
    }
  }, [healthData, setGeneralStats]);

  useEffect(() => {
    if (!mapRef.current || !healthData) return;

    const renderLayers = () => {
      selectedMarkerRef.current = null;
      setShowDetailCard(false); 

      const map = mapRef.current;
      
      const oldPolygonMapping = { ...polygonMappingRef.current };
      polygonMappingRef.current = healthData.polygonMapping;

      clearFeatureStates(map, oldPolygonMapping);

      setupPolygonLayers(map, healthData.polygons);
      setupPointLayers(map, healthData.points);

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
      mapRef.current.once('load', renderLayers);
    } else {
      renderLayers();
    }
    
  }, [healthData, mapRef, setBuildingData, setShowDetailCard]);

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