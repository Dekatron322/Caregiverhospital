"use client"
import Link from "next/link"
import React, { useState } from "react"
import Image from "next/image"
import { Skeleton } from "@mui/material"

const AuthProviders = () => {
  const [loading, setLoading] = useState(true)
  setTimeout(() => setLoading(false), 3000)
  return (
    <>
      {loading == false ? (
        <div className="flex  content-center ">
          <Link href="signup" className="mr-3 content-center text-base font-medium text-[#46FFA6] max-sm:hidden">
            SIGN UP
          </Link>
        </div>
      ) : (
        <>
          <Skeleton className="max-sm:hidden" variant="rounded" height={36} width={125} />
          <Skeleton className="sm:hidden" variant="rounded" height={36} width={36} />
        </>
      )}
    </>
  )
}

export default AuthProviders
