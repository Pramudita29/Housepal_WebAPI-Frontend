import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const ApplicationCard = ({ app, onClick }) => (
  <div
    onClick={() => onClick(app)}
    className="relative rounded-3xl bg-gray-200 p-6 shadow-lg hover:scale-105 transition-transform cursor-pointer hover:bg-gray-100"
  >
    <h3 className="text-2xl font-bold text-gray-800">{app.helperDetails?.fullName || "Unknown Helper"}</h3>
    <p className="mt-2 text-gray-700">Email: {app.helperDetails?.email || "N/A"}</p>
    <p className="mt-2 text-gray-700">Contact: {app.helperDetails?.contactNo || "N/A"}</p>
    <p className="mt-2 text-gray-700">Job: {app.jobId?.jobTitle || "Unknown Job Title"}</p>
    <p className="mt-2 text-gray-700">
      Status: <span className={`capitalize ${app.status === "accepted" ? "text-green-600" : app.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}>{app.status || "Unknown"}</span>
    </p>
    <img src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/globe.svg" alt="globe" className="absolute bottom-4 right-4 w-16 opacity-50" />
  </div>
);

const SeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [helperReviews, setHelperReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setError("Please log in to view applications.");
      setLoading(false);
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    const fetchAllApplications = async () => {
      try {
        console.log(`Fetching jobs for seeker: ${user.email}`);
        const jobsRes = await api.get("/jobs");
        const seekerJobs = jobsRes.data.filter((job) => job.posterEmail === user.email);
        console.log("Seeker jobs:", seekerJobs);

        if (seekerJobs.length === 0) {
          setError("No jobs posted yet. Post a job to receive applications.");
          setLoading(false);
          return;
        }

        const allApplications = [];
        for (const job of seekerJobs) {
          console.log(`Fetching applications for job: ${job._id}`);
          try {
            const appsRes = await api.get(`/job-applications/${job._id}/applications`);
            if (Array.isArray(appsRes.data)) {
              allApplications.push(...appsRes.data);
            }
          } catch (err) {
            console.warn(`No applications or error for job ${job._id}:`, err.message);
          }
        }

        console.log("All applications fetched:", allApplications);
        setApplications(allApplications);
        if (allApplications.length === 0) {
          setError("No applications found for your posted jobs.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load applications");
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllApplications();
  }, [user, navigate]);

  const fetchReviewsForApplication = async (app) => {
    try {
      const helperEmail = app.helperDetails.email;
      console.log(`Fetching reviews for helper: ${helperEmail}`);
      const reviewsRes = await api.get(`/review/helper/${encodeURIComponent(helperEmail)}`);
      console.log(`Reviews for ${helperEmail}:`, reviewsRes.data);
      setHelperReviews({ [helperEmail]: reviewsRes.data || [] });
      setSelectedApp(app);
    } catch (err) {
      console.warn(`No reviews for helper ${app.helperDetails.email}:`, err.message);
      setHelperReviews({ [app.helperDetails.email]: [] });
      setSelectedApp(app);
    }
  };

  const handleStatusChange = async (applicationId, jobId, status) => {
    try {
      console.log(`Updating status for application ${applicationId} to ${status}`);
      const res = await api.put(`/job-applications/${jobId}/applications/${applicationId}/status`, { status });
      console.log("Status update response:", res.data);

      // Update applications state
      setApplications(applications.map((app) =>
        app._id === applicationId ? { ...app, status } : app
      ));
      if (selectedApp && selectedApp._id === applicationId) {
        setSelectedApp({ ...selectedApp, status });
      }

      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      alert(`Failed to update status: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  const renderStars = (rating) => {
    const maxRating = 5;
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(maxRating - rating);
    return (
      <span className="text-yellow-500">
        {filledStars}
        <span className="text-gray-400">{emptyStars}</span>
      </span>
    );
  };

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <div className="relative mb-10">
          <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
            All Job Applications
            <img src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg" alt="underline" className="mt-2 w-40 lg:w-64" />
          </h1>
        </div>

        {loading && <p className="text-gray-700 mt-4 animate-pulse">Loading applications...</p>}
        {error && (
          <div>
            <p className="text-red-500 mt-4">{error}</p>
            <button
              onClick={() => navigate("/seeker/jobs")}
              className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
            >
              Back to Jobs
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-9 mt-10 lg:grid-cols-3">
            {applications.length > 0 ? (
              applications.map((app) => (
                <ApplicationCard
                  key={app._id || app.helperDetails?.email || Math.random()}
                  app={app}
                  onClick={fetchReviewsForApplication}
                />
              ))
            ) : (
              <p className="text-gray-700 col-span-3">No applications found for your posted jobs.</p>
            )}
          </div>
        )}

        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
              <div className="mt-4 border-b pb-4 flex justify-between items-start">
                <div>
                  <p className="text-gray-700"><span className="font-semibold">Helper:</span> {selectedApp.helperDetails?.fullName || "Unknown Helper"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Email:</span> {selectedApp.helperDetails?.email || "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Contact:</span> {selectedApp.helperDetails?.contactNo || "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Skills:</span> {selectedApp.helperDetails?.skills?.join(", ") || "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Experience:</span> {selectedApp.helperDetails?.experience || "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Applied At:</span> {new Date(selectedApp.appliedAt).toLocaleDateString()}</p>
                  <p className="text-gray-700"><span className="font-semibold">Job Title:</span> {selectedApp.jobId?.jobTitle || "Unknown Job Title"}</p>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp._id, selectedApp.jobId._id, e.target.value)}
                    className="mt-2 p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="ml-4 w-1/2">
                  <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
                  {helperReviews[selectedApp.helperDetails?.email]?.length > 0 ? (
                    helperReviews[selectedApp.helperDetails.email].map((review) => (
                      <div key={review._id} className="mt-2 p-2 bg-gray-100 rounded-lg">
                        <p>Rating: {renderStars(review.rating)}</p>
                        <p className="text-gray-700">"{review.comments}"</p>
                        <p className="text-gray-600 text-sm">— Seeker ID: {review.seekerId}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700 mt-2">No reviews yet.</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="mt-6 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SeekerApplications;