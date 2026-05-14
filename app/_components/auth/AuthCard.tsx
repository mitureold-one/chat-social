'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/_components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/_components/ui/card'

type AuthCardProps = {
  title: string
  description: string
  error?: string
  submitLabel: string
  loadingLabel: string
  loading: boolean
  footerLinkHref: string
  footerLinkLabel: string
  footerPrefix: string
  onSubmit: () => void
  children: ReactNode
}

export function AuthCard({
  title,
  description,
  error,
  submitLabel,
  loadingLabel,
  loading,
  footerLinkHref,
  footerLinkLabel,
  footerPrefix,
  onSubmit,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-sm border border-neutral-200 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">💬</span>
          <h1 className="text-xl font-bold tracking-tight">Chat Social</h1>
        </div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form
        onSubmit={e => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <CardContent className="space-y-3">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          {children}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? loadingLabel : submitLabel}
          </Button>
          <p className="text-sm text-neutral-500">
            {footerPrefix}{' '}
            <Link href={footerLinkHref} className="text-black font-medium hover:underline">
              {footerLinkLabel}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}