"use server";

import { connectDB } from "@/lib/db";
import { Case } from "@/models/Case";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createCase(formData: {
  policeStation: string;
  stationAddress?: string;
  investigatingOfficerName: string;
  investigatingOfficerId: string;
  crimeNumber: string;
  crimeYear: string;
  firDate: string;
  seizureDate: string;
  actAndLaw: string;
  section: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  await connectDB();

  const newCase = await Case.create({
    policeStation: formData.policeStation,
    stationAddress: formData.stationAddress,
    investigatingOfficerName: formData.investigatingOfficerName,
    investigatingOfficerId: formData.investigatingOfficerId,
    crimeNumber: formData.crimeNumber,
    crimeYear: Number(formData.crimeYear),
    firDate: new Date(formData.firDate),
    seizureDate: new Date(formData.seizureDate),
    actAndLaw: formData.actAndLaw,
    section: formData.section,
    reportingOfficer: (session.user as any).id,
  });

  return { caseId: newCase._id.toString() };
}
