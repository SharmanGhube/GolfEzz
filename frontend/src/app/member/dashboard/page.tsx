"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingGolfBall } from '@/components/ui/golf-icons';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Target, 
  TrendingUp, 
  Bell,
  CreditCard,
  User,
  Settings
} from 'lucide-react';

interface MemberStats {
  totalBookings: number;
  upcomingBookings: number;
  favoriteCourseName: string;
  averageScore: number;
  membershipStatus: string;
  membershipExpiry: string;
}

interface UpcomingBooking {
  id: string;
  courseName: string;
  date: string;
  time: string;
  players: number;
  status: string;
}

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'member') {
      router.push('/admin/dashboard');
      return;
    }

    fetchMemberData();
  }, [session, status, router]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      
      // Fetch member stats
      const statsResponse = await fetch('/api/member/stats', {
        headers: {
          'Authorization': `Bearer ${session?.user?.id}`,
        },
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch upcoming bookings
      const bookingsResponse = await fetch('/api/member/bookings/upcoming', {
        headers: {
          'Authorization': `Bearer ${session?.user?.id}`,
        },
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setUpcomingBookings(bookingsData);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingGolfBall />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {session?.user?.name}!
              </h1>
              <p className="text-gray-600">Manage your golf activities and bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={stats?.membershipStatus === 'active' ? 'default' : 'secondary'}>
                {stats?.membershipStatus || 'Basic'} Member
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.upcomingBookings || 0}</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Course</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold truncate">{stats?.favoriteCourseName || 'None yet'}</div>
              <p className="text-xs text-muted-foreground">Most booked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Handicap</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageScore || '--'}</div>
              <p className="text-xs text-muted-foreground">Current</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Your scheduled tee times and range sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{booking.courseName}</p>
                            <p className="text-sm text-gray-600">
                              {booking.date} at {booking.time} • {booking.players} players
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming bookings</p>
                    <Button className="mt-4" onClick={() => router.push('/booking')}>
                      Book Tee Time
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Membership Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  onClick={() => router.push('/booking')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Tee Time
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/range')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Book Range
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/courses')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/member/history')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </CardContent>
            </Card>

            {/* Membership Info */}
            <Card>
              <CardHeader>
                <CardTitle>Membership Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={stats?.membershipStatus === 'active' ? 'default' : 'secondary'}>
                    {stats?.membershipStatus || 'Basic'}
                  </Badge>
                </div>
                
                {stats?.membershipExpiry && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Expires</span>
                    <span className="text-sm text-gray-600">{stats.membershipExpiry}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade Membership
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-4 w-4 text-blue-500 mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">Booking Confirmed</p>
                      <p className="text-gray-600">Your tee time for tomorrow has been confirmed.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Bell className="h-4 w-4 text-green-500 mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">Course Conditions Updated</p>
                      <p className="text-gray-600">Pine Valley course conditions have been updated.</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
