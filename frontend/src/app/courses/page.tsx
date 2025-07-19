"use client";

import { useState, useEffect } from 'react';
import { Course } from '@/types/api';
import { CourseService } from '@/lib/services/course.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Star, Users, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await CourseService.getCourses();
      if (response.success && response.data) {
        setCourses(response.data.data || []);
      } else {
        setError('Failed to load courses');
        setCourses([]); // Ensure courses is always an array
      }
    } catch (err) {
      setError('Failed to load courses');
      setCourses([]); // Ensure courses is always an array
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = (courses || []).filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Golf Courses</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover premier golf courses and book your perfect tee time
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search courses by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center text-red-600 mb-8">
          <p>{error}</p>
          <Button onClick={fetchCourses} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {course.image && (
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{course.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {course.address}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{course.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span>{course.holes} holes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>Par {course.par}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>${course.green_fee_weekday}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span>{course.phone}</span>
                </div>
              </div>

              {course.amenities && course.amenities.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {course.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {course.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link href={`/courses/${course.id}`}>
                    View Details & Book
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MapPin className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search terms' : 'No courses available at the moment'}
          </p>
        </div>
      )}
    </div>
  );
}
