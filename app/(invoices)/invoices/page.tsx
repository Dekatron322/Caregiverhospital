"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoMdArrowBack } from "react-icons/io"
import * as XLSX from "xlsx"
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline"

interface Billing {
  id: string
  enroll_number: string
  enroll_from: string
  enroll_to: string
  procedure_code: string
  diagnosis_code: string | null
  charge_amount: string
  units: string
  status: boolean
  pub_date: string
}

interface Patient {
  id: string
  name: string
  billings: Billing[]
}

interface Hmo {
  id: string
  name: string
  category: string
  description: string
  patients: Patient[]
  status: boolean
  pub_date: string
}

interface HmoDetailPageProps {
  params: { hmoId: string }
}

export default function InvoicesPage({ params }: HmoDetailPageProps) {
  const [hmoDetails, setHmoDetails] = useState<Hmo | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const router = useRouter()
  // const { hmoId } = params

  useEffect(() => {
    const fetchHmoDetails = async () => {
      try {
        const hmoId = localStorage.getItem("selectedHmoId")
        if (!hmoId) {
          console.error("No admission ID found in localStorage.")
          return
        }
        const response = await fetch(`https://api2.caregiverhospital.com/hmo/hmo/${hmoId}/`)
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = (await response.json()) as Hmo
        setHmoDetails(data)
      } catch (error) {
        console.error("Error fetching HMO details:", error)
      }
    }

    fetchHmoDetails()
  })

  const handleGoBack = () => {
    router.back()
  }

  const handleDownloadExcel = () => {
    if (!hmoDetails || hmoDetails.patients.length === 0) return

    // Filtered data based on selected month
    const filteredBillings = hmoDetails.patients.flatMap((patient) =>
      patient.billings.filter((billing) => {
        const enrollToDate = new Date(billing.enroll_to)
        return enrollToDate.getMonth() + 1 === selectedMonth
      })
    )

    if (filteredBillings.length === 0) return

    // Flatten the filtered data
    const worksheetData = filteredBillings.map((billing) => ({
      "Enroll Number": billing.enroll_number,
      "Encounter From": new Date(billing.enroll_from).toLocaleDateString(),
      "Encounter To": new Date(billing.enroll_to).toLocaleDateString(),
      "Procedure Code": billing.procedure_code,
      "Diagnosis Code": billing.diagnosis_code || "N/A",
      "Charge Amount": billing.charge_amount,
      Units: billing.units,
    }))

    // Create the worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData)

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Enroll Number
      { wch: 15 }, // Encounter From
      { wch: 15 }, // Encounter To
      { wch: 20 }, // Procedure Code
      { wch: 20 }, // Diagnosis Code
      { wch: 15 }, // Charge Amount
      { wch: 10 }, // Units
    ]
    worksheet["!cols"] = columnWidths

    // Add header styles
    const headerCellStyle = {
      font: { bold: true },
      fill: {
        fgColor: { rgb: "FFFFAA00" },
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
      },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    }

    // Apply header styles
    const headers = Object.keys(worksheetData[0] || {})
    headers.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index })
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = headerCellStyle
      }
    })

    // Apply styles to data cells if needed (optional)
    for (let R = 1; R <= worksheetData.length; R++) {
      for (let C = 0; C < headers.length; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
        if (!worksheet[cellAddress]) worksheet[cellAddress] = {}
        worksheet[cellAddress].s = {
          alignment: {
            vertical: "center",
            horizontal: "center",
          },
        }
      }
    }

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices")

    // Write the file
    XLSX.writeFile(
      workbook,
      `HMO_${hmoDetails.name}_Invoices_${new Date(0, selectedMonth - 1).toLocaleString("default", {
        month: "long",
      })}.xlsx`
    )
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value))
  }

  const filteredBillings = hmoDetails
    ? hmoDetails.patients.flatMap((patient) =>
        patient.billings.filter((billing) => {
          const enrollToDate = new Date(billing.enroll_to)
          return enrollToDate.getMonth() + 1 === selectedMonth
        })
      )
    : []

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />
            <div className="px-16 py-3 max-md:px-3">
              <div className="flex justify-between pt-4">
                <button onClick={handleGoBack} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <button onClick={handleDownloadExcel} className="add-button ">
                  <p className="text-xs capitalize">Download Excel</p>
                  <DownloadForOfflineIcon />
                </button>
              </div>
              <div className="pt-4">
                <label htmlFor="month-select">Select Month: </label>
                <select
                  className="search-bg w-60 rounded border p-2"
                  id="month-select"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(0, month - 1).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-10">
                <h1 className="mb-3 font-semibold">Invoices for {hmoDetails ? hmoDetails.name : "Loading..."}</h1>
                {hmoDetails ? (
                  <div>
                    {filteredBillings.length === 0 ? (
                      <p>No billings found for the selected month.</p>
                    ) : (
                      <table className="min-w-full table-auto">
                        <thead className="sidebar">
                          <tr>
                            <th className="border py-2">Enroll Number</th>
                            <th className="border py-2">Encounter From</th>
                            <th className="border py-2">Encounter To</th>
                            <th className="border py-2">Procedure Code</th>
                            <th className="border py-2">Diagnosis Code</th>
                            <th className="border py-2">Charge Amount</th>
                            <th className="border py-2">Units</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBillings.map((billing) => (
                            <tr key={billing.id}>
                              <td className="border px-4 py-2">{billing.enroll_number}</td>
                              <td className="border px-4 py-2">{new Date(billing.enroll_from).toLocaleDateString()}</td>
                              <td className="border px-4 py-2">{new Date(billing.enroll_to).toLocaleDateString()}</td>
                              <td className="border px-4 py-2">{billing.procedure_code}</td>
                              <td className="border px-4 py-2">{billing.diagnosis_code || "N/A"}</td>
                              <td className="border px-4 py-2">₦{billing.charge_amount}</td>
                              <td className="border px-4 py-2">{billing.units}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <p>Loading HMO details...</p>
                )}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}
