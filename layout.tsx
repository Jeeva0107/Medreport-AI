import type React from "react"
import { PatientSidebar } from "@/components/patient-sidebar"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <PatientSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
