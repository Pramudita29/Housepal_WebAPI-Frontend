import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const JobCardSkeleton = () => (
  <div className="rounded-3xl bg-gray-200 p-6 shadow-lg animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
  </div>
);

const JobCard = ({ job, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    setIsDeleting(true);
    try {
      await api.delete(`/jobs/${job._id}`);
      onDelete(job._id);
      alert("Job deleted successfully!");
    } catch (err) {
      alert(`Failed to delete job: ${err.response?.data?.message || "Unknown error"}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-2xl font-bold text-gray-800">{job.jobTitle}</h3>
      <p className="mt-2 text-gray-700">Category: {job.category}</p>
      <p className="text-gray-700">Subcategory: {job.subCategory}</p>
      <p className="text-gray-700">Location: {job.location}</p>
      <p className="text-gray-700 mt-2">Salary: {job.salaryRange || "Not specified"}</p>
      <p className="text-gray-700">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
      <p className="text-gray-700">Status: {job.status || "Open"}</p>

      <div className="mt-4 flex gap-4 flex-wrap">
        <button
          onClick={() => navigate(`/seeker/job/${job._id}`)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => navigate(`/seeker/job/${job._id}/edit`)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Edit Job
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`px-4 py-2 rounded-lg text-white ${isDeleting ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"} transition-colors`}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

const SeekerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        console.log("Fetched jobs:", res.data);
        const userJobs = res.data.filter(job => job.posterEmail === user?.email);
        setJobs(userJobs);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchJobs();
  }, [user]);

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter(job => job._id !== jobId));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePostNewJob = () => {
    navigate("/seeker/post-job");
  };

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <div className="relative flex flex-col gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
            Your Posted Jobs
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
              alt="underline"
              className="mt-2 w-40 lg:w-64"
            />
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search jobs by title, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full sm:max-w-md"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <button
              onClick={handlePostNewJob}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Post New Job
            </button>

          </div>
        </div>

        <div className="grid gap-9 mt-6 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => <JobCardSkeleton key={index} />)
          ) : error ? (
            <p className="text-red-500 col-span-3">{error}</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onDelete={handleDeleteJob}
              />
            ))
          ) : (
            <p className="text-gray-700 col-span-3">No jobs posted yet.</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SeekerJobs;