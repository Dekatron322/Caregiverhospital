interface Hmo {
  id: string
  name: string
  category: string
  description: string
  status: boolean
  pub_date: string
}

interface HmoCategory {
  id: string
  name: string
  detail: string
  status: boolean
  pub_date: string
  hmos: Hmo[]
}

export const fetchHmos = async (): Promise<HmoCategory[]> => {
  const response = await fetch("https://api2.caregiverhospital.com/hmo-category/hmo-category/")
  if (!response.ok) {
    throw new Error("Failed to fetch data")
  }
  const data = (await response.json()) as HmoCategory[]
  return data
}

export const fetchHmosByCategory = async (id: string) => {
  const response = await fetch(`https://api2.caregiverhospital.com/hmo-category/hmo_category/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch HMOs")
  }
  return response.json()
}
