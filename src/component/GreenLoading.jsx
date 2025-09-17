export default function GreenLoadingBar() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="text-xl font-bold mb-4 text-green-700 font-khmer">
        កំពុងទាញយកទិន្នន័យ...
      </div>
      <div className="w-80 h-6 bg-green-100 rounded-full overflow-hidden border border-green-400 relative">
        <div className="absolute h-full w-1/3 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-slide" />
      </div>
      <style jsx>{`
        @keyframes slide {
          0% { left: -33%; }
          100% { left: 100%; }
        }
        .animate-slide {
          animation: slide 2s linear infinite;
        }
      `}</style>
    </div>
  );
}