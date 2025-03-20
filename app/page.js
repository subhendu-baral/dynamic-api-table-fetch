"use client"

import  DynamicDataTable from "@/components/custom/DataTable"
import { useState, useEffect } from "react"

export default function Home() {
  return (
    <div className="container mx-auto p-4 lg:max-w-5xl">
      <h1 className="font-bold text-3xl mb-5 text-center">Muvi Test</h1>
      <DynamicDataTable />
    </div>
  )
}
