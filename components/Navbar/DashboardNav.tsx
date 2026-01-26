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
import { useUser } from "contexts/UserContext"
import { UserDetails } from "types/user"

const NOTIFICATION_SOUND = "/notify.mp3"
const SOUND_INTERVAL = 5000 // Play sound every 5 seconds while unread exists

const DashboardNav: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { userDetails: contextUserDetails, loading: contextLoading, error: contextError, clearUserDetails } = useUser()
  const [mounted, setMounted] = useState(false)

  // State management
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<HTMLElement | null>(null)
  const [soundInterval, setSoundInterval] = useState<NodeJS.Timeout>()
  const [lastSoundPlayTime, setLastSoundPlayTime] = useState<number>(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Sound initialization with error handling
  const [playNotificationSound, { stop: stopSound }] = useSound(NOTIFICATION_SOUND, {
    volume: 0.5,
    interrupt: true,
    onload: () => console.log("Notification sound loaded"),
    // onerror: (e) => console.error("Sound error:", e),
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  // Get current unread notifications
  const getUnreadNotifications = () => {
    return userDetails?.notifications?.filter((n) => n.status) || []
  }

  // Play sound continuously while unread exists
  const playContinuousSound = () => {
    if (!soundEnabled) return

    const unread = getUnreadNotifications()
    if (unread.length > 0) {
      const now = Date.now()
      if (now - lastSoundPlayTime > SOUND_INTERVAL - 1000) {
        // Prevent overlapping
        try {
          playNotificationSound()
          setLastSoundPlayTime(now)
          // Store in localStorage to persist across refreshes
          localStorage.setItem("hasUnreadNotifications", "true")
        } catch (error) {
          console.error("Failed to play notification sound:", error)
        }
      }
    } else {
      localStorage.removeItem("hasUnreadNotifications")
    }
  }

  // Initialize component
  useEffect(() => {
    setMounted(true)
    // Check localStorage for existing unread state
    const hasUnread = localStorage.getItem("hasUnreadNotifications") === "true"
    if (hasUnread) {
      setLastSoundPlayTime(Date.now())
    }

    // Start sound interval
    const soundIntvl = setInterval(playContinuousSound, SOUND_INTERVAL)
    setSoundInterval(soundIntvl)

    return () => {
      stopSound()
      clearInterval(soundIntvl)
    }
  }, [])

  // Update local state when context user details change
  useEffect(() => {
    if (contextUserDetails) {
      setUserDetails(contextUserDetails)
      setLoading(contextLoading)
      setError(contextError)

      // Check for existing unread notifications
      if (contextUserDetails.notifications.some((n) => n.status)) {
        playContinuousSound()
      }
    }
  }, [contextUserDetails, contextLoading, contextError])

  // Handle sound playback when notifications change
  useEffect(() => {
    const unread = getUnreadNotifications()
    if (unread.length > 0) {
      // Play immediately when new notifications arrive
      playContinuousSound()
    } else {
      // Clear last play time when all are read
      setLastSoundPlayTime(0)
      localStorage.removeItem("hasUnreadNotifications")
    }
  }, [userDetails?.notifications])

  const deleteNotification = async (notificationId: string) => {
    if (!userDetails) return

    try {
      // Optimistic update - remove the notification from the list immediately
      const updatedNotifications = userDetails.notifications.filter((n) => n.id !== notificationId)

      setUserDetails({
        ...userDetails,
        notifications: updatedNotifications,
      })

      // Call the DELETE endpoint
      await axios.delete(`https://api2.caregiverhospital.com/notification/notification/${notificationId}/`)
    } catch (error) {
      console.error("Error deleting notification:", error)
      // Revert on error - the context will handle refetching if needed
      console.error("Error deleting notification, will be handled by context")
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled && getUnreadNotifications().length > 0) {
      playContinuousSound()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (!mounted) return null

  const firstLetter = userDetails?.username.charAt(0).toUpperCase() || "U"
  const unreadNotifications = getUnreadNotifications()

  const getNavImageSrc = (path: string, defaultSrc: string, activeSrc: string) => {
    return pathname === path ? activeSrc : defaultSrc
  }

  const getNavLinkClass = (path: string) => {
    return pathname === path ? "text-[#46ffa6]" : "text-white"
  }

  return (
    <>
      <nav className="sidebar hidden border-b px-16 py-4 md:block">
        <div className="flex items-center justify-between">
          <h5 className="font-bold capitalize">Admin Dashboard</h5>

          <div className="flex items-center gap-2">
            <Search />

            <Tooltip title="Notifications">
              <div
                className={`flex h-8 cursor-pointer items-center rounded border px-2 py-1 ${
                  unreadNotifications.length > 0 ? "border-[#D82E2E] bg-[#D82E2E]" : "border-[#CFDBD5]"
                }`}
                onClick={(e) => setNotificationAnchorEl(e.currentTarget)}
              >
                <IoIosNotificationsOutline />
                {unreadNotifications.length > 0 && <span className="ml-1 text-xs">{unreadNotifications.length}</span>}
              </div>
            </Tooltip>

            <Popover
              open={Boolean(notificationAnchorEl)}
              anchorEl={notificationAnchorEl}
              onClose={() => setNotificationAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <div className="w-[500px]">
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
                        <div className="flex w-full items-center justify-between">
                          <p className="text-sm">{notification.detail}</p>
                          <button
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => deleteNotification(notification.id)}
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

            <div className="flex cursor-pointer items-center gap-1" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]">
                <p className="text-[#000000]">{firstLetter}</p>
              </div>
              <IoIosArrowDown />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile navigation */}
      <nav className="block border-b px-16 py-4 max-md:px-3 md:hidden">
        <div className="flex items-center justify-between">
          <FormatAlignLeftIcon onClick={() => setIsNavOpen(true)} style={{ cursor: "pointer" }} />
          <Link href="/" className="icon-style content-center">
            <Image src="/ic_logo.svg" width={150} height={43} alt="dekalo" />
          </Link>
          <Link href="/" className="dark-icon-style content-center">
            <Image src="/dark_logo.svg" width={150} height={43} alt="dekalo" />
          </Link>
          <div className="redirect flex h-[50px] items-center justify-center gap-1 rounded-full px-1">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6]"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
            <RxCross2 className="text-white" onClick={() => setIsNavOpen(false)} style={{ cursor: "pointer" }} />
          </div>
          <div className="mt-4 flex flex-col items-start space-y-2 p-4">
            <Link href="/dashboard" className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/dashboard")}`}>
              <Image
                src={getNavImageSrc("/dashboard", "/Graph.svg", "/Graph-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Dashboard</p>
            </Link>

            <Link href="/departments" className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/departments")}`}>
              <Image
                src={getNavImageSrc("/departments", "/departments.svg", "/departments-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Departments</p>
            </Link>
            <Link href="/appointments" className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/appointments")}`}>
              <Image
                src={getNavImageSrc("/appointments", "/appointments.svg", "/appointments-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Appointments</p>
            </Link>

            <Link href="/staff" className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/staff")}`}>
              <Image
                src={getNavImageSrc("/staff", "/admin.svg", "/admin-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Staff</p>
            </Link>

            <Link href="/patients" className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/patients")}`}>
              <Image
                src={getNavImageSrc("/patients", "/appointments.svg", "/appointments-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Patients</p>
            </Link>

            <Link href="/finance" className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/finance")}`}>
              <Image
                src={getNavImageSrc("/finance", "/finance.svg", "/finance-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Finance</p>
            </Link>

            <Link href="/admissions" className={`flex items-center gap-2 pb-4 ${getNavLinkClass("/admissions")}`}>
              <Image
                src={getNavImageSrc("/admissions", "/departments.svg", "/departments-active.svg")}
                width={20}
                height={20}
                alt="avatar"
              />
              <p className="mt-1">Admissions</p>
            </Link>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="fixed bottom-2 mt-10 flex items-center gap-2 pb-4 text-white"
            >
              <Image src="/logout.svg" width={20} height={20} alt="logout" />
              <p className="mt-1">Logout</p>
            </button>
          </div>
        </div>
      </nav>

      {/* Dropdown menu */}
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
          <div className="flex items-center gap-2 border-b px-4 py-2" onClick={() => setIsLogoutModalOpen(true)}>
            <RiLogoutCircleRLine />
            <p className="cursor-pointer text-sm font-semibold">Logout</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2" onClick={() => setIsDropdownOpen(false)}>
            <IoMdLock />
            <p className="text-sm font-semibold">Security</p>
          </div>
        </div>
      )}

      <LogoutModal
        open={isLogoutModalOpen}
        handleClose={() => setIsLogoutModalOpen(false)}
        handleConfirm={() => {
          localStorage.removeItem("id")
          localStorage.removeItem("token")
          clearUserDetails() // Clear the cached user data
          router.push("/signin")
        }}
      />
    </>
  )
}

export default DashboardNav
