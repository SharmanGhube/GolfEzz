'use client'

export function Features() {
  const features = [
    {
      title: "Easy Tee Time Booking",
      description: "Book your tee times online with our intuitive booking system. See real-time availability and secure your preferred slot.",
      icon: "🏌️"
    },
    {
      title: "Driving Range Sessions",
      description: "Practice your swing at our state-of-the-art driving range. Track your ball buckets and equipment rentals.",
      icon: "🎯"
    },
    {
      title: "Membership Benefits",
      description: "Join our exclusive membership program for discounts, priority booking, and special member events.",
      icon: "⭐"
    },
    {
      title: "Course Conditions",
      description: "Stay updated with daily green conditions, weather information, and course maintenance schedules.",
      icon: "🌿"
    },
    {
      title: "Digital Scorecard",
      description: "Keep track of your games digitally and view your handicap progression over time.",
      icon: "📊"
    },
    {
      title: "Pro Shop Online",
      description: "Browse and purchase golf equipment, apparel, and accessories from our online pro shop.",
      icon: "🛍️"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for the Perfect Golf Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From booking tee times to tracking your progress, GolfEzz provides all the tools you need to enjoy golf to the fullest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="golf-card p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
