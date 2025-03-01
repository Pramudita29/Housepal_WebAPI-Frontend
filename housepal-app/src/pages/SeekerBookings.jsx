import { loadStripe } from "@stripe/stripe-js";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const stripePromise = loadStripe("pk_test_51QwnhfLwN9qJ226iuySukDs0srQUjjpISm3EcM8H7r0EwT1a0guGjoZaSENlsAz6W8uTd8XAfnCt6JzaRxWx36GW00rIcQxHOE");

const BookingCard = ({ booking, onReschedule, onRate, onPay }) => {
    console.log("BookingCard booking:", JSON.stringify(booking, null, 2));
    return (
        <div className="relative rounded-3xl bg-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-800">{booking.jobId?.jobTitle || booking.jobTitle || "Unknown Job"}</h3>
            <p className="mt-2 text-gray-700">
                Helper: {booking.helperDetails?.fullName || (booking.helperDetails ? "Name Not Set" : "No Helper Assigned")}
            </p>
            <p className="mt-2 text-gray-700">Email: {booking.helperDetails?.email || "N/A"}</p>
            <p className="mt-2 text-gray-700">Scheduled: {new Date(booking.scheduledDateTime).toLocaleString()}</p>
            <p className="mt-2 text-gray-700">
                Status: <span className={`capitalize ${booking.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>{booking.status}</span>
            </p>
            <div className="mt-4 flex gap-4 flex-wrap">
                {booking.status === "completed" ? (
                    <button onClick={() => onPay(booking)} className="px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600">
                        Pay Now
                    </button>
                ) : (
                    <button
                        onClick={() => onReschedule(booking)}
                        disabled={booking.status === "completed"}
                        className={`px-6 py-2 rounded-lg text-white ${booking.status === "completed" ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"}`}
                    >
                        Reschedule
                    </button>
                )}
                <button
                    onClick={() => onRate(booking)}
                    disabled={booking.status !== "completed"}
                    className={`px-6 py-2 rounded-lg text-white ${booking.status === "completed" ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    Rate Helper
                </button>
            </div>
        </div>
    );
};

const ReviewModal = ({ booking, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating < 1 || rating > 5) {
            alert("Rating must be between 1 and 5");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/review/create", {
                seekerId: user.email,
                helperId: booking.helperDetails?.email || "unknown",
                taskId: booking._id,
                rating,
                comments,
            });
            alert("Review submitted successfully!");
            onClose();
        } catch (err) {
            alert(`Failed to submit review: ${err.response?.data?.error || "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-3xl max-w-lg w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Rate Helper: {booking.helperDetails?.fullName || "No Helper Assigned"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Rating (1-5):</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(Math.min(5, Math.max(1, e.target.value)))}
                            className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Comments:</label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg mt-1 h-24"
                            placeholder="Share your experience..."
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 py-2 rounded-lg text-white ${isSubmitting ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"}`}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SeekerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) {
                setError("Please log in to view bookings.");
                setLoading(false);
                return;
            }

            try {
                console.log(`Fetching bookings for seeker: ${user.email}`);
                const res = await api.get("/tasks/seeker");
                console.log("Raw API response:", JSON.stringify(res.data, null, 2));
                setBookings(res.data);
                if (res.data.length === 0) {
                    console.log("No bookings found for seeker:", user.email);
                }

                const payment = searchParams.get("payment");
                if (payment === "success") setPaymentStatus("Payment successful!");
                else if (payment === "cancel") setPaymentStatus("Payment cancelled.");
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load bookings");
                console.error("Booking fetch error:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user, searchParams]);

    const handleReschedule = async (booking) => {
        const newDate = prompt("Enter new date and time (YYYY-MM-DD HH:mm):", new Date().toISOString().slice(0, 16));
        if (!newDate) return;

        try {
            const response = await api.post(`/job-applications/${booking.jobId?._id}/reschedule`, {
                applicationId: booking.applicationId,
                scheduledDateTime: new Date(newDate).toISOString(),
            });
            setBookings(bookings.map((b) => (b._id === booking._id ? response.data : b)));
            alert("Booking rescheduled successfully!");
        } catch (err) {
            alert(`Failed to reschedule: ${err.response?.data?.message || "Unknown error"}`);
        }
    };

    const handlePay = async (booking) => {
        try {
            let salaryRange = booking.jobId?.salaryRange || "0";
            const jobId = booking.jobId?._id || booking.jobId;

            // If jobId is a string and salaryRange is missing or invalid, fetch it
            if (typeof jobId === "string" && (!salaryRange || salaryRange === "0")) {
                const jobRes = await api.get(`/jobs/${jobId}`);
                salaryRange = jobRes.data.salaryRange || "0";
            }

            console.log("Initiating payment for booking:", booking._id, "with salaryRange:", salaryRange, "jobId:", jobId);

            // Validate salaryRange—accept NPR or $
            if (!salaryRange || salaryRange === "0" || (!salaryRange.includes("$") && !salaryRange.includes("NPR"))) {
                throw new Error(`Invalid salaryRange: ${salaryRange}`);
            }

            const response = await api.post("/create-checkout-session", {
                jobId,
                salaryRange,
            });
            console.log("Checkout session response:", response.data);
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId: response.data.id });
            if (error) {
                console.error("Stripe redirect error:", error);
                alert("Payment redirect failed: " + error.message);
            }
        } catch (err) {
            console.error("Error initiating payment:", err);
            if (err.message.includes("Blocked by Adblocker") || err.message.includes("Failed to fetch")) {
                alert("Payment initiation failed—please disable your adblocker and try again.");
            } else {
                alert("Failed to initiate payment: " + (err.message || "Unknown error"));
            }
        }
    };
    return (
        <div className="bg-[#faf8f4] min-h-screen flex flex-col">
            <NavBarPostLogin />
            <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
                <div className="relative mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
                        Your Bookings
                        <img src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg" alt="underline" className="mt-2 w-40 lg:w-64" />
                    </h1>
                    {paymentStatus && (
                        <p className={`mt-4 ${paymentStatus.includes("success") ? "text-green-600" : "text-red-500"}`}>
                            {paymentStatus}
                        </p>
                    )}
                </div>

                {loading && <p className="text-gray-700 mt-4 animate-pulse">Loading bookings...</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {!loading && !error && (
                    <div className="grid gap-9 mt-10 lg:grid-cols-3">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <BookingCard
                                    key={booking._id}
                                    booking={booking}
                                    onReschedule={handleReschedule}
                                    onRate={() => setSelectedBooking(booking)}
                                    onPay={handlePay}
                                />
                            ))
                        ) : (
                            <p className="text-gray-700 col-span-3">No bookings found.</p>
                        )}
                    </div>
                )}

                {selectedBooking && (
                    <ReviewModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
                )}
            </section>
            <Footer />
        </div>
    );
};

export default SeekerBookings;