"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { FiSun } from "react-icons/fi"
import { IoMdGlobe } from "react-icons/io"
import { IoMoonOutline } from "react-icons/io5"
import DarkMode from "public/svgs/dark-mode"
import LightMode from "public/svgs/light-mode"
import SelectDarkMode from "public/svgs/select-dark-mode"
import SelectLightMode from "public/svgs/select-light-mode"

const Footer = () => {
  const { theme, setTheme, systemTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const [isMoonIcon, setIsMoonIcon] = useState(true)

  const [mounted, setMounted] = useState(false)
  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

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
    <div className="sidebar mt-auto flex items-center justify-between border-t max-md:hidden">
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
      <div className=" flex items-center gap-6 px-16 py-4">
        <div className="cursor-pointer rounded  p-1 transition duration-300" onClick={toggleIcon}>
          <div
            className="containerbg flex w-full cursor-pointer items-center justify-between gap-2 rounded-full p-1 transition duration-300"
            onClick={toggleTheme}
            style={{
              position: "relative",
              width: "80px",
              height: "35.43px",
              borderRadius: "25px",
              backgroundColor: isDarkMode ? "#151E22" : "#f3f3f3",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SelectLightMode />
            </div>

            <div
              style={{
                position: "absolute",
                right: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SelectDarkMode />
            </div>

            <div
              style={{
                position: "absolute",
                left: isDarkMode ? "calc(100% - 35px)" : "2px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: isDarkMode ? "#000" : "#f3f3f3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "left 0.5s ease",
              }}
            >
              {isDarkMode ? <DarkMode /> : <LightMode />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
function setMounted(arg0: boolean) {
  throw new Error("Function not implemented.")
}
