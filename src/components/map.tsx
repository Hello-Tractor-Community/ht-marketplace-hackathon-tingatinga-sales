"use client";
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Approximate coordinates for Kenyan cities
const cityCoordinates: { [key: string]: [number, number] } = {
  'Nairobi': [-1.2921, 36.8219],
  'Nakuru': [-0.3031, 36.0800],
  'Nanyuki': [0.0167, 37.0833],
  'Eldoret': [0.5143, 35.2698],
  'Kisumu': [-0.0917, 34.7680],
  'Mombasa': [-4.0435, 39.6682],
  'Narok': [-1.0833, 35.8667],
  'Kericho': [-0.3689, 35.2863],
  'Bungoma': [0.5635, 34.5606]
};

interface DealerLocation {
  city: string;
  address: string;
  phones: string[];
  brand: string;
  company: string;
}

interface MapProps {
  dealers: DealerLocation[];
  selectedDealer?: DealerLocation | null;
  height?: string;
  onMarkerClick?: (dealer: DealerLocation) => void;
}

const getBrandColor = (brand: string): string => {
  switch (brand) {
    case 'New Holland':
      return '#0000ff';
    case 'John Deere':
      return '#367c2b';
    case 'Case HI':
      return '#8b008b';
    case 'FMD':
      return '#ff69b4';
    default:
      return '#808080';
  }
};

// Create marker icons factory
const createMarkerIcon = (isSelected: boolean, brand: string) => {
  const size: [number, number] = isSelected ? [35, 56] : [25, 41];
  const anchor: [number, number] = isSelected ? [17, 56] : [12, 41];
  
  return new L.Icon({
    iconUrl: isSelected ? '/marker-icon-selected.png' : '/marker-icon.png',
    iconRetinaUrl: isSelected ? '/marker-icon-selected-2x.png' : '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
    className: `dealer-marker ${isSelected ? 'selected' : ''}`
  });
};

const Map: React.FC<MapProps> = ({ 
  dealers, 
  selectedDealer, 
  height = '400px',
  onMarkerClick 
}) => {
  // Find center of Kenya for initial map view
  const kenyaCenter: [number, number] = [-0.0236, 37.9062];
  
  // Create ref for the map instance
  const mapRef = React.useRef<L.Map>(null);

  // Pan to selected dealer when it changes
  React.useEffect(() => {
    if (selectedDealer && mapRef.current) {
      const coords = cityCoordinates[selectedDealer.city];
      if (coords) {
        mapRef.current.setView(coords, 12, {
          animate: true,
          duration: 1
        });
      }
    }
  }, [selectedDealer]);

  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer
        center={kenyaCenter}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {dealers.map((dealer, index) => {
          const coords = cityCoordinates[dealer.city];
          if (!coords) return null;

          const isSelected = selectedDealer?.city === dealer.city && 
                           selectedDealer?.company === dealer.company;

          const markerIcon = createMarkerIcon(isSelected, dealer.brand);

          return (
            <Marker
              key={`${dealer.city}-${dealer.company}-${index}`}
              position={coords}
              icon={markerIcon}
              eventHandlers={{
                click: () => onMarkerClick?.(dealer)
              }}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ 
                    margin: '0 0 5px 0', 
                    color: getBrandColor(dealer.brand),
                    fontWeight: isSelected ? 'bold' : 'normal'
                  }}>
                    {dealer.company} - {dealer.brand}
                    {isSelected && <span style={{ 
                      marginLeft: '5px', 
                      fontSize: '0.8em',
                      backgroundColor: '#ffeb3b',
                      padding: '2px 5px',
                      borderRadius: '3px'
                    }}>
                      Selected
                    </span>}
                  </h4>
                  <p style={{ margin: '5px 0' }}><strong>{dealer.city}</strong></p>
                  {dealer.address && (
                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}>{dealer.address}</p>
                  )}
                  <div style={{ margin: '5px 0', fontSize: '0.9em' }}>
                    {dealer.phones.map((phone, i) => (
                      <div key={i}>📞 {phone}</div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;