import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GreenLoadingBar from "../component/GreenLoading";

const FactoryDataContext = createContext();

export function useFactoryData() {
  const context = useContext(FactoryDataContext);
  if (!context) {
    throw new Error("useFactoryData must be used within a FactoryDataProvider");
  }
  return context;
}

export function FactoryDataProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Start with loading false
  const [retryCount, setRetryCount] = useState(0); // Track retries
  const maxRetries = 3; // Maximum retry attempts
  const apiUrl = import.meta.env.VITE_API_URL;
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isPosterPage = location.pathname === "/poster"; // Adjust to your route

    // Only fetch if token exists and on Poster page
    if (!token || !isPosterPage) {
      setLoading(false);
      setData([]);
      return;
    }

    let isMounted = true;
    const retryDelay = 3000; // 3 seconds delay between retries

    async function fetchData() {
      try {
        setLoading(true);
        const [reportRes, factoryRes] = await Promise.all([
          fetch(`${apiUrl}/report-wci`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/factories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!reportRes.ok || !factoryRes.ok) {
          throw new Error("API request failed");
        }

        const reportJson = await reportRes.json();
        const factoriesJson = await factoryRes.json();

        if (!reportJson.data || !Array.isArray(reportJson.data)) {
          throw new Error("Invalid report data format");
        }

        const mergedData = reportJson.data.map((report) => {
          let matchedFactory = factoriesJson.find((f) => f.Id === report.device_ids);
          if (!matchedFactory && report.station_info?.Company) {
            matchedFactory = factoriesJson.find(
              (f) => f.name?.toLowerCase() === report.station_info.Company.toLowerCase()
            );
          }
          return {
            ...report,
            station_info: matchedFactory
              ? {
                  Company: matchedFactory.name,
                  Province: matchedFactory.location,
                  Type: matchedFactory.business,
                  LatLong: matchedFactory.mapLatLong,
                }
              : report.station_info || {},
          };
        });

        if (isMounted) {
          setData(mergedData);
          setRetryCount(0); // Reset retries on success
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching data:", err);
          setData([]);
          if (retryCount < maxRetries) {
            setTimeout(() => {
              setRetryCount((prev) => prev + 1);
            }, retryDelay);
          }
        }
      } finally {
        if (isMounted && (retryCount >= maxRetries || data.length > 0)) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiUrl, location.pathname, retryCount, localStorage.getItem("token")]); // Depend on token

  return (
    <FactoryDataContext.Provider value={{ data, loading }}>
      {loading ? <GreenLoadingBar /> : children}
    </FactoryDataContext.Provider>
  );
}