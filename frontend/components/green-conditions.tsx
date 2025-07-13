'use client'

export function GreenConditions() {
  return (
    <div className="golf-card p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Today's Green Conditions</h2>
      
      <div className="space-y-6">
        <div className="text-center bg-golf-green-50 p-6 rounded-lg">
          <h3 className="font-semibold text-golf-green-800 mb-2">Green Speed</h3>
          <p className="text-4xl font-bold text-golf-green-600">9.5</p>
          <p className="text-sm text-golf-green-700">Stimpmeter Reading</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-blue-800 mb-2">Firmness</h4>
            <div className="flex justify-center mb-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 mx-0.5 rounded-full ${
                    i < 7 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-blue-600 font-bold">7/10</p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-indigo-800 mb-2">Moisture</h4>
            <div className="flex justify-center mb-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 mx-0.5 rounded-full ${
                    i < 6 ? 'bg-indigo-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-indigo-600 font-bold">6/10</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Weather Conditions</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Temperature</p>
              <p className="font-semibold text-lg">72°F</p>
            </div>
            <div>
              <p className="text-gray-600">Wind</p>
              <p className="font-semibold text-lg">8 mph SW</p>
            </div>
            <div>
              <p className="text-gray-600">Condition</p>
              <p className="font-semibold text-lg">Partly Cloudy</p>
            </div>
            <div>
              <p className="text-gray-600">Humidity</p>
              <p className="font-semibold text-lg">65%</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Course Notes</h4>
          <p className="text-yellow-700 text-sm">
            Excellent conditions for play today. Greens are rolling true and fast. 
            Be mindful of the wind on holes 12-15.
          </p>
        </div>
      </div>
    </div>
  )
}
