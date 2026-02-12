import { NextRequest, NextResponse } from "next/server"
import {connectDB} from "@/lib/db"
import { Case } from "@/models/Case"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const body = await req.json()

  const {
    crimeNumber,
    crimeYear,
    policeStation,
    stationAddress,
    investigatingOfficerName,
    investigatingOfficerId,
    firDate,
    seizureDate,
    actAndLaw,
    section,
  } = body

  if (
    !crimeNumber ||
    !crimeYear ||
    !policeStation ||
    !investigatingOfficerName ||
    !investigatingOfficerId ||
    !firDate ||
    !seizureDate ||
    !actAndLaw ||
    !section
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const newCase = await Case.create({
    crimeNumber,
    crimeYear,
    policeStation,
    stationAddress,
    investigatingOfficerName,
    investigatingOfficerId,
    firDate: new Date(firDate),
    seizureDate: new Date(seizureDate),
    actAndLaw,
    section,
    reportingOfficer: (session.user as any).id,
  })

  return NextResponse.json({ caseId: newCase._id }, { status: 201 })
}
