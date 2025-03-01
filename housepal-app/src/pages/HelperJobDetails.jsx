import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const HelperJobDetails = () => {
  const [job, setJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobAndSavedJobs = async () => {
      try {
        const jobRes = await api.get(`/jobs/${id}`);
        console.log("Fetched job:", jobRes.data);
        setJob(jobRes.data);

        const savedRes = await api.get("/helper/saved-jobs");
        console.log("Fetched saved jobs:", savedRes.data);
        if (!Array.isArray(savedRes.data)) {
          throw new Error("Invalid saved jobs response format");
        }
        setSavedJobs(savedRes.data);
      } catch (err) {
        setError("Failed to load job details or saved jobs: " + (err.response?.data?.message || err.message));
        console.error("Error fetching job or saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndSavedJobs();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert("Please log in to apply for this job.");
      return;
    }

    try {
      const helperDetails = {
        fullName: user.fullName || "Unknown Helper",
        email: user.email,
        contactNo: user.contactNo || "N/A",
        skills: user.skills || ["N/A"],
        experience: user.experience || "N/A",
        image: user.image || "",
      };
      console.log("User object from AuthContext:", JSON.stringify(user, null, 2)); // Debug user
      console.log("Sending helperDetails:", JSON.stringify(helperDetails, null, 2)); // Debug payload
      const response = await api.post(`/job-applications/${id}/apply`, { helperDetails });
      console.log("Application response:", JSON.stringify(response.data, null, 2)); // Debug response
      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Error applying for job:", err.response?.data || err);
      alert("Failed to apply: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleSaveJob = async () => {
    try {
      const isCurrentlySaved = savedJobs.some((savedJob) => savedJob._id === id);
      if (isCurrentlySaved) {
        await api.delete(`/helper/saved-jobs/${id}`);
        setSavedJobs(savedJobs.filter((savedJob) => savedJob._id !== id));
        alert("Job removed from saved jobs!");
      } else {
        await api.post(`/helper/saved-jobs/${id}`);
        setSavedJobs([...savedJobs, { _id: id, ...job }]);
        alert("Job saved successfully!");
      }
    } catch (err) {
      console.error("Error saving/removing job:", err);
      alert("Failed to save/remove job: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const isJobSaved = savedJobs.some((savedJob) => savedJob._id === id);

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        {loading && <p className="text-gray-700">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && job && (
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)]">
                {job.jobTitle}
                <img
                  src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
                  alt="double-line"
                  className="mt-2 w-40"
                />
              </h1>
              <p className="mt-4 text-lg text-gray-700">Description: {job.jobDescription}</p>
              <p className="mt-2 text-gray-700">Category: {job.category}</p>
              <p className="mt-2 text-gray-700">Subcategory: {job.subCategory}</p>
              <p className="mt-2 text-gray-700">Location: {job.location}</p>
              <p className="mt-2 text-gray-700">Salary: {job.salaryRange}</p>
              <p className="mt-2 text-gray-700">Contract Type: {job.contractType}</p>
              <p className="mt-2 text-gray-700">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
              <p className="mt-2 text-gray-700">Posted by: {job.posterEmail}</p>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleApply}
                  className="bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600"
                >
                  Apply Now
                </button>
                <button
                  onClick={handleSaveJob}
                  className={`px-8 py-3 rounded-lg ${isJobSaved ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                >
                  {isJobSaved ? "Unsave Job" : "Save Job"}
                </button>
              </div>
            </div>
            <img
              src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/315443b6-006b-47c3-1ad3-84550de22900/public"
              alt="job"
              className="h-64 rounded-3xl object-cover shadow-lg"
            />
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default HelperJobDetails;