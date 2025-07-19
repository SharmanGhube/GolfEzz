"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  Calendar,
  Users
} from "lucide-react";
import Logo from "@/components/ui/logo";
import { CourseService } from "@/lib/services/course.service";
import { Course } from "@/types/api";

const features = [
  {
    icon: Clock,
    title: "Course Management",
    description: "Comprehensive golf course information including green conditions, hazards, and hole details.",
  },
  {
    icon: Star,
    title: "Tee Time Booking",
    description: "Easy-to-use booking system with real-time availability and instant confirmations.",
  },
  {
    icon: MapPin,
    title: "Driving Range",
    description: "Manage range access, ball bucket inventory, and practice session bookings.",
  },
  {
    icon: Users,
    title: "Member Management",
    description: "Complete member portal with profiles, preferences, and booking history.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Live course conditions, weather updates, and instant booking notifications.",
  },
  {
    icon: Star,
    title: "Premium Experience",
    description: "Professional-grade interface designed for golf clubs and their members.",
  },
];

const benefits = [
  "Multi-course support",
  "Secure email authentication", 
  "Mobile-responsive design",
  "Real-time notifications",
  "Advanced analytics",
  "Payment integration ready",
];

export default function HomePage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await CourseService.getCourses();
        if (response.success && response.data) {
          setCourses(response.data.data.slice(0, 3)); // Show first 3 courses
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Logo size="xl" variant="white" className="mb-4" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Professional Golf Course
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-green-100">
              Streamline your golf course operations with our comprehensive management platform. 
              From tee time bookings to member management, we've got you covered.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              {session ? (
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/auth/register" className="flex items-center space-x-2">
                      <span>Get Started</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Golf Courses
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Discover our premium golf courses with world-class facilities and amenities
            </p>
          </div>
          
          {loading ? (
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {course.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {course.address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {course.holes} holes
                      </span>
                      <span className="font-semibold text-green-600">
                        ${course.green_fee_weekday}
                      </span>
                    </div>
                    <Button className="w-full mt-4" asChild>
                      <Link href={`/courses/${course.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your golf course
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              From member management to real-time analytics, our platform covers all aspects of golf course operations
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <IconComponent className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Built for modern golf courses
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Our system is designed with scalability in mind, supporting everything from 
                single courses to multi-location golf club operations.
              </p>
              
              <div className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild variant="default" size="lg">
                  <Link href="/courses">
                    Explore Courses
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50 border-2 border-gray-200">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Star size={96} className="mx-auto text-green-600" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">
                      Premium Experience
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Professional golf course management at your fingertips
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to modernize your golf course?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-green-100">
              Join hundreds of golf courses already using GolfEzz to enhance their operations and member experience.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">
                  Start Your Journey
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo size="md" variant="white" showText={false} />
              <span className="text-xl font-bold text-white">GolfEzz</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 GolfEzz. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
