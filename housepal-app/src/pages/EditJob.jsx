import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    jobTitle: "", jobDescription: "", category: "", subCategory: "",
    location: "", salaryRange: "", contractType: "", applicationDeadline: "",
    contactInfo: "", status: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = {
    Cleaning: ["Deep Cleaning", "Regular Cleaning"],
    Babysitting: ["Infants", "Toddlers", "School Age"]
  };

  const statuses = ["Open", "In Progress", "Closed"];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.posterEmail !== user.email) {
          alert("You are not authorized to edit this job.");
          navigate("/seeker/jobs");
          return;
        }
        setFormData({
          jobTitle: res.data.jobTitle,
          jobDescription: res.data.jobDescription,
          category: res.data.category,
          subCategory: res.data.subCategory,
          location: res.data.location,
          salaryRange: res.data.salaryRange,
          contractType: res.data.contractType,
          applicationDeadline: res.data.applicationDeadline.split("T")[0],
          contactInfo: res.data.contactInfo,
          status: res.data.status || "Open",
        });
      } catch (err) {
        alert(`Failed to load job: ${err.response?.data?.message || "Unknown error"}`);
        navigate("/seeker/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user.email, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jobTitle) newErrors.jobTitle = "Job title is required";
    if (!formData.jobDescription) newErrors.jobDescription = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.contractType) newErrors.contractType = "Contract type is required";
    if (!formData.applicationDeadline) newErrors.applicationDeadline = "Deadline is required";
    if (!formData.contactInfo) newErrors.contactInfo = "Contact info is required";
    if (!formData.status) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.put(`/jobs/${id}`, { ...formData, posterEmail: user.email });
      alert("Job updated successfully!");
      navigate("/seeker/jobs");
    } catch (err) {
      alert(`Failed to update job: ${err.response?.data?.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#faf8f4] min-h-screen flex flex-col">
        <NavBarPostLogin />
        <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
          <p className="text-gray-700 animate-pulse">Loading job details...</p>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <div className="relative mb-10">
          <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
            Edit Job
            <img src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg" alt="underline" className="mt-2 w-40 lg:w-64" />
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg space-y-6 max-w-4xl mx-auto">
          <div>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              placeholder="Job Title"
              className={`w-full p-3 border ${errors.jobTitle ? "border-red-500" : "border-gray-300"} rounded-lg`}
              onChange={handleChange}
            />
            {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
          </div>

          <div>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              placeholder="Job Description"
              className={`w-full p-3 border ${errors.jobDescription ? "border-red-500" : "border-gray-300"} rounded-lg h-32`}
              onChange={handleChange}
            />
            {errors.jobDescription && <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>}
          </div>

          <div>
            <select
              name="category"
              value={formData.category}
              className={`w-full p-3 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded-lg`}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <select
              name="subCategory"
              value={formData.subCategory}
              className="w-full p-3 border border-gray-300 rounded-lg"
              onChange={handleChange}
              disabled={!formData.category}
            >
              <option value="">Select Subcategory</option>
              {formData.category && categories[formData.category]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              name="location"
              value={formData.location}
              placeholder="Location"
              className={`w-full p-3 border ${errors.location ? "border-red-500" : "border-gray-300"} rounded-lg`}
              onChange={handleChange}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <input
            type="text"
            name="salaryRange"
            value={formData.salaryRange}
            placeholder="Salary Range (e.g., $15-$20/hr)"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
          />

          <div>
            <select
              name="contractType"
              value={formData.contractType}
              className={`w-full p-3 border ${errors.contractType ? "border-red-500" : "border-gray-300"} rounded-lg`}
              onChange={handleChange}
            >
              <option value="">Select Contract Type</option>
              <option value="Part-time">Part-time</option>
              <option value="Full-time">Full-time</option>
              <option value="Temporary">Temporary</option>
            </select>
            {errors.contractType && <p className="text-red-500 text-sm mt-1">{errors.contractType}</p>}
          </div>

          <div>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              className={`w-full p-3 border ${errors.applicationDeadline ? "border-red-500" : "border-gray-300"} rounded-lg`}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.applicationDeadline && <p className="text-red-500 text-sm mt-1">{errors.applicationDeadline}</p>}
          </div>

          <div>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              placeholder="Contact Info (e.g., email or phone)"
              className={`w-full p-3 border ${errors.contactInfo ? "border-red-500" : "border-gray-300"} rounded-lg`}
              onChange={handleChange}
            />
            {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>}
          </div>

          <div>
            <select
              name="status"
              value={formData.status}
              className={`w-full p-3 border ${errors.status ? "border-red-500" : "border-gray-300"} rounded-lg`}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-lg text-white ${isSubmitting ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"}`}
            >
              {isSubmitting ? "Updating..." : "Update Job"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/seeker/jobs")}
              className="flex-1 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default EditJob;