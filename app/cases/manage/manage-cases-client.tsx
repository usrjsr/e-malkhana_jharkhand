"use client";

import { useState } from "react";
import Link from "next/link";

export default function ManageCasesClient() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [caseProperties, setCaseProperties] = useState<{ [key: string]: any[] }>({});
  const [loadingProperties, setLoadingProperties] = useState<{ [key: string]: boolean }>({});

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/cases?${params.toString()}`);
      const data = await res.json();
      setCases(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandCase = async (caseId: string) => {
    if (expandedCaseId === caseId) {
      setExpandedCaseId(null);
      return;
    }

    setExpandedCaseId(caseId);

    if (!caseProperties[caseId]) {
      setLoadingProperties(p => ({ ...p, [caseId]: true }));
      try {
        const res = await fetch(`/api/properties?caseId=${caseId}`);
        const data = await res.json();
        setCaseProperties(p => ({ ...p, [caseId]: data || [] }));
      } finally {
        setLoadingProperties(p => ({ ...p, [caseId]: false }));
      }
    }
  };

  const handleDownloadPDF = (caseId: string) => {
    window.open(`/api/case-pdf?caseId=${caseId}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Crime number, year, station, or officer name"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a]"
          />

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a]"
          >
            <option value="ALL">All Cases</option>
            <option value="PENDING">Pending</option>
            <option value="DISPOSED">Disposed</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-semibold"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
              setCases([]);
            }}
            className="w-full sm:w-auto bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold"
          >
            Clear
          </button>
        </div>
      </form>

      {cases.map(c => (
        <div key={c._id} className="bg-white border-2 border-gray-300 rounded-xl p-4">
          <div
            onClick={() => handleExpandCase(c._id)}
            className="cursor-pointer flex justify-between items-start"
          >
            <h4 className="text-lg font-bold text-[#1e3a8a]">
              Crime {c.crimeNumber}/{c.crimeYear}
            </h4>
            <span className="text-sm font-bold">{c.status}</span>
          </div>

          {expandedCaseId === c._id && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/cases/${c._id}`}
                  className="w-full sm:w-auto text-center bg-[#1e3a8a] text-white px-5 py-2.5 text-sm font-semibold rounded-lg"
                >
                  View Full Details
                </Link>

                <button
                  onClick={() => handleDownloadPDF(c._id)}
                  className="w-full sm:w-auto bg-[#28a745] text-white px-5 py-2.5 text-sm font-semibold rounded-lg"
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
