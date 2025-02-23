import React, { useContext, useEffect, useState } from "react";
import Footer from "../components/footer";
import NavBarPostLogin from "../components/NavBarPostLogin";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const SeekerProfile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ postedJobs: 0, applications: 0 });
  const [paymentInfo, setPaymentInfo] = useState({ totalPayments: 0, payments: [] });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageError, setImageError] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setConnectionError(null);
      try {
        console.log("Fetching profile from /api/auth/me");
        const userRes = await api.get("/auth/me");
        console.log("Fetched user (profile):", JSON.stringify(userRes.data, null, 2));
        setUser(userRes.data);
        setFormData({
          fullName: userRes.data.fullName || "",
          email: userRes.data.email || "",
          contactNo: userRes.data.contactNo || "",
        });

        const jobsRes = await api.get("/jobs");
        const seekerJobs = jobsRes.data.filter((j) => j.posterEmail === userRes.data.email);
        console.log("Seeker jobs:", seekerJobs);

        let totalApplications = 0;
        for (const job of seekerJobs) {
          try {
            const appsRes = await api.get(`/job-applications/${job._id}/applications`);
            totalApplications += appsRes.data.length || 0;
          } catch (err) {
            console.warn(`No applications for job ${job._id}:`, err.message);
          }
        }
        console.log("Total applications:", totalApplications);
        setStats({
          postedJobs: seekerJobs.length || 0,
          applications: totalApplications,
        });

        const tasksRes = await api.get("/tasks/seeker");
        const completedTasks = tasksRes.data.filter((task) => task.status === "completed");
        const payments = completedTasks.map((task) => ({
          helperName: task.helperDetails?.fullName || "Unknown Helper",
          amount: task.jobId?.salaryRange ? parseInt(task.jobId.salaryRange.split("-")[0].replace("$", "")) : 0,
          jobTitle: task.jobId?.jobTitle || "Unknown Job",
          date: task.completionDateTime || task.scheduledDateTime,
        }));
        const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

        setPaymentInfo({
          totalPayments,
          payments,
        });
        console.log("Payment info:", { totalPayments, payments });
      } catch (err) {
        console.error("Error fetching profile data:", err.response?.data || err);
        if (err.code === "ERR_NETWORK") {
          setConnectionError("Server is unavailable. Please ensure it’s running and try again.");
        } else if (err.response?.status === 500) {
          setConnectionError("Server error occurred. Please try again later.");
        } else {
          setUser(null);
          setStats({ postedJobs: 0, applications: 0 });
          setPaymentInfo({ totalPayments: 0, payments: [] });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    const uploadData = new FormData();
    uploadData.append("image", file);
    uploadData.append("email", user?.email || "");
    try {
      console.log("Uploading image:", file.name);
      const res = await api.post("/seeker/uploadImage", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Image upload response:", res.data);
      setUser((prevUser) => ({ ...prevUser, image: res.data.imageUrl }));
      setImageError(null);
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Error uploading image:", err.response?.data || err);
      if (err.code === "ERR_NETWORK") {
        alert("Server is unavailable. Please ensure it’s running.");
      } else {
        alert("Failed to update profile picture: " + (err.response?.data?.message || "Unknown error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Submitting edit form with data:", { ...formData, id: user.id });
      const res = await api.put("/auth/update", { ...formData, id: user.id });
      console.log("Update response:", JSON.stringify(res.data, null, 2));
      setUser(res.data);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
      alert("Failed to update profile: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return "NA";
    const names = fullName.trim().split(" ");
    return names.map((name) => name[0]).join("").toUpperCase().substring(0, 2);
  };

  const handleImageError = (e) => {
    console.error("Image load failed:", user?.image, "Attempted URL:", e.target.src);
    setImageError("Failed to load image");
    e.target.style.display = "none";
  };

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        {isLoading ? (
          <p className="text-gray-700 text-center">Loading profile...</p>
        ) : connectionError ? (
          <div className="text-center py-4">
            <p className="text-red-500">{connectionError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
            >
              Retry
            </button>
          </div>
        ) : user ? (
          <>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)]">
                  Your Profile
                  <img
                    src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
                    alt="double-line"
                    className="mt-2 w-40"
                  />
                </h1>
                <div className="mt-6 flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden relative z-10">
                      {user.image ? (
                        <>
                          <img
                            src={`http://localhost:3000/api/images/${user.image.split(/[\/\\]/).pop()}`}
                            alt="profile"
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                          {imageError && (
                            <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold text-2xl">
                              {getInitials(user.fullName)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold text-2xl">
                          {getInitials(user.fullName)}
                        </div>
                      )}
                    </div>
                    {!user.image && !imageError && (
                      <div className="absolute inset-0 w-24 h-24 -translate-y-1 translate-x-1 rounded-2xl bg-emerald-500 z-0"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{user.fullName}</p>
                    <p className="text-gray-700">{user.email}</p>
                    <p className="text-gray-700">{user.contactNo || "Not set"}</p>
                    {imageError && <p className="text-red-500">{imageError}</p>}
                  </div>
                </div>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                  className="mt-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  accept="image/*"
                />
                <button
                  onClick={() => setEditMode(true)}
                  disabled={isLoading}
                  className="mt-4 ml-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 disabled:bg-gray-400"
                >
                  Edit Profile
                </button>
              </div>
              <img
                src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/green-curve-shape.svg"
                alt="curve"
                className="w-20 absolute right-0"
              />
            </div>

            {/* Edit Profile Modal */}
            {editMode && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-3xl max-w-lg w-full">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                  <form className="mt-4 space-y-4" onSubmit={handleEditSubmit}>
                    <div>
                      <label className="block text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 disabled:bg-gray-400"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        disabled={isLoading}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Stats and Payment */}
            <div className="grid gap-9 mt-10 lg:grid-cols-3">
              <div className="rounded-3xl bg-emerald-500 p-6 text-white shadow-lg">
                <h3 className="text-2xl font-bold">Posted Jobs</h3>
                <p className="text-4xl mt-2">{stats.postedJobs}</p>
              </div>
              <div className="rounded-3xl bg-emerald-500 p-6 text-white shadow-lg">
                <h3 className="text-2xl font-bold">Applications</h3>
                <p className="text-4xl mt-2">{stats.applications}</p>
              </div>
              <div className="rounded-3xl bg-emerald-500 p-6 text-white shadow-lg">
                <h3 className="text-2xl font-bold">Total Payments</h3>
                <p className="text-4xl mt-2">{paymentInfo.payments.length}</p>
              </div>
            </div>

            {/* Payment Receipts */}
            <div className="mt-10">
              <h2 className="text-3xl font-bold text-gray-800 font-[var(--font-family-heading)]">
                Payment Receipts
                <img
                  src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
                  alt="double-line"
                  className="mt-2 w-40"
                />
              </h2>
              <div className="grid gap-6 mt-6 lg:grid-cols-2">
                {paymentInfo.payments.length > 0 ? (
                  paymentInfo.payments.map((payment, index) => (
                    <div key={index} className="rounded-3xl bg-gray-200 p-6 shadow-lg">
                      <p className="text-gray-700">Paid to: {payment.helperName}</p>
                      <p className="text-gray-700">Amount: ${payment.amount}</p>
                      <p className="text-gray-700">Job: {payment.jobTitle}</p>
                      <p className="text-gray-600 text-sm">Date: {new Date(payment.date).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700">No payments made yet.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-700 text-center">Failed to load profile data.</p>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SeekerProfile;