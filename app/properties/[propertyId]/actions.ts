"use server"

import { connectDB } from "@/lib/db"
import { Property } from "@/models/Property"
import { Case } from "@/models/Case"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function linkPropertyToCase(
  propertyId: string,
  caseId: string
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("Unauthorized")
  }

  await connectDB()

  // Verify property exists and user has access
  const property = await Property.findById(propertyId)
  if (!property) {
    throw new Error("Property not found")
  }

  const userId = (session.user as any).id
  const userRole = (session.user as any).role

  if (
    userRole !== "ADMIN" &&
    property.seizingOfficer.toString() !== userId &&
    property.currentOfficer.toString() !== userId
  ) {
    throw new Error("Unauthorized")
  }

  // Verify case exists
  const caseExists = await Case.findById(caseId)
  if (!caseExists) {
    throw new Error("Case not found")
  }

  // Update property with case
  property.caseId = caseId
  await property.save()

  return {
    success: true,
    message: "Property linked to case successfully",
  }
}
