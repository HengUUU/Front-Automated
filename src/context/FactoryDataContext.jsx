import React, { createContext, useContext, useEffect, useState } from "react";
import factoriesKh from "../utils/real_factory_info.json";
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
    fetch(`${apiUrl}/report`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}` // pass token
      }
    })
      .then(res => res.json())
      .then(json => {
        const mergedData = json.data.map(factory => {
        // First try to find by Id
        let khInfo = factoriesKh.find(kh => kh.Id === factory.device_ids);

        // If no match by Id, try match by name (case-insensitive)
        if (!khInfo && factory.station_info?.Company) {
          khInfo = factoriesKh.find(
            kh => kh.name.toLowerCase() === factory.station_info.Company.toLowerCase()
          );
        }

        return {
          ...factory,
          station_info: khInfo
            ? { Company: khInfo.name, Province: khInfo.location, Type: khInfo.business }
            : factory.station_info // keep existing if no match
        };
      });
        setData(mergedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <GreenLoadingBar />;
  }

  return (
    <FactoryDataContext.Provider value={{ data, loading }}>
      {children}
    </FactoryDataContext.Provider>
  );
}
