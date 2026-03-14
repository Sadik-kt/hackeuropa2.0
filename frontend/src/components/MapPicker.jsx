import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition, setAddress }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      reverseGeocode(lat, lng, setAddress);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

async function reverseGeocode(lat, lng, setAddress) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    if (data && data.display_name) {
      setAddress(data.display_name);
    }
  } catch (error) {
    console.error("Geocoding failed", error);
  }
}

export default function MapPicker({ onLocationSelect, initialAddress }) {
  const [position, setPosition] = useState([9.9312, 76.2673]); // Kochi default
  const [address, setAddress] = useState(initialAddress || '');

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          reverseGeocode(latitude, longitude, (addr) => {
            setAddress(addr);
            onLocationSelect(addr);
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Could not get your location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input 
          className="form-input" 
          placeholder="Location (pick on map or type...)" 
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onLocationSelect(e.target.value);
          }}
        />
        <button 
          type="button"
          onClick={handleGetCurrentLocation}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-accent)',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          title="Use my current location"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-glass)'}
        >
          📍
        </button>
      </div>

      <div style={{ height: 260, position: 'relative', overflow: 'hidden', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            setPosition={setPosition} 
            setAddress={(addr) => {
              setAddress(addr);
              onLocationSelect(addr);
            }} 
          />
        </MapContainer>
        
        {/* Map Overlay Shadow */}
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)', pointerEvents: 'none', zIndex: 1000 }} />
      </div>
      
      <p style={{ fontSize: 11, color: 'var(--text-muted)', italic: true }}>
        Tip: Click on the map to pin a precise location. Identity remains anonymous.
      </p>
    </div>
  );
}
