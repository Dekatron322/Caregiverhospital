"use client"
import Link from "next/link"
import React from "react"

const AuthProviders = () => {
  return (
    <>
      <div className="flex  content-center ">
        <Link href="/signin/patient" className="mr-3 content-center text-base font-medium text-[#46FFA6] max-sm:hidden">
          Patient
        </Link>
      </div>
    </>
  )
}

export default AuthProviders
