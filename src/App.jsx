import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';

// Component to handle map clicks
function GuessMap({ onGuess }) {
  const [markerPos, setMarkerPos] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPos([lat, lng]);
      onGuess([lat, lng]);
    },
  });

  return markerPos ? <Marker position={markerPos} /> : null;
}

export default function App() {
  // Local image list with actual coordinates
  const imageList = [
    { url: '/images/download.jpg', coords: [40.4231, -86.9215] } // ADD MORE IMAGES + COORDINATES HERE
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [guess, setGuess] = useState(null);
  const [distance, setDistance] = useState(null);

  // Purdue campus bounds
  const campusBounds = [
    [40.4180, -86.9300], // SW //CHANGE THESE BOUNDS TO REFLECT ALL OF PURDUE CAMPUS
    [40.4290, -86.9130], // NE
  ];

  const revealImage = () => {
    const randomIndex = Math.floor(Math.random() * imageList.length);
    setCurrentImageIndex(randomIndex);
    setGuess(null);
    setDistance(null);
  };

  const handleGuess = (clickedCoords) => {
    setGuess(clickedCoords);
    if (currentImageIndex !== null) {
      const actual = imageList[currentImageIndex].coords;
      const from = turf.point([clickedCoords[1], clickedCoords[0]]);
      const to = turf.point([actual[1], actual[0]]);
      const dist = turf.distance(from, to, { units: 'kilometers' });
      setDistance(dist.toFixed(2));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Purdue Campus Guess Game</h1>
      <button onClick={revealImage}>Reveal Image</button>

      {currentImageIndex !== null && (
        <div>
          <br />
          <img
            src={imageList[currentImageIndex].url}
            alt="Guess location"
            style={{ maxWidth: '600px' }}
          />
        </div>
      )}

      <br />
      <MapContainer
        center={[40.4237, -86.9212]}
        zoom={16}
        style={{ height: '500px', width: '100%', marginTop: '20px' }}
        maxBounds={campusBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GuessMap onGuess={handleGuess} />
      </MapContainer>

      {distance && (
        <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          Your guess was {distance} km away from the correct location!
        </div>
      )}
    </div>
  );
}
