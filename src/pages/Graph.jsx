import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import GreenBar from "../component/GreenBar";
import Sidebar from "../component/SideBar";
import GreenLoadingBar from "../component/GreenLoading";
import { categorizeFactories } from "../utils/factoryStatus";
import { useFactoryData } from "../context/FactoryDataContext";

// Leaflet icons
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const grayIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const yellowIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Khmer number conversion (from Poster)
function toKhmerNumber(number) {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return number.toString().split("").map(d => khmerDigits[+d] || d).join("");
}

export default function Graph() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const { data, loading, error } = useFactoryData();

  useEffect(() => {
    if (loading || error || !data.length || !mapRef.current) return;

    console.log("Graph received data:", data); // Debug: Log data

    mapInstance.current = L.map(mapRef.current).setView([12.565679, 104.990963], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance.current);

    const { green, yellow, red, gray } = categorizeFactories(data);

    function plotMarkers(factories, icon) {
      factories.forEach(factory => {
        if (
          !factory.station_info?.LatLong ||
          factory.station_info.LatLong === "N/A" ||
          factory.station_info.LatLong.trim() === ""
        ) {
          console.warn(`Skipping factory ${factory.station_info?.Company || factory.name || "unknown"}: Invalid LatLong`);
          return;
        }
        const [lat, lng] = factory.station_info.LatLong.split(",").map(coord => parseFloat(coord.trim()));
        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Invalid coordinates for ${factory.station_info?.Company || factory.name || "unknown"}: ${factory.station_info.LatLong}`);
          return;
        }
        const marker = L.marker([lat, lng], { icon }).addTo(mapInstance.current);
        marker.bindPopup(
          `<div style="font-family: 'Noto Sans Khmer', sans-serif;">
            <b>${factory.station_info?.Company || factory.name || "គ្មានឈ្មោះ"}</b><br/>
            <span>ទីតាំង: ${factory.station_info?.Province || "-"}</span><br/>
            <span>ប្រភេទ: ${factory.station_info?.Type || "-"}</span><br/>
            <span>Device ID: ${toKhmerNumber(factory.device_ids || "-")}</span>
          </div>`
        );
      });
    }

    plotMarkers(green, greenIcon);
    plotMarkers(yellow, yellowIcon);
    plotMarkers(red, redIcon);
    plotMarkers(gray, grayIcon);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [data, loading, error]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <GreenBar />
        <div className="flex flex-1 relative pt-16">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <GreenLoadingBar />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col">
        <GreenBar />
        <div className="flex flex-1 relative pt-16">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-red-600 text-lg font-khmer">
              កំហុស: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

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