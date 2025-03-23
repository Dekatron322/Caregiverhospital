"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { FiSun } from "react-icons/fi"
import { IoMdGlobe } from "react-icons/io"
import { IoMoonOutline } from "react-icons/io5"

const Footer = () => {
  const [isMoonIcon, setIsMoonIcon] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const toggleIcon = () => {
    setIsMoonIcon(!isMoonIcon)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return (
    <div className="sidebar mt-auto flex justify-between border-t max-md:hidden">
      <div className="flex gap-6 px-16 py-4">
        <Link href="/" className="text-xs font-bold">
          Privacy Policy
        </Link>
        <Link href="/" className="text-xs font-bold">
          Help Center
        </Link>
        <Link href="/" className="text-xs font-bold">
          License
        </Link>

        <p className="text-xs text-[#747A80]">© 2024 All rights reserved</p>
      </div>
      <div className="flex items-center gap-6 px-16 py-4">
        <div className="cursor-pointer rounded border p-1 transition duration-300" onClick={toggleIcon}>
          {isMoonIcon ? (
            <IoMoonOutline onClick={() => setTheme("light")} />
          ) : (
            <FiSun onClick={() => setTheme("dark")} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Footer
function setMounted(arg0: boolean) {
  throw new Error("Function not implemented.")
}
