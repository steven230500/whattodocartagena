import type { Parish } from "@/lib/types/parish"

export const parishes: Parish[] = [
  {
    id: "1",
    name: "Catedral de Santa Catalina de Alejandría",
    address: "Plaza de la Proclamación, Centro Histórico",
    neighborhood: "Centro Histórico",
    phone: "+57 5 664 3299",
    schedules: [
      { day: "Lunes a Viernes", times: ["7:00 AM", "12:00 PM", "6:00 PM"] },
      { day: "Sábados", times: ["7:00 AM", "12:00 PM", "6:00 PM", "7:00 PM"] },
      { day: "Domingos", times: ["7:00 AM", "9:00 AM", "11:00 AM", "12:00 PM", "6:00 PM", "7:00 PM"] },
    ],
  },
  {
    id: "2",
    name: "Iglesia de San Pedro Claver",
    address: "Calle de la Factoria, Centro Histórico",
    neighborhood: "Centro Histórico",
    phone: "+57 5 664 4991",
    schedules: [
      { day: "Lunes a Viernes", times: ["7:00 AM", "12:00 PM", "6:00 PM"] },
      { day: "Sábados", times: ["7:00 AM", "6:00 PM"] },
      { day: "Domingos", times: ["8:00 AM", "10:00 AM", "12:00 PM", "6:00 PM"] },
    ],
  },
  {
    id: "3",
    name: "Iglesia de Santo Domingo",
    address: "Plaza de Santo Domingo, Centro Histórico",
    neighborhood: "Centro Histórico",
    phone: "+57 5 664 3965",
    schedules: [
      { day: "Lunes a Viernes", times: ["7:00 AM", "6:00 PM"] },
      { day: "Sábados", times: ["7:00 AM", "6:00 PM"] },
      { day: "Domingos", times: ["8:00 AM", "10:00 AM", "12:00 PM", "6:00 PM"] },
    ],
  },
  {
    id: "4",
    name: "Iglesia de la Trinidad",
    address: "Barrio Getsemaní",
    neighborhood: "Getsemaní",
    phone: "+57 5 664 2715",
    schedules: [
      { day: "Lunes a Viernes", times: ["6:30 AM", "6:00 PM"] },
      { day: "Sábados", times: ["6:30 AM", "6:00 PM"] },
      { day: "Domingos", times: ["7:00 AM", "9:00 AM", "11:00 AM", "6:00 PM"] },
    ],
  },
  {
    id: "5",
    name: "Iglesia de San Francisco",
    address: "Plaza de San Francisco, Centro Histórico",
    neighborhood: "Centro Histórico",
    schedules: [
      { day: "Lunes a Viernes", times: ["7:00 AM", "12:00 PM", "6:00 PM"] },
      { day: "Sábados", times: ["7:00 AM", "6:00 PM"] },
      { day: "Domingos", times: ["8:00 AM", "10:00 AM", "12:00 PM", "6:00 PM"] },
    ],
  },
  {
    id: "6",
    name: "Santuario de San Roque",
    address: "Barrio San Diego",
    neighborhood: "San Diego",
    phone: "+57 5 664 3643",
    schedules: [
      { day: "Lunes a Viernes", times: ["7:00 AM", "6:00 PM"] },
      { day: "Sábados", times: ["7:00 AM", "6:00 PM"] },
      { day: "Domingos", times: ["8:00 AM", "10:00 AM", "12:00 PM", "6:00 PM"] },
    ],
  },
]
