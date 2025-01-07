import { useEffect, useState } from "react"
import { LiaTimesSolid } from "react-icons/lia"
import styles from "../../components/Modals/modal.module.css"

// Define the types for the patient and related data structures
interface Billing {
  id: string
  enroll_number: string
  down_payment: string
  charge_amount: string
  payment_status: boolean
  procedure_code: string
  diagnosis_code: string
  payments: string[] // Array of payment IDs
}

interface Patient {
  id: string
  name: string
  gender: string
  email_address: string
  phone_no: string
  policy_id: string
  billings: Billing[]
}

interface PaymentResponse {
  amount: string // Adjust the type based on the actual data structure
}

const AllDownPayment: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>({}) // Store payment amounts by ID
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<string>("")

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

      // Re-fetch the patients to update the payment information
      await fetchPatients() // Re-fetch after payment registration
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Ensure fetchPatients is defined outside of useEffect so it can be reused
  const fetchPatients = async () => {
    try {
      setLoading(true)
      const start = 0
      const stop = 10

      const response = await fetch(
        `https://api2.caregiverhospital.com/patient/patient-with-payment/${start}/${stop}/payment/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch patients.")
      }

      const data = (await response.json()) as Patient[]
      const filteredPatients = data.filter((patient) =>
        patient.billings.some((billing) => {
          const downPayment = parseFloat(billing.down_payment)
          return !isNaN(downPayment) && downPayment > 0
        })
      )

      setPatients(filteredPatients)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Move fetchPatients outside of useEffect to reuse it
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
              const data = (await response.json()) as PaymentResponse // Type assertion
              amounts[id] = data.amount // Assuming `data.amount` contains the payment amount
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
    const updatedPatients = patients.filter((patient) => {
      const billing = patient.billings[0]
      if (!billing) return false

      const chargeAmount = parseFloat(billing.charge_amount || "0")
      const downPayment = parseFloat(billing.down_payment || "0")
      const payments = billing.payments || []
      const totalSubsequentPayments = payments.reduce((sum, id) => {
        const amount = parseFloat(paymentAmounts[id] || "0")
        return sum + (!isNaN(amount) ? amount : 0)
      }, 0)

      const balance = chargeAmount - downPayment - totalSubsequentPayments
      return balance > 0
    })

    setPatients(updatedPatients)
  }

  useEffect(() => {
    if (Object.keys(paymentAmounts).length > 0) {
      calculateAndFilterPatients()
    }
  }, [paymentAmounts])

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
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <>
          {patients.map((patient) => (
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
                        ? (chargeAmount - downPayment - totalSubsequentPayments).toFixed(2)
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
                    ? (chargeAmount - downPayment - totalSubsequentPayments).toFixed(2)
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
