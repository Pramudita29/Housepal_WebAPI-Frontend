import React, { useEffect, useState } from "react";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";
import api from "../services/api";

const JobCard = ({ job }) => (
  <div className="relative rounded-3xl bg-gray-200 p-6 shadow-lg hover:scale-105 transition-transform">
    <h3 className="text-2xl font-bold text-gray-800">{job.jobTitle}</h3>
    <p className="mt-2 text-gray-700">Category: {job.category}</p>
    <p className="mt-2 text-gray-700">Subcategory: {job.subCategory}</p>
    <p className="mt-2 text-gray-700">Location: {job.location}</p>
    <a
      href={`/helper/job/${job._id}`}
      className="mt-4 inline-block bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
    >
      View Details
    </a>
    <img
      src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/swirl.svg"
      alt="swirl"
      className="absolute bottom-4 right-4 w-20"
    />
  </div>
);

const HelperSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/helper/saved-jobs");
        console.log("Fetched saved jobs:", res.data); // Debug log
        if (!Array.isArray(res.data)) {
          console.error("Expected array but got:", res.data);
          throw new Error("Invalid response format from server");
        }
        setSavedJobs(res.data);
      } catch (err) {
        console.error("Error fetching saved jobs:", err.response?.data || err);
        setError("Failed to load saved jobs: " + (err.response?.data?.message || err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []); // Fetch once on mount

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <div className="relative">
          <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
            Saved Jobs
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
              alt="double-line"
              className="mt-2 w-40 lg:w-64"
            />
          </h1>
        </div>
        {loading && <p className="text-gray-700 mt-4">Loading saved jobs...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {!loading && !error && (
          <div className="grid gap-9 mt-10 lg:grid-cols-3">
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <p className="text-gray-700">No saved jobs yet.</p>
            )}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default HelperSavedJobs;