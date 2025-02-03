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
    <p className="mt-2 text-gray-700">Salary: {job.salaryRange}</p>
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

const HelperLanding = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    salaryRange: "",
    contractType: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        console.log("Fetched jobs:", res.data);
        setJobs(res.data);
        setFilteredJobs(res.data); // Initially show all jobs
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs: " + (err.response?.data?.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    const applyFilters = () => {
      let results = [...jobs];
      if (filters.category) {
        results = results.filter((job) => job.category.toLowerCase().includes(filters.category.toLowerCase()));
      }
      if (filters.location) {
        results = results.filter((job) => job.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.salaryRange) {
        results = results.filter((job) => job.salaryRange.toLowerCase().includes(filters.salaryRange.toLowerCase()));
      }
      if (filters.contractType) {
        results = results.filter((job) => job.contractType.toLowerCase().includes(filters.contractType.toLowerCase()));
      }
      setFilteredJobs(results);
    };
    applyFilters();
  }, [filters, jobs]);

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-7xl">
              Empower Your Skills with HousePal
              <img
                src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
                alt="double-line"
                className="mt-2 w-60 lg:w-80"
              />
            </h1>
            <p className="mt-6 text-lg text-gray-700 font-light">
              Offer your expertise to households and earn with ease.
            </p>
            <div className="mt-8 flex gap-6">
              <a
                href="/helper/tasks"
                className="bg-emerald-500 text-white px-8 py-4 rounded-lg hover:bg-emerald-600"
              >
                View Tasks
              </a>
              <a
                href="#jobs-section"
                className="flex items-center gap-2 border-b border-emerald-500 text-emerald-500 hover:text-emerald-600"
              >
                Explore Jobs
              </a>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-8">
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/four-angle-star.svg"
              alt="star"
              className="col-span-2"
            />
            <img
              src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/e9ece190-054e-4b46-a1ad-bcde35167c00/public"
              alt="helper"
              className="col-span-3 h-48 rounded-3xl object-cover shadow-lg"
            />
            <img
              src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/315443b6-006b-47c3-1ad3-84550de22900/public"
              alt="helper"
              className="col-span-5 h-64 rounded-3xl object-cover shadow-lg"
            />
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/green-curve-shape.svg"
              alt="curve"
              className="absolute right-0 bottom-0 w-20"
            />
          </div>
        </div>

        {/* Jobs Section with Filters */}
        <div id="jobs-section" className="mt-20">
          <h2 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)]">
            Available Jobs
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
              alt="double-line"
              className="mt-2 w-40 lg:w-64"
            />
          </h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="category"
              placeholder="Filter by Category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="location"
              placeholder="Filter by Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="salaryRange"
              placeholder="Filter by Salary Range"
              value={filters.salaryRange}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-lg"
            />
            <select
              name="contractType"
              value={filters.contractType}
              onChange={handleFilterChange}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Filter by Contract Type</option>
              <option value="Part-time">Part-time</option>
              <option value="Full-time">Full-time</option>
              <option value="Temporary">Temporary</option>
            </select>
          </div>
          {loading && <p className="text-gray-700 mt-4">Loading jobs...</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {!loading && !error && (
            <div className="grid gap-9 mt-10 lg:grid-cols-3">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
              ) : (
                <p className="text-gray-700">No jobs match your filters.</p>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HelperLanding;