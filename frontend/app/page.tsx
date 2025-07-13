import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-green-600">GolfEzz</h1>
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Login
              </Link>
              <Link 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Dashboard Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to GolfEzz
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your complete golf course management solution for tee time bookings, 
            range sessions, and comprehensive course information.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/dashboard" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
            >
              View Dashboard
            </Link>
            <Link 
              href="/login" 
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg text-lg font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h3>
            <p className="text-lg text-gray-600">
              Comprehensive golf course management in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tee Time Bookings */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-green-600 text-4xl mb-4">🏌️</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Tee Time Bookings
              </h4>
              <p className="text-gray-600">
                Easy online booking system for tee times with real-time availability 
                and automated confirmations.
              </p>
            </div>

            {/* Course Information */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-green-600 text-4xl mb-4">📊</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Course Information
              </h4>
              <p className="text-gray-600">
                Detailed course information including par, handicap, and current 
                conditions for informed play.
              </p>
            </div>

            {/* Green Conditions */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-green-600 text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Green Speed Tracking
              </h4>
              <p className="text-gray-600">
                Real-time green speed measurements and condition updates to help 
                golfers prepare for their round.
              </p>
            </div>

            {/* Range Sessions */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-green-600 text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Range Management
              </h4>
              <p className="text-gray-600">
                Track range entry fees, golf ball bucket usage, and practice 
                session statistics.
              </p>
            </div>

            {/* Membership Management */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-green-600 text-4xl mb-4">💳</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Membership Tracking
              </h4>
              <p className="text-gray-600">
                Complete membership management with different tiers, benefits, 
                and payment tracking.
              </p>
            </div>

            {/* Progressive Dashboard */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-green-600 text-4xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Progressive Dashboard
              </h4>
              <p className="text-gray-600">
                Comprehensive analytics and insights into golf course operations 
                and player activities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Try the Demo
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Experience GolfEzz with our interactive demo featuring sample data and full functionality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Admin Demo
              </h4>
              <p className="text-gray-600 mb-4">
                Full administrative access with course management capabilities
              </p>
              <div className="text-sm text-gray-500 mb-4">
                Username: admin@golfezz.com<br />
                Password: admin123
              </div>
              <Link 
                href="/login" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Admin Login
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Member Demo
              </h4>
              <p className="text-gray-600 mb-4">
                Member portal with booking and range session features
              </p>
              <div className="text-sm text-gray-500 mb-4">
                Username: member@golfezz.com<br />
                Password: member123
              </div>
              <Link 
                href="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Member Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">GolfEzz</h3>
          <p className="text-gray-400">
            Professional Golf Course Management System
          </p>
          <p className="text-gray-400 mt-2">
            Built with Next.js, Go, and PostgreSQL
          </p>
        </div>
      </div>
    </main>
  )
}
