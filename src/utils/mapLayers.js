import maplibregl from 'maplibre-gl';

export const clearFeatureStates = (map, polygonMapping) => {
  if (!map.getSource('policlinic-polygons')) return;

  Object.values(polygonMapping).flat().forEach((polygonId) => {
    try {
      map.removeFeatureState({
        source: 'policlinic-polygons',
        id: polygonId,
      });
    } catch (err) { /* ignore */ }
  });

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
          0.7,
          0.5,
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
          '#16a34a',
          // ['get', 'color'],
          // 'transparent',
          '#828893',
        ],
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          3,
          1.5,
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
          10,
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
  if (oldMarkerId !== null && oldMarkerId !== undefined) {
    if (map.getSource('policlinic-points')) {
       map.setFeatureState(
         { source: 'policlinic-points', id: oldMarkerId },
         { selected: false }
       );
    }

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

  if (newMarkerId !== null && newMarkerId !== undefined) {
    if (map.getSource('policlinic-points')) {
      map.setFeatureState(
        { source: 'policlinic-points', id: newMarkerId },
        { selected: true }
      );
    }

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