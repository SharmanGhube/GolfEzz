'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [currentUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    membershipType: 'Premium',
    upcomingBookings: 2,
  })

  const [courses] = useState([
    {
      id: 1,
      name: 'Championship Course',
      par: 72,
      holes: 18,
      greenSpeed: 11.5,
      status: 'Excellent',
    },
    {
      id: 2,
      name: 'Executive Course',
      par: 60,
      holes: 18,
      greenSpeed: 10.2,
      status: 'Good',
    },
  ])

  const [recentBookings] = useState([
    {
      id: 1,
      date: '2024-01-20',
      time: '08:00',
      course: 'Championship Course',
      players: 4,
      status: 'Confirmed',
    },
    {
      id: 2,
      date: '2024-01-25',
      time: '14:30',
      course: 'Executive Course',
      players: 2,
      status: 'Pending',
    },
  ])

  const [rangeStats] = useState({
    totalSessions: 45,
    ballsHit: 2250,
    avgSessionTime: '45 min',
    lastVisit: '2024-01-15',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="text-golf-green-600 hover:text-golf-green-500 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-golf-green-600">GolfEzz Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser.name}</span>
              <Link
                href="/profile"
                className="golf-button bg-golf-green-600 hover:bg-golf-green-700 text-white px-4 py-2 rounded"
              >
                Profile
              </Link>
              <button className="golf-button bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="golf-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Membership</h3>
            <p className="text-2xl font-bold text-golf-green-600">{currentUser.membershipType}</p>
          </div>
          <div className="golf-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Bookings</h3>
            <p className="text-2xl font-bold text-blue-600">{currentUser.upcomingBookings}</p>
          </div>
          <div className="golf-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Range Sessions</h3>
            <p className="text-2xl font-bold text-purple-600">{rangeStats.totalSessions}</p>
          </div>
          <div className="golf-card bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Balls Hit</h3>
            <p className="text-2xl font-bold text-orange-600">{rangeStats.ballsHit}</p>
          </div>
        </div>

        {/* Course Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="golf-card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Information</h2>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-golf-green-600">{course.name}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-gray-600">Par:</span> {course.par}
                    </div>
                    <div>
                      <span className="text-gray-600">Holes:</span> {course.holes}
                    </div>
                    <div>
                      <span className="text-gray-600">Green Speed:</span> {course.greenSpeed}
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>{' '}
                      <span className={`font-medium ${course.status === 'Excellent' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="golf-card bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-golf-green-600">{booking.course}</h3>
                      <p className="text-sm text-gray-600">
                        {booking.date} at {booking.time}
                      </p>
                      <p className="text-sm text-gray-600">{booking.players} players</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="golf-card bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/bookings/new"
              className="golf-button bg-golf-green-600 hover:bg-golf-green-700 text-white text-center py-3 px-4 rounded-lg font-medium"
            >
              Book Tee Time
            </Link>
            <Link
              href="/range"
              className="golf-button bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium"
            >
              Range Session
            </Link>
            <Link
              href="/membership"
              className="golf-button bg-purple-600 hover:bg-purple-700 text-white text-center py-3 px-4 rounded-lg font-medium"
            >
              Manage Membership
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
