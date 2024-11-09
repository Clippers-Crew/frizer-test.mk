import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Salon } from '../../../interfaces/Salon.interface';

interface SalonMapProps {
    salon?: Salon;
}

const SalonMap: React.FC<SalonMapProps> = ({ salon }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize the map when the component mounts
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [41.6086, 21.7453],
        zoom: 9,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(mapInstanceRef.current);

      addMarkerForUserLocation();
    } else {
      // Update the map markers when the salon prop changes
      updateMap();
    }
  }, [salon]);

  const updateMap = () => {
    if (mapInstanceRef.current) {
      // Remove existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });

      // Add new markers
      addMarkerForUserLocation();
      addMarkersForCenter();
    }
  };

  const createPopup = (id: number, name: string) => {
    const popupContent = `
      <div style="text-align: center;">
        <b>${name}</b></br>
      </div>
    `;
    return L.popup().setContent(popupContent);
  };

  const addMarkersForCenter = () => {
    if (mapInstanceRef.current && salon) {
        const blueIcon = new L.Icon({
            iconUrl:
              'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
          
      const marker = L.marker([salon.latitude, salon.longitude], {
        icon: blueIcon,
      }).addTo(mapInstanceRef.current);

      marker.bindPopup(createPopup(salon.id, salon.name));
    }
  };

  const addMarkerForUserLocation = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const greenIcon = new L.Icon({
            iconUrl:
              'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl:
              'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          const userMarker = L.marker([latitude, longitude], {
            icon: greenIcon,
          }).addTo(mapInstanceRef.current!);
          const userRadius = L.circle([latitude, longitude], {
            radius: 500,
            color: 'green',
          }).addTo(mapInstanceRef.current!);

          userMarker.bindPopup('Your location').openPopup();
          userRadius.bindPopup('Your radius');
        },
        (error) => {
          console.error('Error retrieving user location:', error);
        },
        { timeout: 10000 }
      );
    }
  };

  return <div id="map" ref={mapRef} style={{ marginTop: '3em', width: '100%', height: '70vh', borderRadius: 'var(--border-radius)', zIndex: 0 }}></div>;
};

export default SalonMap;
