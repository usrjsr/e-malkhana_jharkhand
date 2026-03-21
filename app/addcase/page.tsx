import Link from "next/link"
export default function AddCase() {

    return (
        <div className="">
            <Link
                href="/cases/new"
                className="w-full sm:w-auto text-center bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e40af] transition border-2 border-[#1e3a8a] shadow-md"
            >
                + Claimed Property
            </Link>
            <Link
                href="/properties/new"
                className="w-full sm:w-auto text-center bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#1e40af] transition border-2 border-[#1e3a8a] shadow-md"
            >
                + Unclaimed Property
            </Link>

        </div>
    )

}