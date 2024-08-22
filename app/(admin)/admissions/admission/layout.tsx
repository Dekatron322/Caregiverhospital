export const metadata = {
  title: "Admission Details | CityMed Hospital",
  description: "Account",
}

export default function AdmissionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  )
}
