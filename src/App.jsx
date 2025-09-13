import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import * as turf from "@turf/turf";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ---- Leaflet marker icon fix (Vite/webpack bundlers) ----
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ---- Small badge for env ribbon (top-right) ----
function Badge({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        right: 8,
        zIndex: 9999,
        borderRadius: 6,
        padding: "6px 10px",
        fontSize: 12,
        fontWeight: 700,
        background: "rgba(252,211,77,0.9)", // yellow-ish
        color: "#000",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      {children}
    </div>
  );
}

// ---- Component to handle map clicks & place guess marker ----
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
  // In Vite, only VITE_* vars are exposed client-side. MODE helps local dev show 'development'.
  const env =
    import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE ?? "production";

  // Place images under /public/photos/... and reference with absolute paths:
  const imageList = [
    { url: "/NewPurdueArch.jpg", coords: [40.4311, -86.9164] },
    { url: "/EngineeringFountain.jpg", coords: [40.42864, -86.91379] }, // note spelling corrected
    // Add more: { url: "/photos/SomePlace.jpg", coords: [lat, lng] },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [guess, setGuess] = useState(null); // [lat, lng]
  const [distanceKm, setDistanceKm] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Campus bounds (SW, NE) to keep users roughly on campus
  const campusBounds = [
    [40.4040, -86.9600], // SW
    [40.4645, -86.8850], // NE
  ];

  const revealImage = () => {
    const randomIndex = Math.floor(Math.random() * imageList.length);
    setCurrentImageIndex(randomIndex);
    setGuess(null);
    setDistanceKm(null);
    setShowAnswer(false);
  };

  const handleGuess = (clicked) => {
    setGuess(clicked);
    if (currentImageIndex !== null) {
      const actual = imageList[currentImageIndex].coords; // [lat, lng]
      // Turf expects [lng, lat]
      const from = turf.point([clicked[1], clicked[0]]);
      const to = turf.point([actual[1], actual[0]]);
      const dist = turf.distance(from, to, { units: "kilometers" });
      setDistanceKm(Number(dist.toFixed(3))); // keep 3 decimals
    }
  };

  const handleRevealAnswer = () => {
    if (!guess || currentImageIndex === null) return;
    setShowAnswer(true);
  };

  const getDistanceColor = (km) => {
    if (km == null) return "#9ca3af"; // gray
    if (km < 0.2) return "#4CAF50"; // green
    if (km < 0.5) return "#FFC107"; // amber
    return "#F44336"; // red
  };

  const currentActual = currentImageIndex !== null ? imageList[currentImageIndex].coords : null;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: "#f0f2f5",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Show badge only for testing/preview (hide on production). Add 'development' if you want it locally. */}
      {["testing", "preview"].includes(env) && <Badge>{env.toUpperCase()}</Badge>}

      <h1 style={{ textAlign: "center", margin: "16px 0 8px", color: "#333" }}>
        Purdue Campus Guess Game
      </h1>

      {/* Controls */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <button
          onClick={revealImage}
          style={{
            padding: "10px 20px",
            margin: "5px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Reveal Image
        </button>

        {guess && !showAnswer && (
          <button
            onClick={handleRevealAnswer}
            style={{
              padding: "10px 20px",
              margin: "5px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#f44336",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Reveal Answer
          </button>
        )}
      </div>

      {/* Main content: responsive 2-column that wraps on narrow screens */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          padding: "16px",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        {/* Left: map + distance */}
        <div
          style={{
            flex: "2 1 520px", // grow/shrink, wrap breakpoint
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Map */}
          <div
            style={{
              flex: 1,
              minHeight: 360, // gives the map some height on small screens
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <MapContainer
              center={[40.4237, -86.9212]}
              zoom={16}
              style={{ width: "100%", height: "100%" }}
              maxBounds={campusBounds}
              maxBoundsViscosity={1.0}
              scrollWheelZoom
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <GuessMap onGuess={handleGuess} markerPos={guess} />

              {showAnswer && currentActual && guess && (
                <>
                  <CircleMarker
                    center={currentActual}
                    radius={10}
                    pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.8 }}
                  />
                  <Polyline
                    positions={[guess, currentActual]}
                    pathOptions={{ color: "red", weight: 3 }}
                  />
                </>
              )}
            </MapContainer>
          </div>

          {/* Distance box */}
          <div
            style={{
              backgroundColor: getDistanceColor(distanceKm),
              borderRadius: "10px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: "bold",
              color: "#fff",
              minHeight: 72,
              transition: "background-color 0.2s ease",
              textAlign: "center",
            }}
          >
            {distanceKm != null
              ? `Distance from actual location: ${distanceKm} km`
              : "Click anywhere on the map to place your guess!"}
          </div>
        </div>

        {/* Right: current image */}
        <div
          style={{
            flex: "1 1 300px",
            minWidth: 0,
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {currentImageIndex !== null ? (
            <img
              src={imageList[currentImageIndex].url}
              alt="Guess location"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "white",
                minHeight: 360,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                minHeight: 360,
                borderRadius: "8px",
                background: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555",
                padding: 24,
                textAlign: "center",
              }}
            >
              Click “Reveal Image” to start a round.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
