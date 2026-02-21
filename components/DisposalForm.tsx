"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { disposeProperty } from "@/app/cases/[caseId]/properties/[propertyId]/disposal/actions";

export default function DisposalForm() {
  const router = useRouter();
  const params = useParams();

  const caseId = params.caseId as string;
  const propertyId = params.propertyId as string;

  const [form, setForm] = useState({
    disposalType: "",
    courtOrderReference: "",
    disposalDate: "",
    disposalAuthority: "",
    remarks: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const d = new Date(form.disposalDate);
    if (isNaN(d.getTime())) {
      setError("Invalid disposal date");
      setLoading(false);
      return;
    }

    try {
      await disposeProperty({
        propertyId,
        disposalType: form.disposalType,
        courtOrderReference: form.courtOrderReference,
        disposalDate: form.disposalDate,
        disposalAuthority: form.disposalAuthority,
        remarks: form.remarks,
      });
      router.replace(`/cases/${caseId}/properties/${propertyId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to dispose property",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-[#dc3545] p-5 rounded-r-lg shadow-sm">
        <h4 className="font-bold text-[#dc3545] mb-4 text-lg flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Disposal Details
        </h4>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="disposalType"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Disposal Type *
            </label>
            <select
              id="disposalType"
              name="disposalType"
              value={form.disposalType}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#dc3545] focus:ring-2 focus:ring-[#dc3545] focus:ring-opacity-20 transition-all duration-200"
              required
              disabled={loading}
            >
              <option value="">Select Disposal Type</option>
              <option value="RETURNED">✓ Returned to Owner</option>
              <option value="DESTROYED">🔥 Destroyed</option>
              <option value="AUCTIONED">💰 Auctioned</option>
              <option value="COURT_CUSTODY">⚖️ Court Custody</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose the method of disposal as per court order
            </p>
          </div>

          <div>
            <label
              htmlFor="courtOrderReference"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Court Order Reference *
            </label>
            <input
              id="courtOrderReference"
              name="courtOrderReference"
              type="text"
              placeholder="e.g., Order No. 123/2025 dated 01-01-2025"
              value={form.courtOrderReference}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#dc3545] focus:ring-2 focus:ring-[#dc3545] focus:ring-opacity-20 transition-all duration-200"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the complete court order reference number
            </p>
          </div>

          <div>
            <label
              htmlFor="disposalDate"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Date of Disposal *
            </label>
            <input
              id="disposalDate"
              name="disposalDate"
              type="date"
              value={form.disposalDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#dc3545] focus:ring-2 focus:ring-[#dc3545] focus:ring-opacity-20 transition-all duration-200"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Date when the property was disposed
            </p>
          </div>

          <div>
            <label
              htmlFor="disposalAuthority"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Disposal Authority *
            </label>
            <input
              id="disposalAuthority"
              name="disposalAuthority"
              type="text"
              placeholder="e.g., District Court Judge, Magistrate Name"
              value={form.disposalAuthority}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#dc3545] focus:ring-2 focus:ring-[#dc3545] focus:ring-opacity-20 transition-all duration-200"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Authority who authorized the disposal
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-[#1e3a8a] p-5 rounded-r-lg shadow-sm">
        <h4 className="font-bold text-[#1e3a8a] mb-4 text-lg flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          Additional Information
        </h4>

        <div>
          <label
            htmlFor="remarks"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Remarks / Notes
          </label>
          <textarea
            id="remarks"
            name="remarks"
            placeholder="Enter any additional details about the disposal process, witnesses present, condition of property, etc."
            value={form.remarks}
            onChange={handleChange}
            rows={4}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 resize-none transition-all duration-200"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Provide additional context or details
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4 rounded-r-lg shadow-md animate-shake">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-[#721c24] mr-2 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-[#721c24] font-semibold">{error}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#dc3545] text-white py-3 rounded-lg font-bold hover:bg-[#c82333] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing Disposal...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Confirm Disposal
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all duration-300 shadow-md"
        >
          Cancel
        </button>
      </div>

      <div className="bg-[#f8d7da] border-l-4 border-[#721c24] p-4 rounded-r-lg">
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-[#721c24] mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h4 className="font-bold text-[#721c24] mb-1">Final Warning</h4>
            <p className="text-sm text-[#721c24]">
              By clicking "Confirm Disposal", you acknowledge that this action
              is <strong>permanent and cannot be undone</strong>. The property
              will be marked as disposed and removed from active custody.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
