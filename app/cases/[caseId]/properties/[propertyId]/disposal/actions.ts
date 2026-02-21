"use server";

import { connectDB } from "@/lib/db";
import { Property } from "@/models/Property";
import { Disposal } from "@/models/Disposal";
import { Case } from "@/models/Case";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function disposeProperty(formData: {
  propertyId: string;
  disposalType: string;
  courtOrderReference: string;
  disposalDate: string;
  disposalAuthority: string;
  remarks: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  if ((session.user as any).role !== "ADMIN") {
    throw new Error("Only admins can dispose properties");
  }

  await connectDB();

  const property = await Property.findById(formData.propertyId);
  if (!property || property.status === "DISPOSED") {
    throw new Error("Invalid property or already disposed");
  }

  await Disposal.create({
    propertyId: formData.propertyId,
    disposalType: formData.disposalType,
    courtOrderReference: formData.courtOrderReference,
    disposalDate: new Date(formData.disposalDate),
    disposalAuthority: formData.disposalAuthority,
    remarks: formData.remarks,
    handledBy: (session.user as any).id,
  });

  property.status = "DISPOSED";
  await property.save();

  // Auto-dispose case if all properties are disposed
  const remaining = await Property.countDocuments({
    caseId: property.caseId,
    status: { $ne: "DISPOSED" },
  });
  if (remaining === 0) {
    await Case.findByIdAndUpdate(property.caseId, { status: "DISPOSED" });
  }

  return { success: true };
}
