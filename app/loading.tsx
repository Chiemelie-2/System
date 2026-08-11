// app/loading.tsx
export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative mx-auto w-20 h-20">
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-800 animate-spin"></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-lg bg-primary-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 animate-pulse">Loading BankingSim...</p>
      </div>
    </div>
  )
}