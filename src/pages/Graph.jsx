import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GreenBar from "../component/GreenBar";
import Sidebar from "../component/SideBar";
import { categorizeFactories } from "../utils/factoryStatus";
import { useFactoryData } from "../context/FactoryDataContext";

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const grayIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const yellowIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

export default function Graph() {
  const mapRef = useRef(null);
  const { data, loading } = useFactoryData();

  useEffect(() => {
    if (loading || !data.length) return;

    const map = L.map(mapRef.current).setView([12.565679, 104.990963], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const { green, yellow, red, gray } = categorizeFactories(data);

    function plotMarkers(factories, icon) {
    factories.forEach(factory => {
      // Skip if mapLatLong is missing, empty, or "N/A"
      if (
        !factory.mapLatLong ||
        factory.mapLatLong === "N/A" ||
        factory.mapLatLong.trim() === ""
      ) {
        return;
      }
      const [lat, lng] = factory.mapLatLong.split(",").map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) return; // Skip if coordinates are invalid
      const marker = L.marker([lat, lng], { icon }).addTo(map);
      marker.bindPopup(
        `<div>
          <b>${factory.station_info?.Company || factory.name}</b><br/>
          <span>ទីតាំង: ${factory.station_info?.Province || "-"}</span><br/>
          <span>ប្រភេទ: ${factory.station_info?.Type || "-"}</span><br/>
          <span>Device ID: ${factory.device_ids || "-"}</span>
        </div>`
      );
    });
  }

    plotMarkers(green, greenIcon);
    plotMarkers(yellow, yellowIcon);
    plotMarkers(red, redIcon);
    plotMarkers(gray, grayIcon);

    return () => {
      map.remove();
    };
  }, [data, loading]);

  return (
    <div className="h-screen flex flex-col">
      <GreenBar />
      <div className="flex flex-1 relative pt-16">
        <Sidebar />
        <div className="flex-1 relative">
          <div className="max-w-7xl mx-auto h-full">
            <div
              ref={mapRef}
              className="absolute top-0 left-0 w-full h-full"
              style={{ zIndex: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}