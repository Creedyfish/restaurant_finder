'use client'
import React from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export const Providers = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </QueryClientProvider>
  )
}
