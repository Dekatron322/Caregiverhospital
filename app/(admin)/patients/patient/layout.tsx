export const metadata = {
  title: "Patient Details | CityMed Hospital",
  description: "Account",
}

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  )
}
