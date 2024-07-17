import { GiNurseMale } from "react-icons/gi"
import Image from "next/image"
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined"
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined"
import MedicationLiquidOutlinedIcon from "@mui/icons-material/MedicationLiquidOutlined"
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined"
import AirlineSeatIndividualSuiteOutlinedIcon from "@mui/icons-material/AirlineSeatIndividualSuiteOutlined"
import CardTravelIcon from "@mui/icons-material/CardTravel"
import Link from "next/link"
import BiotechIcon from "@mui/icons-material/Biotech"
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart"

export const LogoIcon = () => (
  <>
    <Link href="/" className="icon-style content-center">
      <Image src="/ic_logo.svg" width={115} height={43} alt="dekalo" />
    </Link>
    <Link href="/" className="dark-icon-style content-center">
      <Image src="/dark_logo.svg" width={115} height={43} alt="dekalo" />
    </Link>
  </>
)

export const CollapsedLogoIcon = () => (
  <>
    <Link href="/" className="icon-style content-center">
      <Image src="/alternate.svg" width={115} height={43} alt="dekalo" />
    </Link>
    <Link href="/" className="dark-icon-style content-center">
      <Image src="/alternate.svg" width={20} height={43} alt="dekalo" />
    </Link>
  </>
)

export const DashboardIcon = () => <DashboardOutlinedIcon className="text-lg" />

export const Departments = () => <HomeWorkOutlinedIcon className="text-lg" />

export const Appointments = () => <MedicationLiquidOutlinedIcon className="text-lg" />

export const Diagnosis = () => <BiotechIcon className="text-lg" />
export const ProcedureIcon = () => <MonitorHeartIcon className="text-lg" />

export const Staff = () => <GiNurseMale />

export const Finance = () => <CardTravelIcon className="text-lg" />

export const Patients = () => <AirlineSeatIndividualSuiteOutlinedIcon className="text-lg" />
export const Admissions = () => <VaccinesOutlinedIcon />

export const UsdIcon = () => <Image width={20} height={20} src="/Rectangle.svg" alt="" />

export const EurIcon = () => <Image width={20} height={20} src="/Icon2.svg" alt="" />

export const GbpIcon = () => <Image width={20} height={20} src="/Icon3.svg" alt="" />

export const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.877075 7.49985C0.877075 3.84216 3.84222 0.877014 7.49991 0.877014C11.1576 0.877014 14.1227 3.84216 14.1227 7.49985C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49985ZM3.78135 3.21565C4.68298 2.43239 5.83429 1.92904 7.09998 1.84089V6.53429L3.78135 3.21565ZM3.21567 3.78134C2.43242 4.68298 1.92909 5.83428 1.84095 7.09997H6.5343L3.21567 3.78134ZM6.5343 7.89997H1.84097C1.92916 9.16562 2.43253 10.3169 3.21579 11.2185L6.5343 7.89997ZM3.78149 11.7842C4.6831 12.5673 5.83435 13.0707 7.09998 13.1588V8.46566L3.78149 11.7842ZM7.89998 8.46566V13.1588C9.16559 13.0706 10.3168 12.5673 11.2184 11.7841L7.89998 8.46566ZM11.7841 11.2184C12.5673 10.3168 13.0707 9.16558 13.1588 7.89997H8.46567L11.7841 11.2184ZM8.46567 7.09997H13.1589C13.0707 5.83432 12.5674 4.68305 11.7842 3.78143L8.46567 7.09997ZM11.2185 3.21573C10.3169 2.43246 9.16565 1.92909 7.89998 1.8409V6.53429L11.2185 3.21573Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
)

export const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    ></path>
  </svg>
)
