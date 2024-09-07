import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const center = { lat: -34.397, lng: 150.644 };

const GoogleMapPicker = ({ location, onLocationSelect }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
    libraries,
  });

  const onMapClick = useCallback((event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    onLocationSelect(newLocation);
  }, [onLocationSelect]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={location || center}
      onClick={onMapClick}
    >
      {location && (
        <Marker
          position={location}
        />
      )}
    </GoogleMap>
  );
};

export default GoogleMapPicker;
