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
                      Identify high-risk factories with a heatmap, highlighting areas with potential environmental hazards based on water quality data.
                    </p>
                  </div>
                </div>
              </section>

              {/* WCI Section */}
              <section className="py-16 px-8 bg-black bg-opacity-40">
                <h2 className="text-4xl font-bold mb-8 text-left">
                  🌊 How WCI Works
                </h2>
                <div className="max-w-3xl space-y-6 text-left">
                  <p>
                    The <strong>Water Criticality Index (WCI)</strong> shows how risky a factory’s water discharge is for the environment. 
                    It is based on three key water quality parameters:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>pH</strong> — safe if between 5.5 and 9.</li>
                    <li><strong>COD (Chemical Oxygen Demand)</strong> — safe if less than 120.</li>
                    <li><strong>SS (Suspended Solids)</strong> — safe if less than 100.</li>
                  </ul>

                  <p>
                    Each parameter is scored between <strong>0 (safe)</strong> and <strong>1 (unsafe)</strong>.  
                    Then, the scores are averaged and scaled into a percentage.
                  </p>

                  <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                    <p className="text-lg">
                      <strong>Formula:</strong>
                    </p>
                    <p className="mt-2 font-mono">
                      WCI = ((pH_score + COD_score + SS_score) / 3) × 100
                    </p>
                  </div>

                  <p>
                    - If the result is <strong>0</strong>, the factory is fully safe. <br />
                    - If the result is <strong>100</strong>, the factory is at maximum environmental risk. <br />
                    Most factories fall somewhere in between.
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
