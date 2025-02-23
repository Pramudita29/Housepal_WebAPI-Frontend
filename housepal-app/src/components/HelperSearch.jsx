import React, { useState, useEffect } from "react";
import NavBarPostLogin from "./NavBarPostLogin";
import Footer from "./footer";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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
    </div>
  );
};

const HelperSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ category: "", location: "", salaryMin: "", salaryMax: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs/public", { params: filters });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
          Search Jobs
          <img src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg" alt="double-line" className="mt-2 w-40 lg:w-64" />
        </h1>
        <div className="mt-6 bg-white p-6 rounded-3xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" name="category" placeholder="Category" value={filters.category} onChange={handleFilterChange} className="p-3 border border-gray-300 rounded-lg" />
            <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleFilterChange} className="p-3 border border-gray-300 rounded-lg" />
            <input type="number" name="salaryMin" placeholder="Min Salary" value={filters.salaryMin} onChange={handleFilterChange} className="p-3 border border-gray-300 rounded-lg" />
            <input type="number" name="salaryMax" placeholder="Max Salary" value={filters.salaryMax} onChange={handleFilterChange} className="p-3 border border-gray-300 rounded-lg" />
          </div>
          <button onClick={handleSearch} className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600">Search</button>
        </div>
        <div className="grid gap-9 mt-10 lg:grid-cols-3">
          {loading ? <p>Loading...</p> : jobs.length ? jobs.map(job => <JobCard key={job._id} job={job} />) : <p>No jobs found.</p>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HelperSearch;