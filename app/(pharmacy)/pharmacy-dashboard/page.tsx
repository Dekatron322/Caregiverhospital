"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import Link from "next/link"
import { MdKeyboardDoubleArrowRight } from "react-icons/md"
import PharmacyNav from "components/Navbar/PharmacyNav"

interface Medicine {
  id: string
  name: string
  quantity: string
  category: string
  expiry_date: string
  price: string
  how_to_use: string
  side_effect: string
  status: boolean
  pub_date: string
}

interface Category {
  id: string
  medicines: Medicine[]
  name: string
  status: boolean
  pub_date: string
}

interface Metrics {
  totalMedicines: number
  medicinesAvailable: number
  medicineShortage: number
  medicinesExpiring: number
  totalCategories: number
  totalMedicinePrice: number
}

const PHARMACY_DASHBOARD_STORAGE_KEY = "pharmacy-dashboard"

export default function PharmacyDashboard() {
  const [pharmacyData, setPharmacyData] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [metrics, setMetrics] = useState<Metrics>({
    totalMedicines: 0,
    medicinesAvailable: 0,
    medicineShortage: 0,
    medicinesExpiring: 0,
    totalCategories: 0,
    totalMedicinePrice: 0,
  })

  useEffect(() => {
    try {
      const cached = localStorage.getItem(PHARMACY_DASHBOARD_STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as { data: Category[]; metrics: Metrics }
        if (parsed?.data && parsed?.metrics) {
          setPharmacyData(parsed.data)
          setMetrics(parsed.metrics)
          setLoading(false)
        }
      }
    } catch (error) {
      console.error("Error reading pharmacy dashboard from localStorage:", error)
    }

    axios
      .get<Category[]>("https://api2.caregiverhospital.com/medicine-category/medicine-category/")
      .then((response) => {
        const data = response.data
        const newMetrics = calculateMetrics(data)
        const payload = { data, metrics: newMetrics }

        let shouldUpdate = true
        try {
          const cached = localStorage.getItem(PHARMACY_DASHBOARD_STORAGE_KEY)
          if (cached && cached === JSON.stringify(payload)) {
            shouldUpdate = false
          }
        } catch (error) {
          console.error("Error comparing pharmacy dashboard cache:", error)
        }

        if (shouldUpdate) {
          setPharmacyData(data)
          setMetrics(newMetrics)
          try {
            localStorage.setItem(PHARMACY_DASHBOARD_STORAGE_KEY, JSON.stringify(payload))
          } catch (error) {
            console.error("Error saving pharmacy dashboard to localStorage:", error)
          }
        }

        setLoading(false)
      })
      .catch((error) => {
        console.error("There was an error fetching the pharmacy data!", error)
        setLoading(false)
      })
  }, [])

  const calculateMetrics = (data: Category[]): Metrics => {
    const today: any = new Date().toISOString().split("T")[0]
    let totalMedicines = 0
    let medicinesAvailable = 0
    let medicineShortage = 0
    let medicinesExpiring = 0
    let totalMedicinePrice = 0
    const totalCategories = data.length

    data.forEach((category) => {
      totalMedicines += category.medicines.length
      category.medicines.forEach((medicine) => {
        medicinesAvailable += parseInt(medicine.quantity, 10)
        if (parseInt(medicine.quantity, 10) === 0) {
          medicineShortage += 1
        }
        if (
          medicine.expiry_date &&
          typeof medicine.expiry_date === "string" &&
          new Date(medicine.expiry_date) <= new Date(today)
        ) {
          medicinesExpiring += 1
        }
        totalMedicinePrice += parseFloat(medicine.price)
      })
    })

    return {
      totalMedicines,
      medicinesAvailable,
      medicineShortage,
      medicinesExpiring,
      totalCategories,
      totalMedicinePrice,
    }
  }

  if (loading) {
    return (
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <PharmacyNav />
            <div className="loading-text flex h-full items-center justify-center">
              {"loading...".split("").map((letter, index) => (
                <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <PharmacyNav />

            <div className="px-16 py-4 max-md:px-3 md:mt-10">
              <h4 className="font-semibold">Pharmacy Dashboard</h4>
              <p className="text-xs">A Quick overview of your pharmacy</p>
            </div>
            <div className="mb-3 grid w-full grid-cols-3 gap-2 px-16 max-md:grid-cols-1 max-md:px-3">
              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#01A768] pt-2 ">
                <Image src="/inventory-status.svg" height={40} width={40} alt="" />
                <h3 className="py-2  font-bold capitalize">Good </h3>
                <p>Inventory Status</p>
                <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#AADCC9] py-1 text-black">
                  <p className="text-xs">View Inventory Status</p>
                  <MdKeyboardDoubleArrowRight />
                </div>
              </div>

              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#03A9F5] pt-2">
                <Image src="/medicines-available.svg" height={40} width={40} alt="" />
                <h3 className="py-2 font-bold">{metrics.totalMedicines}</h3>
                <p>Total Medicines</p>
                <Link
                  href="/medicines/"
                  className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#ABDDF4] py-1 text-black"
                >
                  <p className="text-xs">View Inventory</p>
                  <MdKeyboardDoubleArrowRight />
                </Link>
              </div>
              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#EEC202] pt-2 ">
                <Image src="/revenue.svg" height={38} width={38} alt="" />
                <h3 className="py-2  font-bold">#{metrics.totalMedicinePrice}</h3>
                <p>Revenue Status</p>
                <div className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#EEC202] py-1 text-black">
                  <p className="text-xs">View Detailed report</p>
                  <MdKeyboardDoubleArrowRight />
                </div>
              </div>
            </div>
            <div className="mb-3 flex w-full gap-2 px-16 max-md:px-3">
              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#F2C0BD] pt-2">
                <Image src="/shortage.svg" height={38} width={38} alt="" />
                <h3 className="py-2 font-bold capitalize">{metrics.medicineShortage}</h3>
                <p>Medicine Shortage</p>
                <Link
                  href="/pharmacy-dashboard/medicine-shortage"
                  className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#F2C0BD] py-1 text-black"
                >
                  <p className="text-xs">Resolve Shortage</p>
                  <MdKeyboardDoubleArrowRight />
                </Link>
              </div>
              <div className="auth flex w-full flex-col items-center justify-center rounded border border-[#FF6A5A] pt-2">
                <Image src="/expiring.svg" height={34} width={34} alt="" />
                <h3 className="py-2 font-bold">{metrics.medicinesExpiring}</h3>
                <p>Medicines Expiring</p>
                <Link
                  href="/pharmacy-dashboard/medicine-expiring"
                  className="mt-2 flex w-full items-center justify-center gap-2 overflow-hidden bg-[#FF6A5A] py-1 text-black"
                >
                  <p className="text-xs">Resolve Expiry</p>
                  <MdKeyboardDoubleArrowRight />
                </Link>
              </div>
            </div>
            <div className="auth mt-16 flex gap-6 py-6 pt-16">
              <div className="grid w-full grid-cols-2 gap-2 px-16 max-md:grid-cols-1 max-md:px-3">
                <div className="auth flex flex-col justify-center rounded-sm border">
                  <p className="px-4 py-2 font-semibold">Inventory</p>
                  <div className="border"></div>
                  <div className="flex justify-between">
                    <div className="px-4 py-2 ">
                      <p className="pb-4 text-base font-bold">Total no of medicines</p>
                      <p className="text-sm">{metrics.totalMedicines}</p>
                    </div>
                    <div className="px-4 py-2">
                      <p className="pb-4 text-base font-bold">medicine Categories</p>
                      <p className="text-sm">{metrics.totalCategories}</p>
                    </div>
                  </div>
                </div>
                <div className="auth flex flex-col justify-center rounded-sm border">
                  <p className="px-4 py-2 font-semibold">Quick Report</p>
                  <div className="border"></div>
                  <div className="flex justify-between">
                    <div className="px-4 py-2 ">
                      <p className="pb-4 text-base font-bold">Qty of Medicines Sold</p>
                      <p className="text-sm">{metrics.totalMedicines}</p>
                    </div>
                    <div className="px-4 py-2">
                      <p className="pb-4 text-base font-bold">Invoices Generated</p>
                      <p className="text-sm">{metrics.totalCategories}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </section>
  )
}
