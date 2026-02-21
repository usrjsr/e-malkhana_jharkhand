import {connectDB} from "@/lib/db"
import {Case} from "@/models/Case";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ManageCasesClient from "@/app/cases/manage/manage-cases-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const totalCases = await Case.countDocuments({});
  const pendingCases = await Case.countDocuments({ status: "PENDING" });
  const disposedCases = await Case.countDocuments({ status: "DISPOSED" });

  const threshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const alertCases = await Case.countDocuments({
    status: "PENDING",
    createdAt: { $lt: threshold }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-2">
              Dashboard Overview
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Evidence and Case Management
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {(session.user as any)?.role === "ADMIN" && (
              <Link
                href="/users/new"
                className="w-full sm:w-auto text-center bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e3a8a] hover:text-white transition shadow-md"
              >
                + Add User
              </Link>
            )}

            <Link
              href="/cases/new"
              className="w-full sm:w-auto text-center bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e40af] transition border-2 border-[#1e3a8a] shadow-md"
            >
              + New Case
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-[#1e3a8a] p-6 rounded-xl shadow-lg">
            <p className="text-5xl font-bold text-[#1e3a8a] mb-2">{totalCases}</p>
            <p className="text-sm text-gray-500">Total Cases</p>
          </div>

          <div className="bg-white border-2 border-[#ffc107] p-6 rounded-xl shadow-lg">
            <p className="text-5xl font-bold text-[#ffc107] mb-2">{pendingCases}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>

          <div className="bg-white border-2 border-[#28a745] p-6 rounded-xl shadow-lg">
            <p className="text-5xl font-bold text-[#28a745] mb-2">{disposedCases}</p>
            <p className="text-sm text-gray-500">Disposed</p>
          </div>

          <Link
            href="/alerts"
            className="bg-white border-2 border-[#dc3545] p-6 rounded-xl shadow-lg hover:border-[#c82333] transition"
          >
            <p className="text-5xl font-bold text-[#dc3545] mb-2">{alertCases}</p>
            <p className="text-sm text-gray-500">Alerts</p>
          </Link>
        </div>

        {alertCases > 0 && (
          <div className="mb-8 bg-[#fff3cd] border-l-4 border-[#ffc107] p-5 rounded-lg shadow-md">
            <p className="text-[#856404]">
              You have <span className="font-bold">{alertCases}</span> case(s)
              pending for more than 7 days.
            </p>
          </div>
        )}

        <div className="bg-white border-2 border-gray-300 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">
            Manage Entries
          </h3>
          <ManageCasesClient />
        </div>
      </div>
    </div>
  );
}
