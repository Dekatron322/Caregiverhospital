"use client"
import { Popover, Skeleton, Tooltip } from "@mui/material"
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
import { RxCross2 } from "react-icons/rx"
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"
import Link from "next/link"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import useSound from "use-sound"

const NOTIFICATION_SOUND = "/notify.mp3"
const SOUND_INTERVAL = 5000 // Play sound every 5 seconds while unread exists

interface Notification {
  id: string
  title: string
  detail: string
  status: boolean
  pub_date: string
}

interface Message {
  id: string
  content: string
  is_read: boolean
  created_at: string
}

interface UserDetails {
  id: number
  username: string
  email: string
  phone_number: string
  address: string
  account_type: string
  notifications: Notification[]
}

const DoctorNav: React.FC = () => {
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
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<HTMLElement | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundInterval, setSoundInterval] = useState<NodeJS.Timeout>()

  // Sound initialization with error handling
  const [playNotificationSound, { stop: stopSound }] = useSound(NOTIFICATION_SOUND, {
    volume: 0.5,
    interrupt: true,
    onload: () => console.log("Notification sound loaded"),
    // onerror: (e) => console.error("Sound error:", e),
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const toggleIcon = () => {
    setIsMoonIcon(!isMoonIcon)
  }

  // Get current unread notifications
  const getUnreadNotifications = () => {
    return userDetails?.notifications?.filter((n) => n.status) || []
  }

  // Play sound continuously while unread exists
  const playContinuousSound = () => {
    if (!soundEnabled) return

    const unread = getUnreadNotifications()
    if (unread.length > 0) {
      try {
        playNotificationSound()
        console.log("Playing notification sound")
      } catch (error) {
        console.error("Failed to play notification sound:", error)
      }
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchUserDetails()
    startMessagePolling()

    // Start sound interval
    const interval = setInterval(() => {
      const unread = getUnreadNotifications()
      if (unread.length > 0) {
        playContinuousSound()
      }
    }, SOUND_INTERVAL)
    setSoundInterval(interval)

    return () => {
      stopSound()
      if (soundInterval) clearInterval(soundInterval)
    }
  }, [])

  // Handle sound playback when notifications change
  useEffect(() => {
    const unread = getUnreadNotifications()
    if (unread.length > 0) {
      // Play immediately when new notifications arrive
      playContinuousSound()
    }
  }, [userDetails?.notifications])

  const startMessagePolling = () => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 30000)
    return interval
  }

  const fetchMessages = async () => {
    try {
      const userId = localStorage.getItem("id")
      if (userId) {
        const response = await axios.get<Message[]>(
          `https://api2.caregiverhospital.com/app_user/get-messages/${userId}/`
        )
        if (response.data) {
          setMessages(response.data)
          const unread = response.data.some((message) => !message.is_read)
          setHasUnreadMessages(unread)
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("id")
      if (userId) {
        const response = await axios.get<UserDetails>(
          `https://api2.caregiverhospital.com/app_user/get-user-detail/${userId}/`
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

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      // Optimistically update the UI first
      if (userDetails) {
        const updatedNotifications = userDetails.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, status: false } : notification
        )

        setUserDetails({
          ...userDetails,
          notifications: updatedNotifications,
        })
      }

      // Then make the API call
      await axios.put(`https://api2.caregiverhospital.com/notification/notification/${notificationId}/`, {
        title: "Updated Notification",
        detail: "Marked as read",
        status: false,
        pub_date: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      // Revert the UI change if the API call fails
      if (userDetails) {
        setUserDetails({
          ...userDetails,
          notifications: userDetails.notifications,
        })
      }
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled && getUnreadNotifications().length > 0) {
      playContinuousSound()
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const handleProfileClick = () => {
    toggleDropdown()
  }

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
    closeDropdown()
  }

  const handleLogoutConfirm = () => {
    localStorage.removeItem("id")
    localStorage.removeItem("token")
    router.push("/signin")
  }

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false)
  }

  const isDashboardPage = pathname.includes("/dashboard")

  const firstLetter = userDetails?.username.charAt(0).toUpperCase() || "M"

  const toggleUtilities = () => {
    setIsUtilitiesOpen(!isUtilitiesOpen)
  }

  const getNavLinkClass = (path: string) => {
    return pathname === path ? "text-[#46ffa6]" : "text-white"
  }

  const getNavImageSrc = (path: string, defaultSrc: string, activeSrc: string) => {
    return pathname === path ? activeSrc : defaultSrc
  }

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const notificationOpen = Boolean(notificationAnchorEl)
  const notificationId = notificationOpen ? "notifications-popover" : undefined

  // Get only unread notifications (status: true)
  const unreadNotifications = getUnreadNotifications()

  return (
    <>
      <nav className="hidden border-b px-16 py-4 md:block">
        <div className="flex items-center justify-between">
          <h5 className="font-bold capitalize">Doctors Dashboard</h5>

          <div className="flex items-center gap-2">
            <Search />
          </div>
          <div className="flex items-center gap-2">
            <Tooltip title="Notifications">
              <div
                className={`flex h-8 cursor-pointer items-center rounded border px-2 py-1 ${
                  unreadNotifications.length > 0 ? "border-[#D82E2E] bg-[#D82E2E]" : "border-[#CFDBD5]"
                }`}
                onClick={handleNotificationClick}
              >
                <IoIosNotificationsOutline />
                {unreadNotifications.length > 0 && <span className="ml-1 text-xs">{unreadNotifications.length}</span>}
              </div>
            </Tooltip>

            <Popover
              id={notificationId}
              open={notificationOpen}
              anchorEl={notificationAnchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <div className="w-64">
                <div className="border-b pb-2">
                  <div className="flex items-center justify-between p-2">
                    <h3 className="font-semibold">Notifications</h3>
                    <button onClick={toggleSound} className="rounded bg-gray-100 px-2 py-1 text-xs">
                      {soundEnabled ? "Mute" : "Unmute"}
                    </button>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {unreadNotifications.length > 0 ? (
                    unreadNotifications.map((notification) => (
                      <div key={notification.id} className="border-b bg-[#27AE6026] px-2 py-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{notification.title}</h4>
                          <span className="text-xs text-gray-500">{formatDate(notification.pub_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">{notification.detail}</p>
                          <button
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            Mark as read
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">No new notifications</div>
                  )}
                </div>
              </div>
            </Popover>

            <Tooltip title="Messages">
              <div
                className={`flex h-8 cursor-pointer items-center rounded border px-2 py-1 ${
                  hasUnreadMessages ? "border-[#D82E2E] bg-[#D82E2E]" : "border-[#CFDBD5]"
                }`}
              >
                <BiMessageDetail />
                {hasUnreadMessages && <span className="ml-1 text-xs">!</span>}
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
              href="/doctor-dashboard"
              className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/doctor-dashboard")}`}
            >
              <Image
                src={getNavImageSrc("/doctor-dashboard", "/Graph.svg", "/Graph-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Dashboard</p>
            </Link>

            <Link
              href="/doctor-admission"
              className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/doctor-admission")}`}
            >
              <Image
                src={getNavImageSrc("/doctor-admission", "/departments.svg", "/departments-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Admissions</p>
            </Link>

            <Link
              href="/doctor-patients"
              className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/doctor-patients")}`}
            >
              <Image
                src={getNavImageSrc("/doctor-patients", "/appointments.svg", "/appointments-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Patients</p>
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
                <p className="text-xs">{userDetails.username}</p>
                <p className="text-xs">{userDetails.email}</p>
                <p className="text-xs">{userDetails.phone_number}</p>
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
      {isLogoutModalOpen && (
        <LogoutModal open={isLogoutModalOpen} handleClose={handleLogoutCancel} handleConfirm={handleLogoutConfirm} />
      )}
    </>
  )
}

export default DoctorNav
