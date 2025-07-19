"use client";

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Logo from '@/components/ui/logo';
import { Loader2, User, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { getDashboardUrl } from '@/lib/auth-utils';
import type { User as UserType } from '@/types/api';

export default function SignInPage() {
  const [memberForm, setMemberForm] = useState({ email: '', password: '' });
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState({ member: false, admin: false });
  const [isLoading, setIsLoading] = useState({ member: false, admin: false });
  const [error, setError] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

  const handleCredentialsSignIn = async (userType: 'member' | 'admin') => {
    const form = userType === 'member' ? memberForm : adminForm;
    
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(prev => ({ ...prev, [userType]: true }));
    setError('');

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        expectedRole: userType, // Pass the expected role
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || 'Invalid email or password');
      } else if (result?.ok) {
        const session = await getSession();
        if (session?.user) {
          // Use the proper dashboard routing function
          const dashboardUrl = getDashboardUrl(session.user as UserType);
          router.push(dashboardUrl);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, [userType]: false }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl">Sign In to GolfEzz</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {(error || errorParam) && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error || errorParam}</AlertDescription>
            </Alert>
          )}

          {/* Email/Password Sign-in Tabs */}
          <Tabs defaultValue="member" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="member" className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Member</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="member" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="member-email">Email</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isLoading.member}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="member-password">Password</Label>
                <div className="relative">
                  <Input
                    id="member-password"
                    type={showPassword.member ? "text" : "password"}
                    value={memberForm.password}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isLoading.member}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(prev => ({ ...prev, member: !prev.member }))}
                  >
                    {showPassword.member ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={() => handleCredentialsSignIn('member')}
                className="w-full" 
                disabled={isLoading.member}
              >
                {isLoading.member && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In as Member
              </Button>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isLoading.admin}
                  placeholder="Enter admin email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword.admin ? "text" : "password"}
                    value={adminForm.password}
                    onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isLoading.admin}
                    placeholder="Enter admin password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(prev => ({ ...prev, admin: !prev.admin }))}
                  >
                    {showPassword.admin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={() => handleCredentialsSignIn('admin')}
                className="w-full bg-red-600 hover:bg-red-700" 
                disabled={isLoading.admin}
              >
                {isLoading.admin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In as Admin
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 mb-2">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-green-600 hover:underline">
                Sign up as Member
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              Admin accounts are created by system administrators
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
