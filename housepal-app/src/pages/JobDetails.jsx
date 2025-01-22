import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";
import api from "../services/api";

const JobDetails = () => {
  const [job, setJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [helperReviews, setHelperReviews] = useState({}); // Store reviews by helper email
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };
    fetchJob();
  }, [id]);

  const fetchApplicationsAndReviews = async () => {
    try {
      const res = await api.get(`/job-applications/${id}/applications`);
      console.log("Fetched applications:", res.data);
      setApplications(res.data);

      // Fetch reviews for each helper
      const reviewsMap = {};
      for (const app of res.data) {
        const helperEmail = app.helperDetails.email;
        try {
          const reviewsRes = await api.get(`/review/helper/${encodeURIComponent(helperEmail)}`);
          console.log(`Reviews for ${helperEmail}:`, reviewsRes.data);
          reviewsMap[helperEmail] = reviewsRes.data || [];
        } catch (err) {
          console.warn(`No reviews for helper ${helperEmail}:`, err.message);
          reviewsMap[helperEmail] = [];
        }
      }
      setHelperReviews(reviewsMap);
      setOpen(true);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
      setOpen(true); // Still open modal to show "No applications"
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      await api.put(`/job-applications/${id}/applications/${applicationId}/status`, { status });
      setApplications(applications.map((app) =>
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (err) {
      console.error("Error updating status:", err);
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
        {job && (
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)]">
                {job.jobTitle}
                <img src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg" alt="double-line" className="mt-2 w-40" />
              </h1>
              <p className="mt-4 text-lg text-gray-700">Description: {job.jobDescription}</p>
              <p className="mt-2 text-gray-700">Category: {job.category}</p>
              <p className="mt-2 text-gray-700">Subcategory: {job.subCategory}</p>
              <p className="mt-2 text-gray-700">Location: {job.location}</p>
              <p className="mt-2 text-gray-700">Salary: {job.salaryRange}</p>
              <p className="mt-2 text-gray-700">Contract Type: {job.contractType}</p>
              <p className="mt-2 text-gray-700">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
              <p className="mt-2 text-gray-700">Posted by: {job.posterEmail}</p>
              <button
                onClick={fetchApplicationsAndReviews}
                className="mt-6 bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600"
              >
                View Applications
              </button>
            </div>
            <img
              src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/315443b6-006b-47c3-1ad3-84550de22900/public"
              alt="job"
              className="h-64 rounded-3xl object-cover shadow-lg"
            />
          </div>
        )}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800">Applications for {job?.jobTitle}</h2>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app._id} className="mt-4 border-b pb-4 flex justify-between items-start">
                    <div>
                      <p className="text-gray-700"><span className="font-semibold">Helper:</span> {app.helperDetails.fullName}</p>
                      <p className="text-gray-700"><span className="font-semibold">Email:</span> {app.helperDetails.email}</p>
                      <p className="text-gray-700"><span className="font-semibold">Contact:</span> {app.helperDetails.contactNo}</p>
                      <p className="text-gray-700"><span className="font-semibold">Skills:</span> {app.helperDetails.skills?.join(", ") || "N/A"}</p>
                      <p className="text-gray-700"><span className="font-semibold">Experience:</span> {app.helperDetails.experience || "N/A"}</p>
                      <p className="text-gray-700"><span className="font-semibold">Applied At:</span> {new Date(app.appliedAt).toLocaleDateString()}</p>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="ml-4 w-1/2">
                      <h3 className="text-lg font-semibold text-gray-800">Reviews</h3>
                      {helperReviews[app.helperDetails.email]?.length > 0 ? (
                        helperReviews[app.helperDetails.email].map((review) => (
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
                ))
              ) : (
                <p className="text-gray-700 mt-4">No applications found for this job.</p>
              )}
              <button
                onClick={() => setOpen(false)}
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

export default JobDetails;