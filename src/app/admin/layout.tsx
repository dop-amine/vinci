/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './importMap.js'
import './custom.scss'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

// Override the default layout to prevent nested HTML tags
export default function Layout({ children }: Args) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
          {children}
        </RootLayout>
      </body>
    </html>
  )
}
