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
  Gift,
  Diamond,
  Car,
  Utensils
} from 'lucide-react';

export default function VIPMemberDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'member' || user.membership_type !== 'vip')) {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VIP Member Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <Badge variant="default" className="bg-purple-600">
              <Diamond className="h-3 w-3 mr-1" />
              VIP Member
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">52</div>
              <p className="text-xs text-muted-foreground">
                +15 from last month
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
                6:30 AM at Platinum Course
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Handicap</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.8</div>
              <p className="text-xs text-muted-foreground">
                -3.2 this quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Points</CardTitle>
              <Diamond className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,920</div>
              <p className="text-xs text-muted-foreground">
                +450 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concierge</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24/7</div>
              <p className="text-xs text-muted-foreground">
                Personal assistant
              </p>
            </CardContent>
          </Card>
        </div>

        {/* VIP Exclusive Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Diamond className="h-4 w-4 mr-2 text-purple-600" />
                VIP Booking
              </CardTitle>
              <CardDescription>Exclusive course access and prime times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Calendar className="h-4 w-4 mr-2" />
                Book VIP Slot
              </Button>
              <p className="text-sm text-muted-foreground">
                30-day advance booking, any course, any time
              </p>
            </CardContent>
          </Card>

          <Card className="border-gold-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-4 w-4 mr-2 text-yellow-600" />
                Valet Service
              </CardTitle>
              <CardDescription>Complimentary car and equipment service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Car className="h-4 w-4 mr-2" />
                Request Valet
              </Button>
              <p className="text-sm text-muted-foreground">
                Club cleaning, cart service, and parking included
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-green-600" />
                Private Dining
              </CardTitle>
              <CardDescription>Access to VIP clubhouse facilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Utensils className="h-4 w-4 mr-2" />
                Reserve Table
              </Button>
              <p className="text-sm text-muted-foreground">
                Private dining room and personal chef service
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                Personal Pro
              </CardTitle>
              <CardDescription>Dedicated golf instructor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
              <p className="text-sm text-muted-foreground">
                Weekly sessions with PGA professional
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>VIP Schedule</CardTitle>
                <CardDescription>Your exclusive bookings and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg bg-purple-50">
                    <div className="flex-1">
                      <p className="font-medium">Platinum Championship Course</p>
                      <p className="text-sm text-muted-foreground">Today, 6:30 AM • 4 players • VIP Cart</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="outline" className="bg-purple-100">VIP</Badge>
                        <Badge variant="outline" className="bg-green-100">Valet</Badge>
                        <Badge variant="outline" className="bg-blue-100">Dining</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">Private Lesson with Pro Johnson</p>
                      <p className="text-sm text-muted-foreground">Tomorrow, 8:00 AM • 1-on-1 Session</p>
                    </div>
                    <Badge>Confirmed</Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">VIP Tournament Invitation</p>
                      <p className="text-sm text-muted-foreground">July 25, All Day • Members Only Event</p>
                    </div>
                    <Badge variant="secondary">Invited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>VIP Privileges</CardTitle>
                <CardDescription>Your exclusive benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Diamond className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Unlimited Access</p>
                      <p className="text-sm text-muted-foreground">All courses, any time</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Valet Service</p>
                      <p className="text-sm text-muted-foreground">Complimentary car & club service</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Utensils className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Private Dining</p>
                      <p className="text-sm text-muted-foreground">VIP clubhouse access</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Personal Pro</p>
                      <p className="text-sm text-muted-foreground">Dedicated instructor</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">24/7 Concierge</p>
                      <p className="text-sm text-muted-foreground">Personal assistant service</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Bell className="h-4 w-4 mr-2" />
                  Call Concierge
                </Button>
                <Button variant="outline" className="w-full">
                  <Car className="h-4 w-4 mr-2" />
                  Request Valet
                </Button>
                <Button variant="outline" className="w-full">
                  <Utensils className="h-4 w-4 mr-2" />
                  Reserve Dining
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
