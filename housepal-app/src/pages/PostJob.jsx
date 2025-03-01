import React, { useContext, useState } from "react";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const PostJob = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    category: "",
    subCategory: "",
    location: "",
    salaryRange: "",
    contractType: "",
    applicationDeadline: "",
    contactInfo: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, message: "", type: "success" });
  const { user } = useContext(AuthContext);

  const categories = {
    Cleaning: [
      "General Cleaning",
      "Deep Cleaning",
      "Carpet Cleaning",
      "Window Cleaning",
      "Kitchen Cleaning",
    ],
    "Elderly Care": [
      "Daily Assistance",
      "Medical Accompaniment",
      "Meal Preparation",
      "Companionship",
      "Mobility Assistance",
    ],
    Babysitting: [
      "Infant Care",
      "Toddler Care",
      "After-School Care",
      "Overnight Care",
      "Special Needs Care",
    ],
    Cooking: [
      "Meal Prep",
      "Vegetarian Cooking",
      "Gluten-Free Cooking",
      "Party Catering",
      "Dietary Restrictions",
    ],
    "Gardening Services": [
      "Lawn Care",
      "Planting",
      "Pruning",
      "Pest Control",
      "Landscape Design",
    ],
    "Home Maintenance": [
      "Plumbing",
      "Electrical Work",
      "Painting",
      "Carpentry",
      "Appliance Repair",
    ],
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.jobTitle) newErrors.jobTitle = "Job title is required";
    if (!formData.jobDescription) newErrors.jobDescription = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory) newErrors.subCategory = "Subcategory is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.contractType) newErrors.contractType = "Contract type is required";
    if (!formData.applicationDeadline) newErrors.applicationDeadline = "Deadline is required";
    if (!formData.contactInfo) newErrors.contactInfo = "Contact info is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    if (name === "category") setFormData({ ...formData, category: value, subCategory: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post("/jobs", { ...formData, posterEmail: user.email });
      setModal({ open: true, message: "Job posted successfully!", type: "success" });
      setFormData({
        jobTitle: "",
        jobDescription: "",
        category: "",
        subCategory: "",
        location: "",
        salaryRange: "",
        contractType: "",
        applicationDeadline: "",
        contactInfo: "",
      });
    } catch (err) {
      setModal({ open: true, message: `Failed to post job: ${err.response?.data?.message || "Unknown error"}`, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => setModal({ ...modal, open: false });

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-6xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
            Post a New Job
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
              alt="underline"
              className="mt-3 w-40 mx-auto"
            />
          </h1>
          <p className="mt-2 text-gray-600 text-lg">Fill out the details below to hire a helper.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-lg max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              placeholder="e.g., House Cleaner Needed"
              className={`w-full p-4 bg-gray-50 border ${errors.jobTitle ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
              onChange={handleChange}
            />
            {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">Job Description</label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              placeholder="Describe the job requirements..."
              className={`w-full p-4 bg-gray-50 border ${errors.jobDescription ? "border-red-500" : "border-gray-200"} rounded-lg h-36 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
              onChange={handleChange}
            />
            {errors.jobDescription && <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              className={`w-full p-4 bg-gray-50 border ${errors.category ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Subcategory</label>
            <select
              name="subCategory"
              value={formData.subCategory}
              className={`w-full p-4 bg-gray-50 border ${errors.subCategory ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
              onChange={handleChange}
              disabled={!formData.category}
            >
              <option value="">Select Subcategory</option>
              {formData.category && categories[formData.category]?.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              placeholder="e.g., New York, NY"
              className={`w-full p-4 bg-gray-50 border ${errors.location ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
              onChange={handleChange}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Salary Range</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              placeholder="e.g., $15-$20/hr"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Contract Type</label>
            <select
              name="contractType"
              value={formData.contractType}
              className={`w-full p-4 bg-gray-50 border ${errors.contractType ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
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
            <label className="block text-gray-700 font-semibold mb-2">Application Deadline</label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              className={`w-full p-4 bg-gray-50 border ${errors.applicationDeadline ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.applicationDeadline && <p className="text-red-500 text-sm mt-1">{errors.applicationDeadline}</p>}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">Contact Info</label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              placeholder="e.g., email@example.com or (123) 456-7890"
              className={`w-full p-4 bg-gray-50 border ${errors.contactInfo ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
              onChange={handleChange}
            />
            {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>}
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-lg text-white font-semibold ${isSubmitting ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"} transition duration-200`}
            >
              {isSubmitting ? "Submitting..." : "Post Job"}
            </button>
          </div>
        </form>
      </section>

      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg ${modal.type === "success" ? "bg-green-100" : "bg-red-100"} max-w-sm w-full`}>
            <p className={`text-lg font-semibold ${modal.type === "success" ? "text-green-800" : "text-red-800"}`}>{modal.message}</p>
            <button
              onClick={closeModal}
              className={`mt-4 w-full py-2 rounded-lg text-white ${modal.type === "success" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PostJob;