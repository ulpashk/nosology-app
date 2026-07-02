import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

const DEFAULT_CENTER = [76.886, 43.238];
const DEFAULT_ZOOM = 11;
const API_KEY = '9zZ4lJvufSPFPoOGi6yZ';
 
export const useMapInitialization = (containerRef) => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
 
    setIsLoading(true);

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
      maxZoom: 18,
      minZoom: 9,
    });

    mapRef.current.on('load', () => {
      setIsLoading(false);

      const geojsonData = `${process.env.PUBLIC_URL}/data/almaty_districts.json`;

      mapRef.current.addSource("almaty-districts", {
        type: "geojson",
        data: geojsonData,
      });

      mapRef.current.addLayer({
        id: "district-outline",
        type: "line",
        source: "almaty-districts",
        paint: {
          // "line-color": "#166534",
          "line-color": "rgb(67, 119, 188)",
          "line-width": 0.5
        }
      });

    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [containerRef]);

  const zoomIn = () => mapRef.current?.zoomIn({ duration: 300 });
  const zoomOut = () => mapRef.current?.zoomOut({ duration: 300 });
  const resetView = () => {
    mapRef.current?.flyTo({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      duration: 1000,
    });
  };

  const highlightDistrict = (districtNames) => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // If input is empty → show everything
    if (!districtNames || districtNames.length === 0) {
      map.setFilter("district-outline", null);
      return;
    }

    // Ensure we always work with an array
    const names = Array.isArray(districtNames)
      ? districtNames
      : [districtNames];

    // Build OR filter for MULTIPLE districts
    const filters = ["any"];

    names.forEach((d) => {
      filters.push(["==", ["get", "name"], d]);
      filters.push(["==", ["get", "nameRu"], d]);
    });

    map.setFilter("district-outline", filters);
  };


  return { mapRef, isLoading, zoomIn, zoomOut, resetView, highlightDistrict };
};
