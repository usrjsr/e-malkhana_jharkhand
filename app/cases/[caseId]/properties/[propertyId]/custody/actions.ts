"use server";

import { connectDB } from "@/lib/db";
import { CustodyLog } from "@/models/CustodyLog";
import { Property } from "@/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addCustodyLog(formData: {
  propertyId: string;
  fromOfficer: string;
  toOfficer: string;
  fromLocation: string;
  toLocation: string;
  purpose: string;
  action: string;
  remarks: string;
  movementTimestamp: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  await connectDB();

  const property = await Property.findById(formData.propertyId);
  if (!property) {
    throw new Error("Property not found");
  }

  if (property.status === "DISPOSED") {
    throw new Error("Cannot add custody log to disposed property");
  }

  await CustodyLog.create({
    propertyId: formData.propertyId,
    fromOfficer: formData.fromOfficer,
    toOfficer: formData.toOfficer,
    fromLocation: formData.fromLocation,
    toLocation: formData.toLocation,
    purpose: formData.purpose,
    action: formData.action,
    remarks: formData.remarks,
    handler: (session.user as any).id,
    movementTimestamp: formData.movementTimestamp
      ? new Date(formData.movementTimestamp)
      : new Date(),
  });

  // Update property status based on action
  if (formData.action === "MOVED") {
    property.status = "IN_TRANSIT";
  } else if (formData.action === "RECEIVED") {
    property.status = "SEIZED";
  }
  property.lastMovementAt = new Date();
  await property.save();

  return { success: true };
}
