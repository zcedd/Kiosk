import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AnnouncementItem from "@/Components/AnnouncementItem";
import VacancyModal from "@/Components/VacancyModal";
import SpecializationDropdown from "@/Components/SpecializationDropdown";
import JobTypeDropdown from "@/Components/JobTypeDropdown";
import SalaryFromDropdown from "@/Components/SalaryFromDropdown";
import SalaryToDropdown from "@/Components/SalaryToDropdown";
import PostedDateDropdown from "@/Components/PostedDateDropdown";

export default function VacancySearch({ vacancies, activities }) {
    const { url } = usePage();
    const initialShowCharter = url.includes("/withcharter");
    const [showCharter] = useState(initialShowCharter);

    const [showQR, setShowQR] = useState(null);
    const [filters, setFilters] = useState({
        specialization: [],
        job_type: "",
        salary_from: "",
        salary_to: "",
        posted_date: "",
    });

    useEffect(() => {
        const delay = setTimeout(() => {
            const route = showCharter ? "/withcharter" : "/withoutcharter";
            router.get(route, filters, { preserveState: true, replace: true });
        }, 400);
        return () => clearTimeout(delay);
    }, [filters, showCharter]);

    function toTitleCase(str) {
        if (!str) return "";
        return str.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );
    }

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* LEFT COLUMN – Announcements + Filters */}
            <div
                className="flex flex-col border-r border-slate-300 p-4 flex-shrink-0"
                style={{ width: "25%" }}
            >
                {/* Logo + Search */}
                <div className="flex-shrink-0 mb-4">
                    <img
                        className="h-[60px] mx-auto mb-4"
                        src="./images/work.png"
                        alt="logo"
                    />
                    <input
                        type="text"
                        placeholder="Search job vacancies..."
                        value={filters.search}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                search: e.target.value,
                            }))
                        }
                        className="w-full text-[#074797] rounded-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#074797] shadow-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 px-2 mb-4">
                    <SpecializationDropdown
                        specializations={filters.specialization}
                        onChange={(selectedIds) =>
                            setFilters((prev) => ({
                                ...prev,
                                specialization: selectedIds,
                            }))
                        }
                    />
                    <JobTypeDropdown
                        value={filters.job_type}
                        onChange={(selectedType) =>
                            setFilters((prev) => ({
                                ...prev,
                                job_type: selectedType,
                            }))
                        }
                    />
                    <SalaryFromDropdown
                        value={filters.salary_from}
                        onChange={(value) =>
                            setFilters((prev) => ({
                                ...prev,
                                salary_from: value,
                            }))
                        }
                    />
                    <SalaryToDropdown
                        value={filters.salary_to}
                        onChange={(value) =>
                            setFilters((prev) => ({
                                ...prev,
                                salary_to: value,
                            }))
                        }
                        salaryFrom={filters.salary_from}
                    />
                    <PostedDateDropdown
                        value={filters.posted_date}
                        onChange={(value) =>
                            setFilters((prev) => ({
                                ...prev,
                                posted_date: value,
                            }))
                        }
                    />
                </div>

                {/* Announcements Header */}
                <h1 className="text-xl font-bold flex items-center gap-2 mb-2 text-[#074797]">
                    <img
                        src="./images/horn.png"
                        alt="horn"
                        className="h-6 w-6"
                    />
                    Announcements
                </h1>

                {/* Announcements List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {activities.length === 0 ? (
                        <p className="text-gray-500 text-center text-sm">
                            No announcements yet.
                        </p>
                    ) : (
                        activities.map((a) => (
                            <AnnouncementItem key={a.id} activity={a} />
                        ))
                    )}
                </div>

                {/* Footer Logos */}
                <div className="flex-shrink-0 pt-3 text-center border-t mt-3">
                    <div className="flex justify-center items-center gap-4 mb-2">
                        <img
                            src="./images/bagong-pilipinas.png"
                            className="h-[50px]"
                        />
                        <img src="./images/logo.png" className="h-[40px]" />
                        <img src="./images/peso.png" className="h-[50px]" />
                    </div>
                    <p className="text-xs text-[#074797]">
                        Powered by the Information Technology Office.
                    </p>
                </div>
            </div>

            {/* MIDDLE COLUMN */}
            <div
                className={`flex flex-col flex-grow overflow-y-auto p-4 border-r border-slate-300 ${
                    showCharter ? "w-[40%]" : "w-[70%]"
                }`}
            >
                <h2 className="text-xl font-bold text-[#074797] mb-3">
                    Job Vacancies
                </h2>
                <div className="flex-1 overflow-y-auto pr-1">
                    {vacancies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-gray-500 h-full">
                            <img
                                src="./images/page-not-found.png"
                                className="h-24 w-24 mb-3"
                                alt="none"
                            />
                            <p>No vacancies found.</p>
                        </div>
                    ) : (
                        <div
                            className={`grid gap-4 ${
                                showCharter
                                    ? "grid-cols-1 sm:grid-cols-2"
                                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            }`}
                        >
                            {vacancies.map((vacancy) => (
                                <div
                                    key={vacancy.id}
                                    className="p-4 border rounded-2xl shadow-md bg-white hover:shadow-[0_0_20px_rgba(7,71,151,0.3)] transition-all duration-300"
                                    onClick={() => setShowQR(vacancy)}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={
                                                vacancy.company?.logo
                                                    ? `https://workinilocosnorte.ph/storage/company/${vacancy.company.logo}`
                                                    : "/images/work.png"
                                            }
                                            onError={(e) =>
                                                (e.currentTarget.src =
                                                    "/images/work.png")
                                            }
                                            className="w-16 h-16 mb-3 object-contain"
                                            alt="logo"
                                        />
                                        <h3 className="font-semibold">
                                            {vacancy.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {vacancy.company?.name ||
                                                "Unknown Company"}
                                        </p>
                                        <p className="text-gray-700 text-sm font-semibold mt-2">
                                            {vacancy.salary_from &&
                                            vacancy.salary_to
                                                ? `₱${vacancy.salary_from.toLocaleString()} - ₱${vacancy.salary_to.toLocaleString()}`
                                                : "Salary not specified"}
                                        </p>
                                    </div>
                                    <button
                                        className="mt-3 px-3 py-2 w-full bg-[#074797] text-white text-sm rounded hover:bg-[#0a2e59] flex items-center justify-center gap-2"
                                        onClick={() => setShowQR(vacancy)}
                                    >
                                        More Details
                                        <img
                                            src="./images/press.png"
                                            className="h-4 w-4"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN */}
            {showCharter && (
                <div
                    className="flex flex-col flex-shrink-0 border-l border-slate-300 p-4"
                    style={{ width: "30%" }}
                >
                    <h2 className="text-xl font-bold mb-2 text-[#074797]">
                        Citizens Charter
                    </h2>

                    <embed
                        src="/files/Citizens-charter2k25.pdf#toolbar=0"
                        className="w-full h-[95vh] border rounded"
                        title="Citizens Charter"
                    />
                </div>
            )}

            <VacancyModal
                showQR={showQR}
                setShowQR={setShowQR}
                toTitleCase={toTitleCase}
            />
        </div>
    );
}
