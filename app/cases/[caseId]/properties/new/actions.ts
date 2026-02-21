"use server";

import { connectDB } from "@/lib/db";
import { Property } from "@/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QRCode from "qrcode";

export async function createProperty(data: {
  caseId: string;
  category: string;
  belongingTo: string;
  natureOfProperty: string;
  quantity: string;
  units: string;
  storageLocation: string;
  description: string;
  itemImage: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  await connectDB();

  const property = await Property.create({
    caseId: data.caseId,
    category: data.category,
    belongingTo: data.belongingTo,
    natureOfProperty: data.natureOfProperty,
    quantity: Number(data.quantity),
    units: data.units,
    storageLocation: data.storageLocation,
    description: data.description,
    itemImage: data.itemImage,
    seizingOfficer: (session.user as any).id,
  });

  const qrData = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/properties/${property._id}/qr`;
  const qrCode = await QRCode.toDataURL(qrData);

  property.qrCode = qrCode;
  await property.save();

  return {
    propertyId: property._id.toString(),
  };
}
