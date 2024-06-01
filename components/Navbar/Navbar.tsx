"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { Button } from "components/Button/Button"
import AuthProviders from "components/ProvidersComponents/AuthProviders"
import { Skeleton } from "@mui/material"

const Navbar = () => {
  const session = null
  const [loading, setLoading] = useState(true)
  setTimeout(() => setLoading(false), 3000)
  return (
    <nav className="flexBetween navbar">
      <div className=" gap-7">
        {loading == false ? (
          <>
            <Link href="/" className="icon-style content-center">
              <Image src="/ic_logo.svg" width={115} height={43} alt="dekalo" />
            </Link>
            <Link href="/" className="dark-icon-style content-center">
              <Image src="/dark_logo.svg" width={115} height={43} alt="dekalo" />
            </Link>
          </>
        ) : (
          <Skeleton variant="rounded" height={29} width={92} />
        )}
      </div>

      <div className="flexCenter gap-4">
        {session ? (
          <>
            UserPhoto
            <Button href="https://github.com/Blazity/next-enterprise" className="mr-3">
              go to dashboard
            </Button>
          </>
        ) : (
          <AuthProviders />
        )}
      </div>
    </nav>
  )
}

export default Navbar
