"use client"
import Image from "next/image"
import Link from "next/link"
import React from "react"

import AuthProviders from "components/ProvidersComponents/AuthProviders"

const Navbar = () => {
  const session = null

  return (
    <nav className="flexBetween navbar">
      <div className=" gap-7">
        <>
          <Link href="/" className=" content-center">
            <Image src="/dark_logo.svg" width={115} height={43} alt="dekalo" />
          </Link>
        </>
      </div>

      <div className="flexCenter gap-4">
        {session ? (
          <>
            <Link
              href="/signin/patient"
              className="mr-3 content-center text-base font-medium text-[#46FFA6] max-sm:hidden"
            >
              Patient
            </Link>
          </>
        ) : (
          <AuthProviders />
        )}
      </div>
    </nav>
  )
}

export default Navbar
