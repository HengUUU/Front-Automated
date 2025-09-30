import GreenBar from "../component/GreenBar";  
import Sidebar from "../component/SideBar";  

export default function Home() {
  return (
    <>
      <div className="flex flex-col relative min-h-screen">
        {/* Fixed GreenBar */}
        <div className="fixed top-0 left-0 right-0 z-20">
          <GreenBar />
        </div>

        <div className="flex flex-1 pt-16">
          {/* Fixed Sidebar */}
          <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-20 w-64">
            <Sidebar />
          </div>
          
          <div className="flex-1 pl-64 relative">
            {/* Fixed Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-fixed"
              style={{ backgroundImage: "url('/images/home_bg.jpg')" }}
            />
            {/* Overlay with Blur */}
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

            {/* Scrollable Content */}
            <div className="relative z-10 text-white">
              {/* Hero Section */}
              <section className="min-h-screen flex items-center px-8">
                <div className="max-w-3xl text-left">
                  <h1 className="text-5xl font-bold mb-4">
                    WQM Ministry of Environment
                  </h1>
                  <p className="text-lg mb-6">
                    Generate automated reports on factory water quality, visualize factory locations on a map, compare key parameters across top factories with graphs, and identify high-risk factories using a heatmap.
                  </p>
                </div>
              </section>

              {/* Features Section */}
              <section className="py-16 px-8">
                <h2 className="text-4xl font-bold mb-12 text-left">Our Features</h2>
                <div className="max-w-3xl space-y-8 text-left">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Auto-Generated Reports</h3>
                    <p>
                      Automatically generate detailed reports on factory water quality, providing insights into compliance and operational performance.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Factory Location Map</h3>
                    <p>
                      Visualize the geographical locations of factories on an interactive map to monitor their distribution and regional impact.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Parameter Comparison Graphs</h3>
                    <p>
                      Compare three key water quality parameters across top-performing factories using dynamic graphs for actionable insights.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Dangerous Factory Heatmap</h3>
                    <p>
                      Identify high-risk factories with a heatmap with WCI, highlighting areas with potential environmental hazards based on water quality data.
                    </p>
                  </div>
                </div>
              </section>

{/* CCME WQI Section */}
{/* CCME WQI Section */}
<section className="py-16 px-8">
  <div className="max-w-3xl bg-black bg-opacity-40 p-8 rounded-lg space-y-6 text-left">
    <h2 className="text-4xl font-bold mb-8">
      🌊 How CCME WQI Works
    </h2>
    <p>
      The <strong>Canadian Council of Ministers of the Environment Water Quality Index (CCME WQI)</strong> 
      is a method used to evaluate the overall quality of water. 
      It is based on three main factors:
    </p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>F1 (Scope)</strong> — the percentage of parameters that fail at least once.</li>
      <li><strong>F2 (Frequency)</strong> — the percentage of individual tests that fail.</li>
      <li><strong>F3 (Amplitude)</strong> — the extent by which failed tests exceed the guidelines.</li>
    </ul>

    <p>
      The final WQI score combines these three factors to produce a value between 0 and 100.
    </p>

    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
      <p className="text-lg">
        <strong>Formula:</strong>
      </p>
      <p className="mt-4 font-mono text-sm leading-relaxed text-left">
        F1 = (Number of failed parameters ÷ Total parameters) × 100 <br />
        F2 = (Number of failed tests ÷ Total tests) × 100 <br />
        F3 = nse ÷ (0.01 × nse + 0.01), &nbsp; where &nbsp; 
        nse = (Σ excursions ÷ Total tests) <br /><br />
        WQI = 100 − [ √(F1² + F2² + F3²) ÷ 1.732 ]
      </p>
    </div>

    <p>
      - If the result is close to <strong>100</strong>, water quality is excellent. <br />
      - If the result is close to <strong>0</strong>, water quality is poor. <br />
      Most real-world values fall between these extremes.
    </p>

    <p className="mt-4 text-sm">
      <strong>Resource:</strong> <a href="https://www.gov.nl.ca/ecc/files/waterres-reports-hydrogeology-easternnl-appendix-v-water-quality-index-calculation.pdf?utm_source=chatgpt.com" target="_blank" className="underline text-blue-400">
        CCME Water Quality Index Calculation Guide
      </a>
    </p>
  </div>
</section>





            </div>
          </div>
        </div>
      </div>
    </>
  );
}
