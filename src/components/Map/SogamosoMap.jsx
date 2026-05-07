import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sogamoso Coordinates
const CENTER = [5.7144, -72.9333];

// Helper component for Routing
function Routing({ destination }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!destination) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    // Attempt to get user's current location (mocking it slightly near Sogamoso center for demo if geolocation fails)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const start = L.latLng(pos.coords.latitude, pos.coords.longitude);
        const end = L.latLng(destination[0], destination[1]);

        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
        }

        routingControlRef.current = L.Routing.control({
          waypoints: [start, end],
          routeWhileDragging: false,
          addWaypoints: false,
          show: false, // hide the turn-by-turn text by default to keep UI clean
          lineOptions: {
            styles: [{ color: 'var(--purple-600)', weight: 4 }]
          }
        }).addTo(map);
      },
      (err) => {
        console.warn("Geolocation denied or failed.", err);
        // Fallback: start from Sogamoso main square
        const start = L.latLng(5.7144, -72.9333);
        const end = L.latLng(destination[0], destination[1]);

        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
        }
        
        routingControlRef.current = L.Routing.control({
          waypoints: [start, end],
          routeWhileDragging: false,
          show: false,
          lineOptions: {
            styles: [{ color: 'var(--purple-600)', weight: 4 }]
          }
        }).addTo(map);
      }
    );

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, destination]);

  return null;
}

export function SogamosoMap({ donations, onMarkerClick, routeToDonation }) {
  return (
    <div style={{ height: 'var(--map-height)', width: '100%', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
      <MapContainer 
        center={CENTER} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {donations.map((donation) => (
          <Marker 
            key={donation.id} 
            position={donation.coordinates}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(donation)
            }}
          >
            <Popup minWidth={200}>
              {donation.image_url && (
                <div style={{ marginBottom: '8px' }}>
                  <img 
                    src={donation.image_url} 
                    alt="Donación" 
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </div>
              )}
              <strong>{donation.items}</strong><br />
              {donation.address}<br />
              <small>{donation.schedule}</small>
            </Popup>
          </Marker>
        ))}

        {routeToDonation && (
          <Routing destination={routeToDonation.coordinates} />
        )}
      </MapContainer>
    </div>
  );
}
