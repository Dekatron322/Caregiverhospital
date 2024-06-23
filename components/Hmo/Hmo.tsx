import React, { useEffect, useState } from "react"
import { IoIosArrowForward } from "react-icons/io"
import { useRouter } from "next/navigation"

interface HmoDetail {
  id: string
  name: string
  detail: string
  status: boolean
  pub_date: string
  hmos: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }[]
}

interface HmoComponentProps {
  refreshKey: number
}

const HmoComponent: React.FC<HmoComponentProps> = ({ refreshKey }) => {
  const router = useRouter()
  const [hmoCategories, setHmoCategories] = useState<HmoDetail[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHmoCategories()
  }, [refreshKey])

  const fetchHmoCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://api.caregiverhospital.com/hmo-category/hmo-category/")
      if (!response.ok) {
        throw new Error("Failed to fetch HMOs")
      }
      const data = (await response.json()) as HmoDetail[]
      setHmoCategories(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching HMOs:", error)
      setError("Failed to fetch HMOs")
      setLoading(false)
    }
  }

  const handleHmoClick = (hmoId: string) => {
    router.push(`/finance/hmos/hmo/${hmoId}`)
  }

  if (loading)
    return (
      <div className="loading-text flex h-full items-center justify-center">
        {"loading...".split("").map((letter, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {letter}
          </span>
        ))}
      </div>
    )
  if (error) return <p>{error}</p>

  return (
    <>
      {hmoCategories.map((category) => (
        <div key={category.id} className="mb-3 w-full rounded border p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h6 className="font-bold">{category.name}</h6>
              <p className="text-sm">{category.detail}</p>
            </div>
            <div
              className="search-bg cursor-pointer rounded-full border p-2 shadow"
              onClick={() => handleHmoClick(category.id)}
            >
              <IoIosArrowForward />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default HmoComponent
