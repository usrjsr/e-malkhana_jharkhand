"use client";

import { useState } from "react";
import { addCustodyLog } from "@/app/cases/[caseId]/properties/[propertyId]/custody/actions";

export default function CustodyForm({
  propertyId,
  onSuccess,
}: {
  propertyId: string;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    fromOfficer: "",
    toOfficer: "",
    fromLocation: "",
    toLocation: "",
    purpose: "STORAGE",
    action: "MOVED",
    remarks: "",
    movementTimestamp: "",
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

    try {
      await addCustodyLog({
        propertyId,
        fromOfficer: form.fromOfficer,
        toOfficer: form.toOfficer,
        fromLocation: form.fromLocation,
        toLocation: form.toLocation,
        purpose: form.purpose,
        action: form.action,
        remarks: form.remarks,
        movementTimestamp: form.movementTimestamp,
      });

      setForm({
        fromOfficer: "",
        toOfficer: "",
        fromLocation: "",
        toLocation: "",
        purpose: "STORAGE",
        action: "MOVED",
        remarks: "",
        movementTimestamp: "",
      });

      setLoading(false);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add custody entry",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fromOfficer"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            From Officer *
          </label>
          <input
            id="fromOfficer"
            name="fromOfficer"
            placeholder="e.g., Inspector Sharma"
            value={form.fromOfficer}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="toOfficer"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            To Officer
          </label>
          <input
            id="toOfficer"
            name="toOfficer"
            placeholder="e.g., Sub-Inspector Verma"
            value={form.toOfficer}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fromLocation"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            From Location *
          </label>
          <input
            id="fromLocation"
            name="fromLocation"
            placeholder="e.g., Malkhana Room 3"
            value={form.fromLocation}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="toLocation"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            To Location *
          </label>
          <input
            id="toLocation"
            name="toLocation"
            placeholder="e.g., Court / FSL Lab"
            value={form.toLocation}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="purpose"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Purpose *
        </label>
        <select
          id="purpose"
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
          required
          disabled={loading}
        >
          <option value="STORAGE">Storage</option>
          <option value="COURT">Court Presentation</option>
          <option value="FSL">FSL Analysis</option>
          <option value="ANALYSIS">Analysis/Examination</option>
          <option value="TRANSFER">Transfer</option>
          <option value="DISPOSAL">Disposal</option>
          <option value="RELEASE">Release</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="action"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Action *
        </label>
        <select
          id="action"
          name="action"
          value={form.action}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
          required
          disabled={loading}
        >
          <option value="MOVED">Moved</option>
          <option value="RECEIVED">Received</option>
          <option value="DISPOSED">Disposed</option>
          <option value="RELEASED">Released</option>
        </select>
      </div>
      </div>

      <div>
        <label
          htmlFor="movementTimestamp"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Date & Time *
        </label>
        <input
          id="movementTimestamp"
          type="datetime-local"
          name="movementTimestamp"
          value={form.movementTimestamp}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="remarks"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Remarks *
        </label>
        <textarea
          id="remarks"
          name="remarks"
          placeholder="Enter details about this custody transfer"
          value={form.remarks}
          onChange={handleChange}
          rows={3}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 resize-none transition-all duration-200"
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-3 rounded-r-lg">
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-bold hover:bg-[#1e40af] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
            Adding Entry...
          </span>
        ) : (
          "Add Custody Entry"
        )}
      </button>
    </form>
  );
}
