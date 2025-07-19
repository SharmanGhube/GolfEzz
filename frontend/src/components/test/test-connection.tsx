/**
 * Test Connection Component
 * Demonstrates frontend-backend API integration
 */

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';
import { CourseService } from '@/lib/services/course.service';
import apiClient from '@/lib/api-client';

interface ConnectionStatus {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
  latency?: number;
}

export default function TestConnection() {
  const [apiStatus, setApiStatus] = useState<ConnectionStatus>({
    status: 'idle',
    message: 'Ready to test connection'
  });
  
  const [coursesStatus, setCoursesStatus] = useState<ConnectionStatus>({
    status: 'idle',
    message: 'Ready to test courses API'
  });

  const testApiConnection = async () => {
    setApiStatus({ status: 'testing', message: 'Testing API connection...' });
    const startTime = Date.now();
    
    try {
      // Test basic API health endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        setApiStatus({
          status: 'success',
          message: 'API connection successful!',
          latency
        });
      } else {
        setApiStatus({
          status: 'error',
          message: `API responded with status: ${response.status}`
        });
      }
    } catch (error) {
      setApiStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  };

  const testCoursesAPI = async () => {
    setCoursesStatus({ status: 'testing', message: 'Testing courses API...' });
    const startTime = Date.now();
    
    try {
      const response = await CourseService.getCourses();
      const latency = Date.now() - startTime;
      
      if (response.success) {
        setCoursesStatus({
          status: 'success',
          message: `Courses API working! Found ${response.data?.data?.length || 0} courses`,
          latency
        });
      } else {
        setCoursesStatus({
          status: 'error',
          message: response.error || 'Courses API failed'
        });
      }
    } catch (error) {
      setCoursesStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Courses API failed'
      });
    }
  };

  const getStatusIcon = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'testing':
        return <Badge variant="outline">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Ready</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Backend Connection Test
          </CardTitle>
          <CardDescription>
            Test the connection between frontend and backend services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Frontend URL:</strong> {window.location.origin}</p>
            <p><strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
          </div>
        </CardContent>
      </Card>

      {/* API Health Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {getStatusIcon(apiStatus.status)}
              API Health Check
            </span>
            {getStatusBadge(apiStatus.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{apiStatus.message}</p>
          {apiStatus.latency && (
            <p className="text-xs text-muted-foreground">
              Response time: {apiStatus.latency}ms
            </p>
          )}
          <Button 
            onClick={testApiConnection}
            disabled={apiStatus.status === 'testing'}
            className="w-full"
          >
            {apiStatus.status === 'testing' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test API Connection'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Courses API Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {getStatusIcon(coursesStatus.status)}
              Courses API Test
            </span>
            {getStatusBadge(coursesStatus.status)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{coursesStatus.message}</p>
          {coursesStatus.latency && (
            <p className="text-xs text-muted-foreground">
              Response time: {coursesStatus.latency}ms
            </p>
          )}
          <Button 
            onClick={testCoursesAPI}
            disabled={coursesStatus.status === 'testing'}
            className="w-full"
            variant="outline"
          >
            {coursesStatus.status === 'testing' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Courses API'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Connection Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">API Health:</p>
              <p className={`text-sm ${
                apiStatus.status === 'success' ? 'text-green-600' : 
                apiStatus.status === 'error' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {apiStatus.status === 'success' ? '✓ Connected' : 
                 apiStatus.status === 'error' ? '✗ Failed' : '- Not tested'}
              </p>
            </div>
            <div>
              <p className="font-medium">Courses API:</p>
              <p className={`text-sm ${
                coursesStatus.status === 'success' ? 'text-green-600' : 
                coursesStatus.status === 'error' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {coursesStatus.status === 'success' ? '✓ Working' : 
                 coursesStatus.status === 'error' ? '✗ Failed' : '- Not tested'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
