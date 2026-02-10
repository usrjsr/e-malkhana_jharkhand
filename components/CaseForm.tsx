"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCase } from "@/app/cases/new/actions";

export default function CaseForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    policeStationName: "",
    investigatingOfficerName: "",
    investigatingOfficerId: "",
    crimeNumber: "",
    crimeYear: new Date().getFullYear().toString(),
    dateOfFIR: "",
    dateOfSeizure: "",
    actAndLaw: "",
    sections: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (new Date(form.dateOfFIR) > new Date()) {
      setError("Date of FIR cannot be in the future");
      setIsLoading(false);
      return;
    }

    if (new Date(form.dateOfSeizure) > new Date()) {
      setError("Date of Seizure cannot be in the future");
      setIsLoading(false);
      return;
    }

    if (new Date(form.dateOfSeizure) < new Date(form.dateOfFIR)) {
      setError("Date of Seizure cannot be before Date of FIR");
      setIsLoading(false);
      return;
    }

    try {
      const result = await createCase(form);
      router.replace(`/cases/${result.caseId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create case");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-300">
      <div className="bg-[#1e3a8a] text-white px-6 py-4">
        <h3 className="text-xl font-bold">Case Information Form</h3>
        <p className="text-sm text-blue-200 mt-1">
          All fields marked with * are mandatory
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
          <h4 className="font-bold text-[#1e3a8a] mb-4">
            Station & Officer Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="policeStationName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Police Station Name *
              </label>
              <input
                id="policeStationName"
                name="policeStationName"
                type="text"
                placeholder="Enter police station name"
                value={form.policeStationName}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="investigatingOfficerName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Investigating Officer Name *
              </label>
              <input
                id="investigatingOfficerName"
                name="investigatingOfficerName"
                type="text"
                placeholder="Enter officer name"
                value={form.investigatingOfficerName}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="investigatingOfficerId"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Investigating Officer ID *
              </label>
              <input
                id="investigatingOfficerId"
                name="investigatingOfficerId"
                type="text"
                placeholder="Enter officer ID number"
                value={form.investigatingOfficerId}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
          <h4 className="font-bold text-[#1e3a8a] mb-4">Crime Details</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="crimeNumber"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Crime Number *
              </label>
              <input
                id="crimeNumber"
                name="crimeNumber"
                type="text"
                placeholder="Enter crime number"
                value={form.crimeNumber}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="crimeYear"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Crime Year *
              </label>
              <select
                id="crimeYear"
                name="crimeYear"
                value={form.crimeYear}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              >
                {Array.from(
                  { length: 10 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="dateOfFIR"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Date of FIR *
              </label>
              <input
                id="dateOfFIR"
                name="dateOfFIR"
                type="date"
                value={form.dateOfFIR}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="dateOfSeizure"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Date of Seizure *
              </label>
              <input
                id="dateOfSeizure"
                name="dateOfSeizure"
                type="date"
                value={form.dateOfSeizure}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
          <h4 className="font-bold text-[#1e3a8a] mb-4">Legal Information</h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="actAndLaw"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Act & Law *
              </label>
              <input
                id="actAndLaw"
                name="actAndLaw"
                type="text"
                placeholder="e.g., Indian Penal Code, NDPS Act, etc."
                value={form.actAndLaw}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="sections"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Sections of Law *
              </label>
              <textarea
                id="sections"
                name="sections"
                placeholder="e.g., Section 302, 307, 34 IPC"
                value={form.sections}
                onChange={handleChange}
                rows={3}
                className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a] resize-none"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4">
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

        <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-[#856404] mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="font-bold text-[#856404] mb-1">Next Steps</h4>
              <p className="text-sm text-[#856404]">
                After creating the case, you will be able to add seized
                properties, track chain of custody, and manage case disposal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#1e3a8a] text-white py-3 font-bold hover:bg-[#1e40af] transition-colors border-2 border-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
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
                Creating Case...
              </span>
            ) : (
              "CREATE CASE"
            )}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-8 py-3 font-bold hover:bg-gray-300 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </form>
  );
}
