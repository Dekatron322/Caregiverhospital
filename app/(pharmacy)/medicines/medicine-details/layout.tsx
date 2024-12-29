export const metadata = {
  title: "Medicine | Caregivers Hospital",
  description: "Account",
}

export default function MedicineLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <main>{children}</main>
    </section>
  )
}
