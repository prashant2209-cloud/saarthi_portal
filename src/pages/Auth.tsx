import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Sync tab with URL
  useEffect(() => {
    if (location.pathname.includes('register')) {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'login') {
      navigate('/auth/login');
    } else {
      navigate('/auth/register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/30 blur-[100px] animate-float" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/20 blur-[80px] animate-float-delayed" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/30 blur-[100px] animate-float-slow" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white tracking-tight drop-shadow-sm animate-pulse">
            Welcome to SAARTHI
          </h2>
          <p className="mt-2 text-lg text-blue-100 font-medium drop-shadow-sm">
            Your civic engagement platform
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-white/20 shadow-2xl rounded-2xl overflow-hidden hover:shadow-blue-500/20 hover:scale-[1.01] transition-all duration-300">
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              {activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300 font-medium">
              {activeTab === 'login'
                ? 'Enter your details to access your account'
                : 'Join us to make a difference in your community'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <SignIn
                  routing="path"
                  path="/auth/login"
                  signUpUrl="/auth/register"
                  forceRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0 bg-transparent p-0 w-full",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formButtonPrimary: "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25 border-0",
                      formFieldInput: "rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50",
                      socialButtonsBlockButton: "rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200",
                      dividerLine: "bg-gray-200",
                      dividerText: "text-gray-400",
                      footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                    },
                    layout: {
                      socialButtonsPlacement: "top",
                      socialButtonsVariant: "blockButton",
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <SignUp
                  routing="path"
                  path="/auth/register"
                  signInUrl="/auth/login"
                  forceRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-0 bg-transparent p-0 w-full",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formButtonPrimary: "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25 border-0",
                      formFieldInput: "rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50",
                      socialButtonsBlockButton: "rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200",
                      dividerLine: "bg-gray-200",
                      dividerText: "text-gray-400",
                      footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                    },
                    layout: {
                      socialButtonsPlacement: "top",
                      socialButtonsVariant: "blockButton",
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-blue-100 hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
