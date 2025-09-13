import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, useMapEvents } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';

// Component to handle map clicks
function GuessMap({ onGuess, markerPos }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onGuess([lat, lng]);
    },
  });

  return markerPos ? <Marker position={markerPos} /> : null;
}

export default function App() {
  const imageList = [
    { url: '/images/download.jpg', coords: [40.4231, -86.9215] },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [guess, setGuess] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const campusBounds = [
    [40.418, -86.930], // SW
    [40.429, -86.913], // NE
  ];

  const revealImage = () => {
    const randomIndex = Math.floor(Math.random() * imageList.length);
    setCurrentImageIndex(randomIndex);
    setGuess(null);
    setDistance(null);
    setShowAnswer(false);
  };

  // Calculate distance on every click
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

  const handleRevealAnswer = () => {
    if (!guess || currentImageIndex === null) return;
    setShowAnswer(true);
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Purdue Campus Guess Game
      </h1>

      {/* Buttons */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={revealImage}
          style={{
            padding: '10px 20px',
            margin: '5px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Reveal Image
        </button>
        {guess && !showAnswer && (
          <button
            onClick={handleRevealAnswer}
            style={{
              padding: '10px 20px',
              margin: '5px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#f44336',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Reveal Answer
          </button>
        )}
      </div>

      {/* Main layout: left = image+map, right = distance */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center', // center the layout
          gap: '40px', // space between left and right
        }}
      >
        {/* Left column */}
        <div style={{ flex: '0 0 600px', maxWidth: '600px' }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '20px',
            }}
          >
            {currentImageIndex !== null && (
              <div>
                <img
                  src={imageList[currentImageIndex].url}
                  alt="Guess location"
                  style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
              <MapContainer
                center={[40.4237, -86.9212]}
                zoom={16}
                style={{ width: '100%', height: '100%' }}
                maxBounds={campusBounds}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <GuessMap onGuess={handleGuess} markerPos={guess} />
                {showAnswer && currentImageIndex !== null && (
                  <>
                    <CircleMarker
                      center={imageList[currentImageIndex].coords}
                      radius={10}
                      pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.8 }}
                    />
                    <Polyline
                      positions={[guess, imageList[currentImageIndex].coords]}
                      color="red"
                    />
                  </>
                )}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div
          style={{
            flex: '0 0 250px',
            minWidth: '200px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#555',
            minHeight: '500px', // match map height
          }}
        >
          {distance ? `Distance from actual location: ${distance} km` : 'Click on the map to guess!'}
        </div>
      </div>
    </div>
  );
}
