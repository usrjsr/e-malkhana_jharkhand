import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { connectDB } from "@/lib/db"
import { Custody } from "@/models/Custody"
import { Property } from "@/models/Property"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const body = await req.json()

  const {
    propertyId,
    fromOfficer,
    toOfficer,
    fromLocation,
    toLocation,
    purpose,
    action,
    remarks,
    movementTimestamp,
  } = body

  if (
    !propertyId ||
    !fromOfficer ||
    !fromLocation ||
    !toLocation ||
    !purpose ||
    !action
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const property = await Property.findById(propertyId)

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  const custody = await Custody.create({
    propertyId,
    fromOfficer,
    toOfficer,
    fromLocation,
    toLocation,
    purpose,
    action,
    remarks,
    handler: (session.user as any).id,
    movementTimestamp: movementTimestamp
      ? new Date(movementTimestamp)
      : new Date(),
  })

  property.lastMovementAt = new Date()
  property.status =
    action === "MOVED"
      ? "IN_TRANSIT"
      : action === "RECEIVED"
      ? "SEIZED"
      : property.status

  await property.save()

  return NextResponse.json({ custodyId: custody._id }, { status: 201 })
}
