import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";
import api from "../services/api";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div className="relative rounded-3xl bg-gray-200 p-6 shadow-lg hover:scale-105 transition-transform">
      <h3 className="text-2xl font-bold text-gray-800">{job.jobTitle}</h3>
      <p className="mt-2 text-gray-700">Category: {job.category}</p>
      <p className="text-gray-700">Subcategory: {job.subCategory}</p>
      <p className="text-gray-700">Location: {job.location}</p>
      <button onClick={() => navigate(`/helper/job/${job._id}`)} className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600">
        Job Details
      </button>
      <img src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/swirl.svg" alt="swirl" className="absolute bottom-4 right-4 w-20" />
    </div>
  );
};

const HelperJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/public");
        setJobs(res.data);
      } catch (err) {
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <div className="relative">
          <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
            All Jobs
            <img src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg" alt="double-line" className="mt-2 w-40 lg:w-64" />
          </h1>
        </div>
        <div className="grid gap-9 mt-10 lg:grid-cols-3">
          {loading ? <p className="text-gray-700">Loading...</p> : error ? <p className="text-red-500">{error}</p> : jobs.length ? jobs.map(job => <JobCard key={job._id} job={job} />) : <p className="text-gray-700">No jobs available.</p>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HelperJobs;