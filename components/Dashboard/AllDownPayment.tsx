import { useEffect, useState } from "react"
import { LiaTimesSolid } from "react-icons/lia"
import styles from "../../components/Modals/modal.module.css"

interface Billing {
  id: string
  enroll_number: string
  down_payment: string
  charge_amount: string
  payment_status: boolean
  procedure_code: string
  diagnosis_code: string
  payments: string[]
}

interface Patient {
  uniqueBillingId: any
  id: string
  name: string
  gender: string
  email_address: string
  phone_no: string
  policy_id: string
  billings: Billing[]
}

interface PaymentResponse {
  amount: string
}

const AllDownPayment: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>({}) // Store payment amounts by ID
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<string>("")
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleRegisterPayment = async () => {
    if (!selectedPatient || !paymentAmount) return

    const billing = selectedPatient.billings[0]
    const billingId = billing?.id

    try {
      setLoading(true)
      const response = await fetch(`https://api2.caregiverhospital.com/billing/add-payment-to/${billingId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: paymentAmount }),
      })

      if (!response.ok) {
        throw new Error("Failed to register payment.")
      }

      closeModal()
      alert("Payment registered successfully.")

      await fetchPatients()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://api2.caregiverhospital.com/patient/patient-with-payment/{start}/{stop}/payment/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch patients. Status: ${response.status}`)
      }

      const data = (await response.json()) as Patient[]

      const expandedPatients: Patient[] = data.flatMap((patient) =>
        patient.billings.map((billing, index) => ({
          ...patient,
          billings: [billing],
          uniqueBillingId: `${patient.id}-${index}`,
        }))
      )

      const uniquePatients = Array.from(new Map(expandedPatients.map((p) => [p.uniqueBillingId, p])).values()).filter(
        (patient) => {
          const billing = patient.billings[0]
          const downPayment = parseFloat(billing?.down_payment || "0")
          return downPayment > 0
        }
      )

      setPatients(uniquePatients)
      setFilteredPatients(uniquePatients)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredPatients(patients)
    } else {
      const lowerCaseQuery = query.toLowerCase()
      const filtered = patients.filter((patient) => {
        return (
          patient.name.toLowerCase().includes(lowerCaseQuery) ||
          patient.policy_id.toLowerCase().includes(lowerCaseQuery)
        )
      })
      setFilteredPatients(filtered)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    const fetchPaymentAmounts = async () => {
      const allPaymentIds = patients.flatMap((patient) => patient.billings.flatMap((billing) => billing.payments))

      const amounts: Record<string, string> = {}
      await Promise.all(
        allPaymentIds.map(async (id) => {
          try {
            const response = await fetch(`https://api2.caregiverhospital.com/billing/payment/${id}/`)
            if (response.ok) {
              const data = (await response.json()) as PaymentResponse
              amounts[id] = data.amount
            } else {
              amounts[id] = "N/A"
            }
          } catch {
            amounts[id] = "N/A"
          }
        })
      )

      setPaymentAmounts(amounts)
    }

    if (patients.length > 0) {
      fetchPaymentAmounts()
    }
  }, [patients])

  // Calculate balance for each patient and filter out patients with zero balance
  const calculateAndFilterPatients = () => {
    const updatedPatients = patients
      .map((patient) => {
        const filteredBillings = patient.billings.filter((billing) => {
          const chargeAmount = parseFloat(billing.charge_amount || "0")
          const downPayment = parseFloat(billing.down_payment || "0")
          const payments = billing.payments || []
          const totalSubsequentPayments = payments.reduce((sum, id) => {
            const amount = parseFloat(paymentAmounts[id] || "0")
            return sum + (!isNaN(amount) ? amount : 0)
          }, 0)

          // Calculate balance
          const balance = chargeAmount - downPayment - totalSubsequentPayments

          // Retain only billings with outstanding balances
          return balance > 0
        })

        // Return the patient only if they have unresolved billings
        return {
          ...patient,
          billings: filteredBillings,
        }
      })
      .filter((patient) => patient.billings.length > 0) // Exclude patients with no billings

    setPatients(updatedPatients)
    setFilteredPatients(updatedPatients)
  }

  //   useEffect(() => {
  //     if (Object.keys(paymentAmounts).length > 0) {
  //       calculateAndFilterPatients()
  //     }
  //   }, [paymentAmounts])

  const handleMakePayment = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPatient(null)
    setPaymentAmount("")
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Patients with Down Payment</h1>
      <input
        type="text"
        placeholder="Search by name or HMO ID"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4 w-full max-w-[350px] rounded border p-2"
      />
      {filteredPatients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <>
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="mb-2 flex w-full items-center justify-between gap-3 rounded-lg border p-2">
              <div className="flex w-full items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#46ffa6] max-md:hidden">
                  <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold">{patient.name}</p>
                  <p className="text-xs">HMO ID: {patient.policy_id}</p>
                </div>
              </div>
              <div className="flex w-full flex-col max-sm:hidden">
                <p className="text-xs font-bold">
                  Procedure/Diagnosis:{" "}
                  {patient.billings?.[0]?.procedure_code && patient.billings[0].procedure_code !== "null"
                    ? patient.billings[0].procedure_code
                    : patient.billings?.[0]?.diagnosis_code && patient.billings[0].diagnosis_code !== "null"
                    ? patient.billings[0].diagnosis_code
                    : "N/A"}
                </p>
                <p className="text-xs font-medium">Price: ₦{patient.billings[0]?.charge_amount || "N/A"}</p>
              </div>
              <div className="flex w-full items-center gap-2">
                <div>
                  <p className="text-xs font-bold">Down Payment: ₦{patient.billings[0]?.down_payment || "N/A"}</p>
                </div>
              </div>

              <div className="flex w-full items-center gap-2">
                <div>
                  <p className="text-xs font-bold">
                    Subsequent Payments:{" "}
                    {(patient.billings[0]?.payments || []).map((id) => ` ₦${paymentAmounts[id] || "N/A"}`).join(", ")}
                  </p>
                  <p className="text-xs font-bold">
                    Total Subsequent Payments: ₦
                    {(() => {
                      const payments = patient.billings[0]?.payments || [] // Default to an empty array
                      const paymentSum = payments.reduce((sum, id) => {
                        const amount = parseFloat(paymentAmounts[id] || "0")
                        return sum + (!isNaN(amount) ? amount : 0)
                      }, 0)
                      return paymentSum.toFixed(2)
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center gap-2">
                <div>
                  <p className="text-xs font-bold">
                    Balance: ₦
                    {(() => {
                      const chargeAmount = parseFloat(patient.billings[0]?.charge_amount || "0")
                      const downPayment = parseFloat(patient.billings[0]?.down_payment || "0")
                      const payments = patient.billings[0]?.payments || [] // Default to an empty array
                      const totalSubsequentPayments = payments.reduce((sum, id) => {
                        const amount = parseFloat(paymentAmounts[id] || "0")
                        return sum + (!isNaN(amount) ? amount : 0)
                      }, 0)

                      return !isNaN(chargeAmount) && !isNaN(downPayment)
                        ? (chargeAmount - totalSubsequentPayments).toFixed(2)
                        : "N/A"
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center justify-end pr-2">
                <button
                  onClick={() => handleMakePayment(patient)}
                  className="rounded-md bg-[#46ffa6] p-2 text-sm text-black"
                >
                  Make Payment
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {isModalOpen && selectedPatient && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <h6 className="text-lg font-medium">Make Payment</h6>
                <div className="hover:rounded-md hover:border">
                  <LiaTimesSolid className="m-1 cursor-pointer" onClick={closeModal} />
                </div>
              </div>

              <p className="text-sm">
                Name: {selectedPatient.name} | HMO ID: {selectedPatient.policy_id}
              </p>
              <p>
                Amount Due: ₦
                {(() => {
                  const chargeAmount = parseFloat(selectedPatient.billings[0]?.charge_amount || "0")
                  const downPayment = parseFloat(selectedPatient.billings[0]?.down_payment || "0")
                  const payments = selectedPatient.billings[0]?.payments || [] // Default to an empty array
                  const totalSubsequentPayments = payments.reduce((sum, id) => {
                    const amount = parseFloat(paymentAmounts[id] || "0")
                    return sum + (!isNaN(amount) ? amount : 0)
                  }, 0)

                  return !isNaN(chargeAmount) && !isNaN(downPayment)
                    ? (chargeAmount - totalSubsequentPayments).toFixed(2)
                    : "N/A"
                })()}
              </p>
              <div className="my-4">
                <p className="mb-1 text-sm">Register Payment</p>
                <div className="search-bg flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                  <input
                    type="number"
                    id="detail"
                    placeholder="Enter Amount"
                    className="h-[50px] w-full bg-transparent text-xs outline-none focus:outline-none"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleRegisterPayment}
                className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]"
              >
                {loading ? "Registering..." : "REGISTER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllDownPayment
