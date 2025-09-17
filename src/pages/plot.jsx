import GreenBar from "../component/GreenBar";
import Sidebar from "../component/SideBar";
import React from "react";
import { useFactoryData } from "../context/FactoryDataContext";
import GreenLoadingBar from "../component/GreenLoading";
import ParamChart from "../component/ParamChart";

export default function Plot() {
  const { data, loading } = useFactoryData();

  if (loading) return <GreenLoadingBar />;

  // helper to get top 10
  const getTop10 = (key) =>
    data
      .map((f) => ({
        label: f.station_info?.Company || "Unknown",
        value: f.avg_parame?.[key] || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

  const phTop = getTop10("ph");
  const codTop = getTop10("cod");
  const tssTop = getTop10("ss");

  return (
    <div className="h-screen flex flex-col">
      <GreenBar />
      <div className="flex flex-1 relative pt-16">
        <Sidebar />
        <div className="p-5 flex-1 flex flex-col">
          {/* row of small charts */}
          <div className="flex flex-wrap">
            <ParamChart
              title="Top 10 by pH"
              labels={phTop.map((f) => f.label)}
              values={phTop.map((f) => f.value)}
              color="rgba(75, 192, 192, 0.6)"
            />
            <ParamChart
              title="Top 10 by COD"
              labels={codTop.map((f) => f.label)}
              values={codTop.map((f) => f.value)}
              color="rgba(255, 99, 132, 0.6)"
            />
            <ParamChart
              title="Top 10 by TSS"
              labels={tssTop.map((f) => f.label)}
              values={tssTop.map((f) => f.value)}
              color="rgba(54, 162, 235, 0.6)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
