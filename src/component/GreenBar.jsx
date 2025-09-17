


function GreenBar() {
  return (
        <div className="absolute top-0 left-0 w-full h-16 bg-green-700 flex items-center px-10">
         <img
        src="/signin.jpg" // Make sure this matches your file name in /public
        alt="Logo"
        className="h-10 w-10 rounded-full mr-3 ml-10"
    />
            <h1 className="text-left ml-17 font-bold font-medium " > Ministry of Environmnt</h1>
        </div>
  );
}

export default GreenBar;