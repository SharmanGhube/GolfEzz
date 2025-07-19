"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Settings,
  Star,
  Crown,
  Gift
} from 'lucide-react';

export default function PremiumMemberDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'member' || user.membership_type !== 'premium')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingGolfBall />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Premium Member Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <Badge variant="default" className="bg-yellow-500">
              <Crown className="h-3 w-3 mr-1" />
              Premium Member
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                +8 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Booking</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">
                4:00 PM at Royal Oaks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Handicap</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.4</div>
              <p className="text-xs text-muted-foreground">
                -2.1 this quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rewards Points</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,450</div>
              <p className="text-xs text-muted-foreground">
                +150 this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Priority Booking</CardTitle>
              <CardDescription>Book prime tee times 14 days in advance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Book Priority Slot
              </Button>
              <p className="text-sm text-muted-foreground">
                Access to premium time slots before basic members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Range Access</CardTitle>
              <CardDescription>Unlimited driving range sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Book Range Time
              </Button>
              <p className="text-sm text-muted-foreground">
                Free range balls and practice sessions included
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lesson Credits</CardTitle>
              <CardDescription>Monthly pro lesson included</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Schedule Lesson
              </Button>
              <p className="text-sm text-muted-foreground">
                1 credit remaining this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tee Times</CardTitle>
              <CardDescription>Your scheduled rounds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-lg bg-yellow-50">
                  <div className="flex-1">
                    <p className="font-medium">Royal Oaks Championship</p>
                    <p className="text-sm text-muted-foreground">Today, 4:00 PM • 4 players</p>
                  </div>
                  <Badge className="bg-yellow-500">Priority</Badge>
                </div>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Pine Valley Golf Course</p>
                    <p className="text-sm text-muted-foreground">Tomorrow, 7:00 AM • 2 players</p>
                  </div>
                  <Badge>Confirmed</Badge>
                </div>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">Riverside Country Club</p>
                    <p className="text-sm text-muted-foreground">July 18, 10:00 AM • 4 players</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Member Benefits</CardTitle>
              <CardDescription>Your premium perks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Priority Booking</p>
                    <p className="text-sm text-muted-foreground">14-day advance booking</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Free Range Access</p>
                    <p className="text-sm text-muted-foreground">Unlimited practice sessions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Monthly Lesson</p>
                    <p className="text-sm text-muted-foreground">1 pro lesson included</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Gift className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Rewards Program</p>
                    <p className="text-sm text-muted-foreground">Earn points on every booking</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
