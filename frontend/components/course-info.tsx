'use client'

export function CourseInfo() {
  return (
    <div className="golf-card p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-golf-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-golf-green-800 mb-2">Total Holes</h3>
            <p className="text-2xl font-bold text-golf-green-600">18</p>
          </div>
          <div className="bg-golf-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-golf-green-800 mb-2">Par</h3>
            <p className="text-2xl font-bold text-golf-green-600">72</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-golf-fairway-50 p-4 rounded-lg">
            <h3 className="font-semibold text-golf-fairway-800 mb-2">Course Rating</h3>
            <p className="text-2xl font-bold text-golf-fairway-600">72.5</p>
          </div>
          <div className="bg-golf-fairway-50 p-4 rounded-lg">
            <h3 className="font-semibold text-golf-fairway-800 mb-2">Slope Rating</h3>
            <p className="text-2xl font-bold text-golf-fairway-600">130</p>
          </div>
        </div>

        <div className="bg-golf-sand-50 p-4 rounded-lg">
          <h3 className="font-semibold text-golf-sand-800 mb-2">Total Yardage</h3>
          <p className="text-2xl font-bold text-golf-sand-600">6,800 yards</p>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Course Features</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-golf-green-500 rounded-full mr-3"></span>
              Championship 18-hole course
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-golf-green-500 rounded-full mr-3"></span>
              Four sets of tees for all skill levels
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-golf-green-500 rounded-full mr-3"></span>
              Practice facilities and driving range
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-golf-green-500 rounded-full mr-3"></span>
              Full-service pro shop
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-golf-green-500 rounded-full mr-3"></span>
              Restaurant and clubhouse
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
