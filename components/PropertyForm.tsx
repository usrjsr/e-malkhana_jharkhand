"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProperty } from "@/app/cases/[caseId]/properties/new/actions";

export default function PropertyForm({ caseId }: { caseId: string }) {
  const router = useRouter();

  const [form, setForm] = useState({
    category: "",
    belongingTo: "UNKNOWN",
    natureOfProperty: "",
    quantity: "",
    units: "",
    storageLocation: "",
    description: "",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!imageUrl) {
      setError("Please upload a property image before submitting");
      setIsLoading(false);
      return;
    }

    try {
      const result = await createProperty({
        caseId,
        category: form.category,
        belongingTo: form.belongingTo,
        natureOfProperty: form.natureOfProperty,
        quantity: form.quantity,
        units: form.units,
        storageLocation: form.storageLocation,
        description: form.description,
        itemImage: imageUrl,
      });

      router.replace(`/cases/${caseId}/properties/${result.propertyId}`);
    } catch (err) {
      setError("Failed to add property. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-[#1e3a8a] text-white px-6 py-5">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Property Registration Form
          </h3>
          <p className="text-sm text-blue-200 mt-1">
            All fields marked with * are mandatory
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Upload Section */}
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Property Image Upload
            </h4>

            <div className="space-y-4">
              {imageUrl ? (
                <div className="flex items-start gap-4">
                  <img
                    src={imageUrl}
                    alt="Uploaded property"
                    className="w-48 h-48 object-cover border-2 border-gray-300 rounded-lg shadow-md"
                  />
                  <div className="flex-1">
                    <div className="bg-[#d4edda] border-l-4 border-[#28a745] p-4 rounded-r-lg shadow-sm">
                      <div className="flex items-start">
                        <svg
                          className="w-6 h-6 text-[#155724] mr-3 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-[#155724] font-bold">
                            Image uploaded successfully!
                          </p>
                          <p className="text-xs text-[#155724] mt-1">
                            You can now proceed to fill property details
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="mt-3 text-sm text-[#dc3545] hover:text-[#c82333] font-semibold transition-colors"
                    >
                      ✕ Remove and upload different image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 p-10 text-center bg-white rounded-lg hover:border-[#1e3a8a] transition-colors">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-700 font-bold mb-2">
                    Upload Property Image *
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Click below to select and upload a clear image of the seized
                    property (JPEG, PNG, WebP — max 10MB)
                  </p>
                  <label className="inline-block cursor-pointer bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors">
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      "Choose Image"
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Classification Section */}
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Property Classification
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Category of Property *
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="e.g., Electronics, Jewelry, Vehicle"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="belongingTo"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Belonging To *
                </label>
                <select
                  id="belongingTo"
                  name="belongingTo"
                  value={form.belongingTo}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="ACCUSED">Accused</option>
                  <option value="COMPLAINANT">Complainant</option>
                  <option value="UNKNOWN">Unknown</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="natureOfProperty"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nature of Property *
                </label>
                <input
                  id="natureOfProperty"
                  name="natureOfProperty"
                  type="text"
                  placeholder="e.g., Mobile Phone, Gold Chain, Motorcycle"
                  value={form.natureOfProperty}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Quantity & Storage Section */}
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Quantity & Storage
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Quantity *
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="text"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="units"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Units *
                </label>
                <input
                  id="units"
                  name="units"
                  type="text"
                  placeholder="e.g., pieces, grams, liters"
                  value={form.units}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="storageLocation"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Storage Location *
                </label>
                <input
                  id="storageLocation"
                  name="storageLocation"
                  type="text"
                  placeholder="e.g., Rack A-12, Room 3, Locker 45"
                  value={form.storageLocation}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
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
              Property Description
            </h4>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter detailed description including brand, model, color, serial number, unique identifiers, condition, etc."
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] focus:ring-opacity-20 resize-none transition-all duration-200"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Provide as much detail as possible for identification purposes
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

          <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded-r-lg shadow-sm">
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
                  After saving, a unique QR code will be generated for this
                  property. You can print it and attach it to the physical
                  property for easy tracking.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading || !imageUrl}
              className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-lg font-bold hover:bg-[#1e40af] transition-all duration-300 border-2 border-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
                  Saving Property...
                </span>
              ) : (
                "SAVE PROPERTY & GENERATE QR CODE"
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
