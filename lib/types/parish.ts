export interface Parish {
  id: string
  name: string
  address: string
  neighborhood: string
  phone?: string
  schedules: {
    day: string
    times: string[]
  }[]
}
