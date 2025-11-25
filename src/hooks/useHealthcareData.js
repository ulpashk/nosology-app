import { useState, useCallback } from 'react';

const API_BASE_URL =
  'https://admin.smartalmaty.kz/api/v1/healthcare/medical-facilities/';

export const useHealthcareData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHealthcareData = useCallback(async (selectedDistrict) => {
    setIsLoading(true);
    setError(null);

    const districtFilter =
      selectedDistrict && selectedDistrict !== 'Все районы'
        ? `district=${encodeURIComponent(`${selectedDistrict} район`)}&`
        : '';

    try {
      const response = await fetch(`${API_BASE_URL}?${districtFilter}limit=1000`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (!data?.results?.features) {
        throw new Error('Invalid API format: no features array');
      }

      const processed = processHealthcareData(data.results);

      return {
        points: processed, // FeatureCollection
        stats: {
          totalCount: data.count,
        },
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchHealthcareData, isLoading, error };
};

const processHealthcareData = (geojson) => {
  const cleanedFeatures = geojson.features.map((f) => ({
    ...f,
    properties: {
      id: f.id,
      name: f.properties.medical_organization_name,
      type: f.properties.type,
      address: f.properties.address,
      district: f.properties.district,
      color: "#22c55e"
    },
  }));

  return {
    type: 'FeatureCollection',
    features: cleanedFeatures,
  };
};
