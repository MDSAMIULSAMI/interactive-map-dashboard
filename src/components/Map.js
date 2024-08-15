import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const MapComponent = ({ setAddressData }) => {
    const mapRef = useRef(null); // Reference for the map container
    const mapInstance = useRef(null); // Reference for the Leaflet map instance

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            // Initialize the map only if it hasn't been initialized yet
            mapInstance.current = L.map(mapRef.current).setView([51.505, -0.09], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance.current);

            const drawnItems = new L.FeatureGroup();
            mapInstance.current.addLayer(drawnItems);

            const drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: drawnItems
                },
                draw: {
                    polygon: false,
                    marker: false,
                    polyline: false,
                    circlemarker: false
                }
            });
            mapInstance.current.addControl(drawControl);

            mapInstance.current.on(L.Draw.Event.CREATED, function (event) {
                const layer = event.layer;
                drawnItems.addLayer(layer);

                const bounds = layer.getBounds();
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();

                fetchAddresses(ne.lat, ne.lng, sw.lat, sw.lng);
            });

            const fetchAddresses = async (ne_lat, ne_lng, sw_lat, sw_lng) => {
                try {
                    const response = await fetch(
                        `http://127.0.0.1:8000/get-addresses/?ne_lat=${encodeURIComponent(ne_lat)}&ne_lng=${encodeURIComponent(ne_lng)}&sw_lat=${encodeURIComponent(sw_lat)}&sw_lng=${encodeURIComponent(sw_lng)}`
                    );
            
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
            
                    const data = await response.json();
                    console.log("Fetched addresses:", data);
                    setAddressData(data.addresses);
                } catch (error) {
                    console.error("Failed to fetch addresses:", error);
                }
            };
            
        }
    }, [setAddressData]);

    return <div ref={mapRef} style={{ height: '100vh', width: '75%' }} />;
};

export default MapComponent;
