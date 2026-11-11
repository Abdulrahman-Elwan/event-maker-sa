"use client";

import { FiCheckCircle, FiAlertCircle, FiX, } from "react-icons/fi";

interface BookingSuccessProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

export default function BookingSuccess({ message, type, onClose, }: BookingSuccessProps) {
    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="presentation" >
            <div role="dialog" aria-modal="true" aria-live={isSuccess ? "polite" : "assertive"} className="relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-300 rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-9" >
                {/* Close Button */}
                <button type="button" onClick={onClose} aria-label="Close message"
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
                >
                    <FiX size={19} />
                </button>

                {/* Status Icon */}
                <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${isSuccess ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`} >
                    {isSuccess ? (<FiCheckCircle size={42} />) : (<FiAlertCircle size={42} />)}
                </div>

                {/* Heading */}
                <h2 className={`mb-3 text-xl font-bold sm:text-2xl ${isSuccess ? "text-emerald-700" : "text-red-700"}`} >
                    {isSuccess ? "تم إرسال التسجيل بنجاح" : "تعذر إرسال التسجيل"}
                </h2>

                {/* Message */}
                <p className={`text-sm leading-8 sm:text-base ${isSuccess ? "text-gray-600" : "text-gray-700"}`} >
                    {message}
                </p>

                {/* Close Button */}
                <button type="button" onClick={onClose}
                    className={`mt-7 w-full rounded-xl px-6 py-3 text-sm font-bold text-white transition duration-300 hover:opacity-90 sm:w-auto sm:min-w-40 ${isSuccess ? "bg-emerald-600" : "bg-red-600"}`}
                >
                    إغلاق
                </button>
            </div>
        </div>
    );
}