export interface Notification {
  id: string
  title: string
  detail: string
  status: boolean
  pub_date: string
}

export interface UserDetails {
  id: number
  username: string
  email: string
  phone_number: string
  address: string
  account_type: string
  notifications: Notification[]
}
