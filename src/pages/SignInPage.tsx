"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import "./SignInPage.css";

const FloatingGeometrySystem: React.FC = () => {
  const geometryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (geometryRef.current) {
        const parallax = window.pageYOffset * 0.2;
        geometryRef.current.style.transform = `translateY(${parallax}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={geometryRef} className="floating-geometry-system">
      <div className="floating-geometry triangle-1 animate-float-complex-1" />
      <div className="floating-geometry circle-1 animate-float-complex-2" />
      <div className="floating-geometry square-1 animate-float-complex-3" />
      <div className="floating-geometry hexagon-1 animate-float-complex-4" />
      <div className="floating-geometry diamond-1 animate-float-complex-5" />
      <div className="floating-geometry triangle-2 animate-float-complex-6" />
      <div className="floating-geometry circle-2 animate-float-complex-7" />
      <div className="grid-pattern animate-grid-pulse" />
      <div className="scan-line scan-horizontal animate-scan-h" />
      <div className="scan-line scan-vertical animate-scan-v" />
      <div className="energy-orb orb-1 animate-orb-path-1" />
      <div className="energy-orb orb-2 animate-orb-path-2" />
      <div className="energy-orb orb-3 animate-orb-path-3" />
    </div>
  );
};

const SignInPage: React.FC = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      toast({ title: "Login Successful", description: "Welcome back!", variant: "default" });
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-bg">
      <FloatingGeometrySystem />
      <Card className="signin-card">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <p className="subtitle">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            variant="outline"
            className="btn-google"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="icon-google" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
          <div className="separator-wrapper">
            <Separator />
            <span className="separator-text">Or continue with</span>
          </div>
          <form onSubmit={handleEmailSignIn} className="form">
            <div className="form-group">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="signup-text">
            Don't have an account? <Link to="/signup" className="link-signup">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
