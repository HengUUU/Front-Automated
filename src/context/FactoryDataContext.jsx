import React, { createContext, useContext, useEffect, useState } from "react";
import factoriesKh from "../utils/real_factory_info.json";


const FactoryDataContext = createContext();

export function useFactoryData() {
  return useContext(FactoryDataContext);
}

export function FactoryDataProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    fetch(`${apiUrl}/report`)
    //fetch("https://65j8kfdv-3000.asse.devtunnels.ms/report")
      .then(res => res.json())
      .then(json => {
        // Merge Khmer info
        const mergedData = json.data.map(factory => {
          const khInfo = factoriesKh.find(kh => kh.Id === factory.device_ids);
          return {
            ...factory,
            station_info: khInfo
              ? { Company: khInfo.name, Province: khInfo.location, Type: khInfo.business }
              : factory.station_info
          };
        });
        setData(mergedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <FactoryDataContext.Provider value={{ data, loading }}>
      {children}
    </FactoryDataContext.Provider>
  );
}