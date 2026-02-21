"use client"

import { useParams } from "next/navigation"
import PropertyForm from "@/components/PropertyForm"
import Link from "next/link"

export default function NewPropertyPage() {
  const params = useParams()
  const caseId = params.caseId as string

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8">
        <div className="mx-auto">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#1e3a8a]">Add New Property</h2>
              <p className="text-gray-600 mt-2">Register seized property and generate QR code</p>
            </div>

            <Link
              href={`/cases/${caseId}`}
              className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-2 font-semibold hover:bg-[#f8f9fa] transition-colors"
            >
              ← Back to Case
            </Link>
          </div>

          <PropertyForm caseId={caseId} />

          <div className="mt-6">
            <Link
              href={`/cases/${caseId}`}
              className="bg-gray-200 text-gray-700 px-8 py-3 font-bold hover:bg-gray-300 transition-colors"
            >
              CANCEL
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}