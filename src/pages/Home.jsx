import GreenBar from "../component/GreenBar";  
import Sidebar  from "../component/SideBar"; 


export default function Home() {
  return (
    <>
    
      <div className="h-screen flex flex-col relative">
        <GreenBar />

        <div className="flex flex-1 relative pt-16">

          <Sidebar />
          <div className="flex-1 relative">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/home_bg.jpg')" }} // put your GTA image in public/images
          />

          {/* Overlay (dark layer for readability) */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Text Content */}
          <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
            <div>
              <h1 className="text-5xl font-bold mb-4">WQM Ministry of Environment</h1>
              <p className="text-lg mb-6">
                Dash Auto generates reports on factory data quality, Graph provides visualizations to gain insights from your data, and Forecast predicts parameter trends based on historical data to help plan ahead.
              </p>
            </div>
        </div>

      </div>

    </div>

    </div>
      

    
    
    </>

  );
}