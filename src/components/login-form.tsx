"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import styles from "@/styles/main.module.css"
import useAuth from "@/hooks/useAuth"
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'

export function LoginForm() {
  const router = useRouter();
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);
  const { requestOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
  const [errorMessage, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, otp]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMsg('');

    try {
      if (step === 'email') {
        const response = await requestOtp(email);
        if (response.otpId) {
          setOtpId(response.otpId);
          setStep('otp');
        } else {
          setErrMsg('Failed to get OTP ID. Please try again.');
        }
      } else {
        await verifyOtp(otpId, otp);
        // verifyOtp handles redirection
      }
    } catch (err: any) {
      if (step === 'email') {
        setErrMsg(err?.message || 'Failed to send verification code. Please try again.');
      } else {
        setErrMsg(err?.message || 'Invalid code. Please try again.');
      }
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.login_form}>
      <CardHeader>
        <Link
          href="/"
          className={styles.sign_in_up_logo}>
          HOTMIX
        </Link>
        <CardTitle className="text-2xl">
          {step === 'email' ? 'Log in / Sign up' : 'Enter Code'}
        </CardTitle>
        <CardDescription>
          {step === 'email'
            ? 'Enter your email to continue'
            : `We sent a code to ${email}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="text-red-500 mb-4" ref={errRef} role="alert">
              {errorMessage}
            </div>
          )}
          <div className="flex flex-col gap-6">
            {step === 'email' ? (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className={styles.login_form_input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  ref={userRef}
                  required
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="otp">Verification Code / Token</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Paste the code from email"
                  className={styles.login_form_input}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary"
              disabled={isLoading}>
              {isLoading
                ? 'Processing...'
                : (step === 'email' ? 'Send Code' : 'Verify & Login')}
            </Button>

            {step === 'otp' && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('email')}
                disabled={isLoading}
              >
                Back to Email
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
