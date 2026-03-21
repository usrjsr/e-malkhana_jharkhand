"use server";

import { connectDB } from "@/lib/db";
import { Case } from "@/models/Case";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { asyncHandler } from "@/lib/async-handler";

export const createCase = asyncHandler(async (formData: {
  policeStation: string;
  investigatingOfficerName: string;
  investigatingOfficerId: string;
  crimeNumber: string;
  crimeYear: string;
  crimeType: string;
  firDate: string;
  actAndLaw: string;
  section: string;
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  await connectDB();

  const newCase = await Case.create({
    policeStation: formData.policeStation,
    investigatingOfficerName: formData.investigatingOfficerName,
    investigatingOfficerId: formData.investigatingOfficerId,
    crimeNumber: formData.crimeNumber,
    crimeYear: Number(formData.crimeYear),
    crimeType: formData.crimeType,
    firDate: new Date(formData.firDate),
    actAndLaw: formData.actAndLaw,
    section: formData.section,
    reportingOfficer: (session.user as any).id,
  });

  return { caseId: newCase._id.toString() };
});
