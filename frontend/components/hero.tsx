'use client'

import { motion } from 'framer-motion'
import { CalendarDaysIcon, ClockIcon, UsersIcon, MapPinIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center golf-gradient">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to{' '}
            <span className="text-yellow-400">GolfEzz</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Experience premier golf with seamless tee time bookings, 
            driving range sessions, and world-class facilities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="golf-card p-6 text-center">
            <CalendarDaysIcon className="h-12 w-12 text-golf-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Book Tee Times</h3>
            <p className="text-gray-600">Reserve your perfect tee time</p>
          </div>
          <div className="golf-card p-6 text-center">
            <ClockIcon className="h-12 w-12 text-golf-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Range Sessions</h3>
            <p className="text-gray-600">Practice at our driving range</p>
          </div>
          <div className="golf-card p-6 text-center">
            <UsersIcon className="h-12 w-12 text-golf-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Memberships</h3>
            <p className="text-gray-600">Join our exclusive club</p>
          </div>
          <div className="golf-card p-6 text-center">
            <MapPinIcon className="h-12 w-12 text-golf-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Course Info</h3>
            <p className="text-gray-600">18 holes of championship golf</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link 
            href="/bookings" 
            className="golf-button text-lg px-8 py-3 inline-block"
          >
            Book Tee Time
          </Link>
          <Link 
            href="/range" 
            className="bg-white text-golf-green-600 border-2 border-white hover:bg-gray-100 font-medium text-lg px-8 py-3 rounded-md transition-colors duration-200 inline-block"
          >
            Visit Range
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
