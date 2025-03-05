'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { FcGoogle } from "react-icons/fc";
import RegisterForm from '@/components/RegisterForm';
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="container mx-auto flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Choose your preferred sign up method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {/* Add Google auth logic */}}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <RegisterForm />

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 