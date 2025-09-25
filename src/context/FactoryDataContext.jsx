import React, { createContext, useContext, useEffect, useState } from "react";
import GreenLoadingBar from "../component/GreenLoading";

const FactoryDataContext = createContext();

// custom hook to use the context
export function useFactoryData() {
  return useContext(FactoryDataContext);
}

export function FactoryDataProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        // fetch reports and factories in parallel
        const [reportRes, factoryRes] = await Promise.all([
          fetch(`${apiUrl}/report`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/factories`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const reportJson = await reportRes.json();
        const factoriesJson = await factoryRes.json();

        // merge reports with factories using same fallback logic
        const mergedData = reportJson.data.map(report => {
          // First try match by Id
          let matchedFactory = factoriesJson.find(
            f => f.Id === report.device_ids
          );

          // If no match by Id, try match by name (case-insensitive)
          if (!matchedFactory && report.station_info?.Company) {
            matchedFactory = factoriesJson.find(
              f =>
                f.name?.toLowerCase() ===
                report.station_info.Company.toLowerCase()
            );
          }

          return {
            ...report,
            station_info: matchedFactory
              ? {
                  Company: matchedFactory.name,
                  Province: matchedFactory.location,
                  Type: matchedFactory.business,
                  LatLong: matchedFactory.mapLatLong
                }
              : report.station_info // keep original if no match
          };
        });

        setData(mergedData);
      } catch (err) {
        console.error("Error fetching reports/factories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiUrl]);

  if (loading) {
    return <GreenLoadingBar />;
  }

  return (
    <FactoryDataContext.Provider value={{ data, loading }}>
      {children}
    </FactoryDataContext.Provider>
  );
}




        // const mergedData = json.data.map(factory => {
        // // First try to find by Id
        // let khInfo = factoriesKh.find(kh => kh.Id === factory.device_ids);

        // // If no match by Id, try match by name (case-insensitive)
        // if (!khInfo && factory.station_info?.Company) {
        //   khInfo = factoriesKh.find(
        //     kh => kh.name.toLowerCase() === factory.station_info.Company.toLowerCase()
        //   );
        // }

  