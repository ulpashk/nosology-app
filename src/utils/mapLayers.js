import maplibregl from 'maplibre-gl';

export const clearFeatureStates = (map, polygonMapping) => {
  if (!map.getSource('policlinic-polygons')) return;

  // Clear Polygons
  Object.values(polygonMapping).flat().forEach((polygonId) => {
    try {
      map.removeFeatureState({
        source: 'policlinic-polygons',
        id: polygonId,
      });
    } catch (err) { /* ignore */ }
  });

  // Clear Points (Iterate keys of mapping which are point IDs)
  Object.keys(polygonMapping).forEach((pointId) => {
    try {
      map.removeFeatureState({
        source: 'policlinic-points',
        id: parseInt(pointId),
      });
    } catch (err) { /* ignore */ }
  });
};

export const setupPolygonLayers = (map, polygons) => {
  if (!polygons || !polygons.features || polygons.features.length === 0) return;

  if (map.getSource('policlinic-polygons')) {
    map.getSource('policlinic-polygons').setData(polygons);
  } else {
    map.addSource('policlinic-polygons', {
      type: 'geojson',
      data: polygons,
    });

    map.addLayer({
      id: 'policlinic-polygons-fill',
      type: 'fill',
      source: 'policlinic-polygons',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#22c55e',
          ['get', 'original_color'],
        ],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          0.6, // Higher opacity when selected
          0.2,
        ],
      },
    });

    map.addLayer({
      id: 'policlinic-polygons-outline',
      type: 'line',
      source: 'policlinic-polygons',
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#16a34a', // Darker green outline
          ['get', 'color'],
        ],
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          3,
          1,
        //   1.5,
        // ],
        // 'line-opacity': [
        //   'case',
        //   ['boolean', ['feature-state', 'selected'], false],
        ],
      },
    });
  }
};

export const setupPointLayers = (map, points) => {
  if (map.getSource('policlinic-points')) {
    map.getSource('policlinic-points').setData(points);
  } else {
    map.addSource('policlinic-points', {
      type: 'geojson',
      data: points,
    });

    map.addLayer({
      id: 'policlinic-points-circle',
      type: 'circle',
      source: 'policlinic-points',
      paint: {
        'circle-radius': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          10, // Bigger when selected
          6,
        ],
        'circle-color': ['get', 'color'],
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
      },
    });
  }
};

export const createPopup = (map, feature, lngLat) => {
  const popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: true,
    className: 'custom-popup',
    maxWidth: '240px',
  })
    .setLngLat(lngLat)
    .setHTML(`
      <div class="p-2 w-[220px]">
        <h3 class="font-semibold text-sm mb-1 text-gray-800">${feature.properties.facility_name || 'Clinic'}</h3>
        <p class="text-xs text-gray-600 mb-1">Med ID: ${feature.properties.med}</p>
        <p class="text-xs text-gray-600 mb-2">${feature.properties.address || ''}</p>
      </div>
    `)
    .addTo(map);

  return popup;
};

export const updateFeatureStates = (
  map,
  oldMarkerId,
  newMarkerId,
  polygonMapping
) => {
  // 1. Deselect Old
  if (oldMarkerId !== null && oldMarkerId !== undefined) {
    // Deselect the point
    if (map.getSource('policlinic-points')) {
       map.setFeatureState(
         { source: 'policlinic-points', id: oldMarkerId },
         { selected: false }
       );
    }

    // Deselect associated polygons
    if (polygonMapping[oldMarkerId]) {
      polygonMapping[oldMarkerId].forEach((polyId) => {
        if (map.getSource('policlinic-polygons')) {
          map.setFeatureState(
            { source: "policlinic-polygons", id: polyId },
            { selected: false }
          );
        }
      });
    }
  }

  // 2. Select New
  if (newMarkerId !== null && newMarkerId !== undefined) {
    // Select the point
    if (map.getSource('policlinic-points')) {
      map.setFeatureState(
        { source: 'policlinic-points', id: newMarkerId },
        { selected: true }
      );
    }

    // Select associated polygons (based on MED grouping done in useHealthcareData)
    if (polygonMapping[newMarkerId]) {
      polygonMapping[newMarkerId].forEach((polyId) => {
        if (map.getSource('policlinic-polygons')) {
          map.setFeatureState(
            { source: "policlinic-polygons", id: polyId },
            { selected: true }
          );
        }
      });
    }
  }
};