"use client"
import { Skeleton, Tooltip } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import { MdAccountCircle } from "react-icons/md"
import { RiLogoutCircleRLine } from "react-icons/ri"
import { BiMessageDetail } from "react-icons/bi"
import { IoIosArrowDown, IoIosNotificationsOutline, IoMdAddCircleOutline, IoMdLock, IoMdSearch } from "react-icons/io"
import LogoutModal from "components/Modals/LogoutModal"
import Search from "components/Search/Search"
import Link from "next/link"
import { RxCross2 } from "react-icons/rx"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"

interface UserDetails {
  id: number
  name: string
  email_address: string
  phone_no: string
  address: string
  account_type: string
}

const PatientNav: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isMoonIcon, setIsMoonIcon] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const toggleIcon = () => {
    setIsMoonIcon(!isMoonIcon)
  }

  useEffect(() => {
    setMounted(true)
    fetchUserDetails()
  }, [])

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("id")
      if (userId) {
        const response = await axios.get<UserDetails>(
          `https://api2.caregiverhospital.com/patient/patient/get/detail/${userId}/`
        )
        if (response.data) {
          setUserDetails(response.data)
        } else {
          setError("User details not found.")
          router.push("/signin")
        }
      } else {
        setError("User ID not found.")
        router.push("/signin")
      }
    } catch (error) {
      setError("Failed to load user details.")
      console.error("Error fetching user details:", error)
      router.push("/signin")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsNavOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen, isNavOpen])

  if (!mounted) {
    return null
  }

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  //       setIsDropdownOpen(false)
  //     }
  //   }

  //   if (isDropdownOpen) {
  //     document.addEventListener("mousedown", handleClickOutside)
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside)
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside)
  //   }
  // }, [isDropdownOpen])

  // if (!mounted) {
  //   return null
  // }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const handleProfileClick = () => {
    toggleDropdown()
  }

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
    closeDropdown() // Close the dropdown when the logout is clicked
  }

  const handleLogoutConfirm = () => {
    localStorage.removeItem("id")
    localStorage.removeItem("token")

    router.push("/signin")
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false)
  }

  const getNavLinkClass = (path: string) => {
    return pathname === path ? "text-[#46ffa6]" : "text-white"
  }

  const getNavImageSrc = (path: string, defaultSrc: string, activeSrc: string) => {
    return pathname === path ? activeSrc : defaultSrc
  }

  const isDashboardPage = pathname.includes("/dashboard")

  const firstLetter = userDetails?.name.charAt(0).toUpperCase() || "M"

  return (
    <>
      <nav className="hidden border-b px-16 py-4 md:block">
        <div className="flex items-center justify-between">
          <h5 className="font-bold capitalize">Patient Dashboard</h5>

          <div className="flex items-center gap-2">
            <Search />
          </div>
          <div className="flex items-center gap-2">
            <Tooltip title="Notifications">
              <div className="flex h-8 cursor-pointer items-center rounded border border-[#CFDBD5] px-2 py-1">
                <IoIosNotificationsOutline />
              </div>
            </Tooltip>

            <Tooltip title="messages">
              <div className="flex h-8 cursor-pointer items-center rounded border border-[#CFDBD5] px-2 py-1">
                <BiMessageDetail />
              </div>
            </Tooltip>

            <div className="flex cursor-pointer items-center gap-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]"
                onClick={handleProfileClick}
              >
                <p className="text-[#000000]">{firstLetter}</p>
              </div>
              <IoIosArrowDown onClick={handleProfileClick} />
            </div>
          </div>
        </div>
      </nav>
      <nav className="block border-b px-16 py-4 max-md:px-3 md:hidden">
        <div className="flex items-center justify-between">
          <FormatAlignLeftIcon onClick={toggleNav} style={{ cursor: "pointer" }} />
          <Link href="/" className="icon-style content-center">
            <Image src="/ic_logo.svg" width={150} height={43} alt="dekalo" />
          </Link>
          <Link href="/" className="dark-icon-style content-center">
            <Image src="/dark_logo.svg" width={150} height={43} alt="dekalo" />
          </Link>
          <div className="redirect flex h-[50px] items-center justify-center gap-1 rounded-full px-1">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]"
              onClick={handleProfileClick}
            >
              <p className="text-[#000000]">{firstLetter}</p>
            </div>
            <KeyboardArrowDownIcon />
          </div>
        </div>

        <div
          ref={navRef}
          className={`fixed left-0 top-0 z-50 h-full w-[250px] bg-[#044982] transition-transform duration-300 ${
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 pt-6">
            <Image className="" src="/alternate.svg" height={80} width={80} alt="" />
            <RxCross2 className="text-white" onClick={toggleNav} style={{ cursor: "pointer" }} />
          </div>
          <div className="mt-4 flex flex-col items-start space-y-2 p-4">
            <Link
              href="/patient-dashboard"
              className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/patient-dashboard")}`}
            >
              <Image
                src={getNavImageSrc("/patient-dashboard", "/Graph.svg", "/Graph-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Dashboard</p>
            </Link>

            <button
              onClick={handleLogoutClick}
              className="fixed bottom-2 mt-10 flex items-center gap-2 pb-4 text-white"
            >
              <Image src="/logout.svg" width={20} height={20} alt="logout" />
              <p className="mt-1">Logout</p>
            </button>
          </div>
        </div>
      </nav>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="auth absolute right-16 top-14 z-10 w-64 rounded border shadow-md transition-opacity duration-300"
        >
          <div className="border-b px-4 py-2">
            <div className="flex items-center gap-2">
              <MdAccountCircle />
              <p className="text-sm font-semibold">Account Information</p>
            </div>
            {loading ? (
              <Skeleton variant="text" width={120} />
            ) : error ? (
              <small className="text-red-500">{error}</small>
            ) : userDetails ? (
              <>
                <p className="text-xs">{userDetails.name}</p>
                <p className="text-xs">{userDetails.email_address}</p>
                <p className="text-xs">{userDetails.phone_no}</p>
              </>
            ) : (
              <small className="text-red-500">No user details found.</small>
            )}
          </div>
          <div className="flex items-center gap-2 border-b px-4 py-2" onClick={handleLogoutClick}>
            <RiLogoutCircleRLine />
            <p className="cursor-pointer text-sm font-semibold">Logout</p>
          </div>
          <div className="flex items-center gap-2 border-b px-4 py-2" onClick={closeDropdown}>
            <IoMdLock />
            <p className="text-sm font-semibold">Security</p>
          </div>
        </div>
      )}
      <LogoutModal open={isLogoutModalOpen} handleClose={handleLogoutCancel} handleConfirm={handleLogoutConfirm} />
    </>
  )
}

export default PatientNav
