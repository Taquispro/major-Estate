/* eslint-disable react/prop-types */
// MapComponent.js
import { useState } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "400px" };
const center = { lat: 19.076, lng: 72.877 }; // Mumbai center

const MapComponent = ({ onLocationSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_CHATBOX,
    libraries,
  });

  const [marker, setMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const onMapClick = async (event) => {
    const newMarker = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setMarker(newMarker);
    await fetchAddress(newMarker, onLocationSelect);
  };

  const onPlaceSelect = async () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newMarker = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarker(newMarker);
        await fetchAddress(newMarker, onLocationSelect);
      }
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div>
      <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceSelect}>
        <input
          type="text"
          placeholder="Search a location"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={marker || center}
        onClick={onMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
};

const fetchAddress = async (location, onLocationSelect) => {
  const { lat, lng } = location;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDIwDj-XvF5wJOsAQ9v5GLuMWQ7pgz9HoE`
  );
  const data = await response.json();
  if (data.results.length > 0) {
    const addressComponents = data.results[0].address_components;
    const locality = addressComponents.find(
      (comp) =>
        comp.types.includes("sublocality_level_1") ||
        comp.types.includes("locality")
    )?.long_name;
    const street = addressComponents.find((comp) =>
      comp.types.includes("route")
    )?.long_name;
    onLocationSelect({
      locality: locality || "Unknown",
      street: street || "Unknown",
      long: location.lng,
      lat: location.lat,
    });
  }
};

export default MapComponent;
