export const metadata = {
  title: "Medicine | CityMed Hospital",
  description: "Account",
}

export default function MedicineLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  )
}
