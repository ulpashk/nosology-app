import { useQuery, keepPreviousData } from "@tanstack/react-query";

const API_BASE_URL =
  "https://admin.smartalmaty.kz/api/v1/healthcare/clinic-areas/";

const getDeathCountColor = (value) => {
  if (value > 1700) return "#ef4444";
  if (value < 900) return "#22c55e";
  return "#eab308";
};

export const useHealthcareData = (selectedDistrict, selectedYear) => {
  return useQuery({
    queryKey: ['healthcareData', selectedDistrict, selectedYear],
    
    queryFn: async () => {
      const validDistricts = Array.isArray(selectedDistrict)
        ? selectedDistrict.filter((d) => d !== "Все районы")
        : [];

      const districtQuery =
        validDistricts.length > 0
          ? `district=${encodeURIComponent(validDistricts.join(","))}&`
          : "";

      const yearQuery = selectedYear ? `year=${selectedYear}&` : "";

      const response = await fetch(
        `${API_BASE_URL}?${districtQuery}${yearQuery}limit=1000`
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      const { polygons, points, polygonMapping, stats } = processClinicAreaData(
        data.results
      );

      const statsgeneral = {
        totalCount: data.count,
        totalPopulation: data.total_population,
        avgVisit: data.visit_avg,
        avgPerson: data.per_1_person,
        projectedPopulation: data.population_projected,
        overallCoverage: data.overall_coverage_ratio,
        deathCertificateCount: data.death_certificate_count,
        dfRegistryCount: data.df_registry_count,
        deathCertificateAvgYear: data.death_certificate_avg_year,
      };

      return { polygons, points, polygonMapping, stats, statsgeneral };
    },
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  });
};

const processClinicAreaData = (items) => {
  const polygonFeatures = [];
  const pointFeatures = [];
  const medToIdsGroup = {};

  items.forEach((item) => {
    const polygonFeature = {
      type: "Feature",
      geometry: item.geom, 
      id: item.id,
      properties: {
        id: item.id,
        facility_name: item.facility_name,
        district: item.district,
        terr_id: item.terr_id,
        population: item.total_population,
        visits: item.visit_avg,
        coverage: item.overall_coverage_ratio,
        med: item.med,
        color: '#c8c8c8',
        original_color: '#c8c8c8',
      },
    };
    polygonFeatures.push(polygonFeature);

    const pointFeature = {
      type: "Feature",
      geometry: item.facility_coordinates, 
      id: item.id,
      properties: {
        id: item.id,
        facility_name: item.facility_name,
        district: item.district,
        type: item.facility_type,
        address: item.facility_address,
        med: item.med,

        death_certificate_count: item.death_certificate_count,
        death_certificate_avg_year: item.death_certificate_avg_year,
        df_registry_count: item.df_registry_count,
        
        visit_avg: item.visit_avg,
        per_1_person: item.per_1_person,
        total_population: item.total_population,
        overall_coverage_ratio: item.overall_coverage_ratio,
        color: getDeathCountColor(item.death_certificate_count),
      },
    };
    pointFeatures.push(pointFeature);

    if (item.med !== null && item.med !== undefined) {
      if (!medToIdsGroup[item.med]) {
        medToIdsGroup[item.med] = [];
      }
      medToIdsGroup[item.med].push(item.id);
    }
  });

  const polygonMapping = {};
  
  items.forEach((item) => {
    if (item.med && medToIdsGroup[item.med]) {
      polygonMapping[item.id] = medToIdsGroup[item.med];
    } else {
      polygonMapping[item.id] = [item.id];
    }
  });

  return {
    polygons: {
      type: "FeatureCollection",
      features: polygonFeatures,
    },
    points: {
      type: "FeatureCollection",
      features: pointFeatures,
    },
    polygonMapping,
    stats: {
      totalCount: items.length,
      totalPopulation: items.reduce(
        (sum, i) => sum + Number(i.total_population || 0),
        0
      ),
      avgVisit:
        items.reduce((sum, i) => sum + Number(i.visit_avg || 0), 0) /
        (items.length || 1),
      avgPerson:
        items.reduce((sum, i) => sum + Number(i.per_1_person || 0), 0) /
        (items.length || 1),
    },
  };
};