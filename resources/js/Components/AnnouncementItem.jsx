import { MdLocationOn } from "react-icons/md";
import { FaRegCalendarCheck, FaRegCalendarTimes } from "react-icons/fa";
//this is a comment
export default function AnnouncementItem({ activity }) {
    const textDetails =
        new DOMParser().parseFromString(activity.details, "text/html").body
            .textContent || "";

    const companies = activity.related_companies
        ? activity.related_companies.split(" | ")
        : [];

    return (
        <div className="text-sm text-gray-800 border-b border-gray-200 pb-4 mb-3">
            {/* Type */}
            <div className="px-8 font-extrabold mb-4">{activity.type}</div>

            {/* Companies */}
            {companies.length > 0 && (
                <div className="px-8 text-xs text-gray-500 mb-2">
                    Companies:
                    <div className="flex flex-wrap gap-2 mt-1">
                        {companies.map((company, idx) => (
                            <span
                                key={idx}
                                className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full"
                            >
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Dates + Venue */}
            <div className="px-8 text-xs text-gray-500 mt-3 space-y-1">
                <div className="flex items-center space-x-1 mb-1">
                    <FaRegCalendarCheck className="text-blue-500" size={18} />
                    <span className="text-xs font-semibold">
                        {new Date(activity.start).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </span>
                </div>

                <div className="flex items-center space-x-1 mb-1">
                    <FaRegCalendarTimes className="text-red-600" size={18} />
                    <span className="text-xs font-semibold">
                        {new Date(activity.end).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </span>
                </div>

                <div className="flex items-center space-x-1">
                    <MdLocationOn className="text-red-500" size={19} />
                    <span className="text-gray-500 text-xs font-semibold">
                        {activity.venue}
                    </span>
                </div>
            </div>
        </div>
    );
}
