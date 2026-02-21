import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import QRCode from "qrcode"

import { connectDB } from "@/lib/db"
import { Property } from "@/models/Property"
import { Case } from "@/models/Case"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const { searchParams } = new URL(req.url)
  const caseId = searchParams.get("caseId")

  if (!caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 })
  }

  const properties = await Property.find({ caseId }).sort({ createdAt: -1 })

  return NextResponse.json(properties)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const body = await req.json()

  const {
    caseId,
    category,
    belongingTo,
    natureOfProperty,
    quantity,
    units,
    storageLocation,
    description,
    itemImage,
  } = body

  if (
    !caseId ||
    !category ||
    !belongingTo ||
    !natureOfProperty ||
    !quantity ||
    !units ||
    !storageLocation ||
    !description ||
    !itemImage
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const caseExists = await Case.findById(caseId)
  if (!caseExists) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 })
  }

  const qrData = `PROPERTY:${caseId}:${Date.now()}`
  const qrCode = await QRCode.toDataURL(qrData)

  const property = await Property.create({
    caseId,
    category,
    belongingTo,
    natureOfProperty,
    quantity,
    units,
    storageLocation,
    description,
    itemImage,
    qrCode,
    seizingOfficer: session.user.id,
  })

  return NextResponse.json({ propertyId: property._id }, { status: 201 })
}
