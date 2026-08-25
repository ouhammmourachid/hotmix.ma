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

import Link from "next/link"
import styles from "@/styles/main.module.css"
import useAuth from "@/hooks/useAuth"
import HotmixLogo from "@/components/hotmix-logo"
import { useTranslation } from "@/lib/i18n-utils"

import { useRef, useState, useEffect } from 'react'
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const { t } = useTranslation();
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
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-3">
          <Link
            href="/"
            className={styles.sign_in_up_logo}>
            <HotmixLogo className="h-6 sm:h-7 max-w-full text-greny w-auto" />
          </Link>
        </div>
        <CardTitle className="text-2xl">
          {step === 'email' ? t('auth_signin_title') : t('auth_enter_code_title')}
        </CardTitle>
        <CardDescription >
          {step === 'email'
            ? t('auth_choose_signin')
            : t('auth_sent_to', { email })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="text-red-500 mb-4 text-center" ref={errRef} role="alert">
              {errorMessage}
            </div>
          )}
          <div className="flex flex-col gap-6">
            {step === 'email' ? (
              <div className="grid gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder={t('profile_email')}
                  className={`${styles.login_form_input} h-12`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  ref={userRef}
                  required
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Input
                  id="otp"
                  type="text"
                  placeholder={t('auth_otp_placeholder')}
                  className={`${styles.login_form_input} h-12`}
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
              className="w-full bg-greny hover:bg-greny/85 text-black h-12 text-base font-medium rounded-sm"
              disabled={isLoading}>
              {isLoading
                ? <Loader2 className="h-6 w-6 animate-spin" />
                : (step === 'email' ? t('auth_continue') : t('auth_submit'))}
            </Button>

            {step === 'otp' && (
              <Button
                type="button"
                variant="link"
                className="text-greny hover:text-greny/80 p-0 h-auto font-normal justify-start"
                onClick={() => setStep('email')}
                disabled={isLoading}
              >
                {t('auth_different_email')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
