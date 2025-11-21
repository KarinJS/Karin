"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ContentArea } from "@/components/content-area"

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none" />

      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="ml-16 min-h-screen flex flex-col">
        <Header />
        <ContentArea activeView={activeView} />
      </div>
    </div>
  )
}
