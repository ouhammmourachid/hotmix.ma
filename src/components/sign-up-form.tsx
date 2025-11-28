"use client"
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
import { useState, useEffect } from "react"
import useAuth from "@/hooks/useAuth"
import { useApiService } from "@/services/api.service"

export function SignUpForm() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [formError, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const { setAuth } = useAuth();
  const api = useApiService();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await api.auth.signUp(JSON.stringify({
        email: formState.email,
        password: formState.password,
        username: formState.email,
      }));
      window.location.href = "/login";
    } catch (error:any) {
      setError({
        ...formError,
        email: error.response?.data?.email?.[0] || "An error occurred during signup",
      })
      setFormState({
        ...formState,
        email: "",
      })
    }
  }

  useEffect(() => {
    if (formState.password !== formState.confirmPassword) {
      setError({
        ...formError,
        confirmPassword: "Passwords do not match",
      })
    } else {
      setError({
        ...formError,
        confirmPassword: "",
      })
    }
  }, [formState])

  const handleEmailChange = (e:any ) => {
    setFormState(prev => ({ ...prev, email: e.target.value }))
    setError(prev => ({ ...prev, email: "" }))
  }

  return (
  <Card className={styles.sign_up_form}>
    <CardHeader>
      <Link
        href="/"
        className={styles.sign_in_up_logo}>
          MISSJANNAT
      </Link>
      <CardTitle className="text-2xl">Sign up</CardTitle>
      <CardDescription>
        Enter your email below to create an account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form
        onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formState.email}
              placeholder="m@example.com"
              className={styles.sign_up_input}
              onChange={handleEmailChange}
              required
            />
            <span
              className="text-red-300 text-sm">
              {formError.email}
            </span>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={formState.password}
              className={styles.sign_up_input}
              onChange={(e) => setFormState({ ...formState, password: e.target.value })}
              required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="confirmPassword">Confirm password</Label>
            </div>
            <Input
              id="confirmPassword"
              className={styles.sign_up_input}
              value={formState.confirmPassword}
              type="password"
              onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
              required />
              <span
                className="text-red-300 text-sm">
                {formError.confirmPassword}
              </span>
          </div>
          <Button
            type="submit"
            disabled={formError.confirmPassword !== ""}
            className="w-full bg-primary">
            Sign up
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4 hover:text-greny">
            Login
          </a>
        </div>
      </form>
    </CardContent>
  </Card>
  )
}
