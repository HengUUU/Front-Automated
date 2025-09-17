import GreenBar from "../component/GreenBar";
import Sidebar from "../component/SideBar";
import { useState } from "react";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { useFactoryData } from "../context/FactoryDataContext";
import GreenLoadingBar from "../component/GreenLoading";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export default function Poster() {
  const { data, loading } = useFactoryData();

  if (loading) {
    // shorter duration, smooth cycling
    return <GreenLoadingBar />;
  }

  function toKhmerNumber(number) {
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return number.toString().split("").map(d => khmerDigits[+d] || d).join("");
  }

  // For downloading table as image

  const tableRef = useRef();
function downloadTableImage() {
  if (!tableRef.current) return;

  const targetWidth = 1588;
  const scale = 2;

  const clonedNode = tableRef.current.cloneNode(true);

  // Basic styling for the cloned container
  clonedNode.style.position = "absolute";
  clonedNode.style.left = "-9999px";
  clonedNode.style.width = targetWidth + "px";
  clonedNode.style.transform = "scale(1)";
  clonedNode.style.transformOrigin = "top left";
  clonedNode.style.fontFamily = "'Noto Sans Khmer', sans-serif";

  // Style all tables
  clonedNode.querySelectorAll("table").forEach(el => {
    el.style.width = "100%";
    el.style.border = "1px solid #d1d5db";
    el.style.fontSize = "0.875rem";
    el.style.textAlign = "center";
    el.style.borderCollapse = "collapse";
  });

  // Style table headers
  clonedNode.querySelectorAll("th").forEach(el => {
    el.style.fontFamily = "'Noto Sans Khmer', sans-serif";
    el.style.fontSize = "1.125rem";
    el.style.lineHeight = "1.75rem";
    el.style.textAlign = "center";
    el.style.verticalAlign = "middle";
    el.style.fontWeight = "bold";
    el.style.border = "1px solid #d1d5db";
    el.style.backgroundColor = "#bfdbfe";
    el.style.padding = "8px";
    el.style.display = "table-cell";
  });

  // Style table cells
  clonedNode.querySelectorAll("td").forEach(el => {
    el.style.fontFamily = "'Noto Sans Khmer', sans-serif";
    el.style.fontSize = "1.125rem";
    el.style.lineHeight = "1.4";
    el.style.textAlign = "center";
    el.style.verticalAlign = "middle";
    el.style.border = "1px solid #d1d5db";
    el.style.padding = "12px 8px";
    el.style.display = "table-cell";
    el.style.height = "50px"; // keeps text vertically centered
  });

  // Style titles
  clonedNode.querySelectorAll("h1").forEach(el => {
    el.style.fontFamily = "'Noto Sans Khmer', sans-serif";
    el.style.fontSize = "1.5rem";
    el.style.lineHeight = "2rem";
    el.style.textAlign = "center";
    el.style.fontWeight = "bold";
    el.style.margin = "16px 0";
  });

  // Style summary container
  clonedNode.querySelectorAll("div").forEach(el => {
    if (el.querySelector(".summary_span")) {
      el.style.display = "flex";
      el.style.justifyContent = "space-around";
      el.style.alignItems = "center"; // ✅ fixed
      el.style.width = "100%";
      el.style.padding = "16px";
      el.style.gap = "16px";
    }

    if (el.classList && el.classList.contains("text-center")) {
      el.style.display = "flex";
      el.style.flexDirection = "column";
      el.style.alignItems = "center";
      el.style.justifyContent = "center"; // ✅ changed to center
      el.style.textAlign = "center";
      el.style.minWidth = "150px";
    }
  });

  // Style summary spans
  clonedNode.querySelectorAll(".summary_span").forEach(el => {
    el.style.fontFamily = "'Noto Sans Khmer', sans-serif";
    el.style.fontSize = "1.125rem";
    el.style.fontWeight = "bold";
    el.style.textAlign = "center";
    el.style.display = "flex"; // ✅ force flex
    el.style.justifyContent = "center";
    el.style.alignItems = "center";
    el.style.padding = "10px 12px";
    el.style.borderRadius = "6px";
    el.style.minWidth = "50px";
    el.style.height = "40px";
    el.style.lineHeight = "1";
    el.style.marginBottom = "8px";

    if (el.classList.contains("bg-green-600")) {
      el.style.backgroundColor = "#16a34a";
      el.style.color = "white";
    } else if (el.classList.contains("bg-yellow-400")) {
      el.style.backgroundColor = "#facc15";
      el.style.color = "black";
    } else if (el.classList.contains("bg-red-600")) {
      el.style.backgroundColor = "#dc2626";
      el.style.color = "white";
    } else if (el.classList.contains("bg-gray-300")) {
      el.style.backgroundColor = "#d1d5db";
      el.style.color = "black";
    }
  });

  // Style paragraphs under summary spans
  clonedNode.querySelectorAll("p").forEach(el => {
    if (el.parentElement && el.parentElement.querySelector(".summary_span")) {
      el.style.fontFamily = "'Noto Sans Khmer', sans-serif";
      el.style.fontSize = "1rem";
      el.style.textAlign = "center";
      el.style.margin = "8px 0 0 0";
      el.style.lineHeight = "1.4";
      el.style.fontWeight = "bold";
      el.style.maxWidth = "180px";
      el.style.wordWrap = "break-word";
    } else {
      el.style.fontFamily = "'Noto Sans Khmer', sans-serif";
      el.style.textAlign = "center";
      el.style.margin = "8px 0";
    }
  });

  // Style "standards" span
  clonedNode.querySelectorAll("span").forEach(el => {
    if (el.textContent && el.textContent.includes("កម្រិតស្តង់ដារ")) {
      el.style.fontFamily = "'Noto Sans Khmer', sans-serif";
      el.style.fontSize = "1rem";
      el.style.textAlign = "center";
      el.style.padding = "8px 12px";
      el.style.borderRadius = "6px";
      el.style.backgroundColor = "#22c55e";
      el.style.color = "white";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.minWidth = "240px";
      el.style.height = "40px";
    }
  });

  document.body.appendChild(clonedNode);

  document.fonts.ready.then(() => {
    html2canvas(clonedNode, {
      ignoreElements: el => el.classList.contains("no-capture"),
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      scale: scale,
      width: targetWidth,
      scrollX: 0,
      scrollY: -window.scrollY,
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = `report_page_${currentPage}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      document.body.removeChild(clonedNode);
    });
  });
}


  // function download report as xls



  function formatDateToKhmer(dateString) {
    const monthsKhmer = [
      "មករា", "កុម្ភៈ", "មីនា", "មេសា",
      "ឧសភា", "មិថុនា", "កក្កដា", "សីហា",
      "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
    ];
    const date = new Date(dateString);
    const day = toKhmerNumber(date.getDate());
    const month = monthsKhmer[date.getMonth()];
    const year = toKhmerNumber(date.getFullYear());
    return `${day} ខែ ${month} ឆ្នាំ ${year}`;
  }

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 24;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const summary = data.reduce(
    (acc, row) => {
      const { avg_parame } = row;

      if (!avg_parame || avg_parame.ph == null || avg_parame.cod == null || avg_parame.ss == null) {
        acc.missing += 1;
      } else {
        // ✅ Check if all parameters are 0
        if (avg_parame.ph === 0 && avg_parame.cod === 0 && avg_parame.ss === 0) {
          acc.red += 1;
        } else {
          let exceedCount = 0;
          if (avg_parame.ph < 5.5 || avg_parame.ph > 9) exceedCount++;
          if (avg_parame.cod >= 120) exceedCount++;
          if (avg_parame.ss >= 100) exceedCount++;

          if (exceedCount === 1) acc.yellow += 1;
          else if (exceedCount >= 2) acc.red += 1;
          else acc.green += 1;
        }
      }
      return acc;
    },
    { green: 0, yellow: 0, red: 0, missing: 0 }
  );

  const thresholds = {
    ph: { min: 5.5, max: 9 },
    cod: 120,
    ss: 100
  };

  // const { green, red, gray } = categorizeFactories(data);
  function getStatus(avg_parame) {
    if (!avg_parame) {
      return { text: "រដូវផ្អាកដំណើរការ", bgClass: "bg-gray-300 text-black font-bold" };
    }

    const { ph, cod, ss } = avg_parame;

    // ✅ Case 1: all parameters are 0 → RED
    if (ph === 0 && cod === 0 && ss === 0) {
      return { text: "ចុះត្រួតពិនិត្យ", bgClass: "bg-red-600 text-white font-bold" };
    }

    // ✅ Case 2: missing some parameters → only check existing ones
    let exceedCount = 0;
    if (ph != null && (ph < 5.5 || ph > 9)) exceedCount++;
    if (cod != null && cod >= 120) exceedCount++;
    if (ss != null && ss >= 100) exceedCount++;

    // ✅ Case 3: all params missing → GRAY
    if (ph == null && cod == null && ss == null) {
      return { text: "រដូវផ្អាកដំណើរការ", bgClass: "bg-gray-300 text-black font-bold" };
    }

    // ✅ Normal checks
    if (exceedCount === 1) {
      return { text: "កំពុងតាមដាន", bgClass: "bg-yellow-400 text-black font-bold" };
    }
    if (exceedCount >= 2) {
      return { text: "ចុះត្រួតពិនិត្យ", bgClass: "bg-red-600 text-white font-bold" };
    }
    return { text: "អនុលោមស្តង់ដារ", bgClass: "bg-green-600 text-white font-bold" };
  }

  async function downloadExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Add header row
    worksheet.addRow([
      "ល.រ",
      "ឈ្មោះក្រុមហ៊ុន",
      "ទីតាំង",
      "ប្រភេទក្រុមហ៊ុន",
      "pH",
      "COD (mg/l)",
      "TSS (mg/l)",
      "ស្ថានភាព សំណល់រាវ",
    ]);

    // Add data rows
    currentData.forEach((row, ind) => {
      const statusInfo = getStatus(row.avg_parame);
      worksheet.addRow([
        (currentPage - 1) * rowsPerPage + ind + 1,
        row.station_info?.Company || "-",
        row.station_info?.Province || "-",
        row.station_info?.Type || "-",
        row.avg_parame?.ph != null ? row.avg_parame.ph.toFixed(2) : "-",
        row.avg_parame?.cod != null ? row.avg_parame.cod.toFixed(2) : "-",
        row.avg_parame?.ss != null ? row.avg_parame.ss.toFixed(2) : "-",
        statusInfo.text,
      ]);
    });

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `report_page_${currentPage}.xlsx`);
  }

  // Excel version with bold styling for threshold-exceeding values

  async function downloadExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Add header row
    const headerRow = worksheet.addRow([
      "ល.រ",
      "ឈ្មោះក្រុមហ៊ុន",
      "ទីតាំង",
      "ប្រភេទក្រុមហ៊ុន",
      "pH",
      "COD (mg/l)",
      "TSS (mg/l)",
      "ស្ថានភាព សំណល់រាវ",
    ]);

    // Make header bold
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    // Add all data rows (not just current page)
    data.forEach((row, ind) => {
      const statusInfo = getStatus(row.avg_parame);

      const ph = row.avg_parame?.ph;
      const cod = row.avg_parame?.cod;
      const ss = row.avg_parame?.ss;

      const dataRow = worksheet.addRow([
        ind + 1, // serial number
        row.station_info?.Company || "-",
        row.station_info?.Province || "-",
        row.station_info?.Type || "-",
        ph != null ? ph.toFixed(2) : "-",
        cod != null ? cod.toFixed(2) : "-",
        ss != null ? ss.toFixed(2) : "-",
        statusInfo.text,
      ]);

      // Bold cells if exceed thresholds
      if (ph != null && (ph < thresholds.ph.min || ph > thresholds.ph.max)) {
        dataRow.getCell(5).font = { bold: true };
      }
      if (cod != null && cod >= thresholds.cod) {
        dataRow.getCell(6).font = { bold: true };
      }
      if (ss != null && ss >= thresholds.ss) {
        dataRow.getCell(7).font = { bold: true };
      }
    });

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `facto_waterQ_rp.xlsx`);
  }



  return (
    <>
      <div className="h-screen flex flex-col">
        <GreenBar />
        <div className="flex flex-1 relative pt-16">
          <Sidebar />
          <div ref={tableRef} className="p-5 flex flex-col items-center w-full">

            <div className="w-full bg-gradient-to-r from-sky-300 to-green-200 py-6">
              <div className="flex justify-center items-center gap-8 mb-4">
                <img src="icon_moe.png" alt="Logo 1" className="h-20 w-auto" />
                <img src="images/dp_envi.png" alt="Logo 2" className="h-20 w-auto" />
                <img src="images/jakra1.png" alt="Logo 3" className="h-20 w-auto" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 text-center font-khmer">
                លទ្ធផលស្វ័យត្រួតពិនិត្យគុណភាពសំណល់រាវ
              </h1>
              {data.length > 0 &&
                <p className="text-md md:text-lg text-center mt-2 font-khmer text-gray-800 text-bold">
                  សម្រាប់ថ្ងៃទី: {formatDateToKhmer(data[0].date)} (មធ្យមភាគប្រចាំថ្ងៃ)
                </p>
              }
            </div>

            <table className="w-full border border-gray-300 text-sm text-center">
              <thead className="bg-blue-100">
                <tr>
                  <th className="text-lg border border-green-800 p-3 text-center align-middle font-khmer">ល.រ</th>
                  <th className="text-lg border border-green-800 text-center align-middle p-2 font-khmer">ឈ្មោះក្រុមហ៊ុន</th>
                  <th className="text-lg border border-green-800 text-center align-middle p-2 font-khmer">ទីតាំង</th>
                  <th className="text-lg border border-green-800 text-center align-middle p-2 font-khmer">ប្រភេទក្រុមហ៊ុន</th>
                  <th className="text-lg border border-green-800 text-center align-middle p-2">pH</th>
                  <th className="text-lg border border-green-800 text-center align-middle p-2">COD (mg/l)</th>
                  <th className="text-lg border border-green-800 text-center align-middle p-2">TSS (mg/l)</th>
                  <th className="text-lg border border-green-800 text-center align-middle    p-2 font-khmer">ស្ថានភាព សំណល់រាវ</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, ind) => {
                  const statusInfo = getStatus(row.avg_parame);
                  return (
                    <tr key={ind} className="hover:bg-gray-50">
                      <td className="text-lg border border-green-800 text-center align-middle p-2 font-khmer">{(currentPage - 1) * rowsPerPage + ind + 1}</td>
                      <td className="text-lg border border-green-800 text-center align-middle p-2 font-khmer">{row.station_info?.Company}</td>
                      <td className="text-lg border border-green-800 text-center align-middle p-2 font-khmer">{row.station_info?.Province}</td>
                      <td className="text-lg border border-green-800 text-center align-middle p-2 font-khmer">{row.station_info?.Type}</td>
                      <td className={`border border-green-800 text-center align-middle p-2 ${row.avg_parame?.ph != null &&
                          (row.avg_parame.ph < thresholds.ph.min || row.avg_parame.ph > thresholds.ph.max)
                          ? "text-lg bg-red-200 font-bold"
                          : ""
                        }`}>
                        {row.avg_parame?.ph != null ? row.avg_parame.ph.toFixed(2) : "-"}
                      </td>
                      <td className={`text-lg border text-center align-middle border-green-800 p-2 ${row.avg_parame?.cod != null && row.avg_parame.cod >= thresholds.cod
                          ? "bg-red-200 font-bold"
                          : ""
                        }`}>
                        {row.avg_parame?.cod != null ? row.avg_parame.cod.toFixed(2) : "-"}
                      </td>
                      <td className={`text-lg border text-center align-middle border-green-800 p-2 ${row.avg_parame?.ss != null && row.avg_parame.ss >= thresholds.ss
                          ? "bg-red-200 font-bold"
                          : ""
                        }`}>
                        {row.avg_parame?.ss != null ? row.avg_parame.ss.toFixed(2) : "-"}
                      </td>
                      <td className={`text-lg border align-middle border-green-800 p-2 text-center font-khmer ${statusInfo.bgClass}`}>
                        {statusInfo.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {currentPage === totalPages && (
              <div className="w-full bg-white border border-green-800 p-4 rounded-md shadow-md mt-4 flex flex-col">
                <div className="mb-4">
                  <span className="text-gray-700 font-khmer font-semibold text-lg">
                    សេចក្តីសន្និដ្ឋានអំពីស្ថានភាពសំណល់រាវ:
                  </span>
                </div>
                <div className="flex justify-around">
                  <div className="text-center">
                    <span  className="summary_span text-lg rounded-md font-bold px-2 py-2 bg-green-600 text-white">
                      {summary.green}
                    </span>
                    <p className="py-2 text-lg text-center align-middle text-green-700 font-bold">ក្រុមហ៊ុនអនុលោមស្តង់ដា</p>
                  </div>
                  <div className="text-center">
                    <span  className="summary_span text-lg rounded-md font-bold text-center align-middle px-2 py-2 bg-yellow-400 text-white">
                      {summary.yellow}
                    </span>
                    <p className="py-2 text-lg text-yellow-700 text-center align-middle font-bold">ក្រុមហ៊ុនកំពុងតាមដាន</p>
                  </div>
                  <div className="text-center">
                    <span  className="summary_span text-lg rounded-md text-center align-middle font-bold px-2 py-2 bg-red-600 text-white">
                      {summary.red}
                    </span>
                    <p className="py-2 text-lg text-center align-middle text-red-700 font-bold">ក្រុមហ៊ុនកំពុងចុះត្រួតពិនិត្យ</p>
                  </div>
                  {summary.missing > 0 && (
                    <div className="text-center">
                      <span  className="summary_span text-lg rounded-md text-center align-middle font-bold px-2 py-2 bg-gray-300 text-black">
                        {summary.missing}
                      </span>
                      <p className="py-2 text-lg text-center align-middle text-gray-700 font-bold">រដូវផ្អាកដំណើរការ</p>
                    </div>
                  )}
                  <div className="text-center">
                    <span
                      className="bg-green-500 text-white text-center align-middle rounded-md shadow-md flex items-center justify-center"
                      style={{ minWidth: "240px", height: "40px", fontSize: "1.1rem" }}
                    >
                      កម្រិតស្តង់ដារការបញ្ចេញសំណល់រាវ
                    </span>
                    <p className="text-lg">pH: 5.5 – 9</p>
                    <p className="text-lg">COD &lt; 120 mg/l</p>
                    <p className="text-lg">TSS &lt; 100 mg/l</p>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full flex justify-center items-center mt-4 gap-4 no-capture">
              <button
                onClick={downloadTableImage}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Download Table as Image
              </button>
              <button
                onClick={downloadExcel}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Download Table as Excel
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}