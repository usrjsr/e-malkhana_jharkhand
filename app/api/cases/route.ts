import { NextRequest, NextResponse } from "next/server"
import {connectDB} from "@/lib/db"
import { Case } from "@/models/Case"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim()
  const status = searchParams.get("status")

  const filter: any = {}

  if (status && status !== "ALL") {
    filter.status = status.toUpperCase()
  }

  if (q) {
    const regex = new RegExp(q, "i")
    filter.$or = [
      { crimeNumber: regex },
      { caseNumber: regex },
      { policeStation: regex },
      { investigatingOfficerName: regex },
      { investigatingOfficerId: regex },
      { actAndLaw: regex },
      { section: regex },
    ]

    const yearNum = Number(q)
    if (!isNaN(yearNum)) {
      filter.$or.push({ crimeYear: yearNum })
    }
  }

  const cases = await Case.find(filter).sort({ createdAt: -1 }).limit(100)

  return NextResponse.json(cases)
}

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
