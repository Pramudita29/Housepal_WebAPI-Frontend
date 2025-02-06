import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
import NavBarPostLogin from "../components/NavBarPostLogin";
import api from "../services/api";

const ApplicationCard = ({ app, onClick }) => (
  <div
    onClick={() => onClick(app)}
    className="relative rounded-3xl bg-gray-200 p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer min-w-[300px]" // Reverted to bg-gray-200
  >
    <h3 className="text-xl font-semibold text-gray-800 truncate">{app.jobId.jobTitle}</h3>
    <p className="mt-2 text-gray-600 text-sm">Category: {app.jobId.category}</p>
    <p className="mt-1 text-gray-600 text-sm">Salary: {app.jobId.salaryRange}</p>
    <p className="mt-1 text-gray-600 text-sm">
      Status: <span className={`font-medium ${app.status === 'pending' ? 'text-yellow-600' : app.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{app.status}</span>
    </p>
    <img
      src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/globe.svg"
      alt="globe"
      className="absolute bottom-2 right-2 w-16 "
    />
  </div>
);

const HelperApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/job-applications/history");
        console.log("Fetched applications:", res.data);
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err.response?.data || err);
        setError("Failed to load applications: " + (err.response?.data?.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleDelete = async () => {
    try {
      if (!selectedApp || !selectedApp.jobId || !selectedApp._id) {
        console.error("Invalid selectedApp data:", selectedApp);
        alert("Cannot delete application: Missing job or application ID");
        return;
      }

      const jobId = selectedApp.jobId._id || selectedApp.jobId;
      const applicationId = selectedApp._id;

      console.log("Deleting application:", { jobId, applicationId });

      const response = await api.delete(`/job-applications/${jobId}/applications/${applicationId}`);
      console.log("Delete response:", response.data);

      setApplications(applications.filter(app => app._id !== applicationId));
      setSelectedApp(null);
      alert("Application deleted successfully!");
    } catch (err) {
      console.error("Error deleting application:", err.response?.data || err);
      const errorMessage = err.response?.data?.message || "Unknown error occurred";
      alert(`Failed to delete application: ${errorMessage}`);
    }
  };

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <div className="relative">
          <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
            Your Applications
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
              alt="double-line"
              className="mt-2 w-40 lg:w-64"
            />
          </h1>
        </div>
        {loading && <p className="text-gray-700 mt-4 text-center">Loading applications...</p>}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {!loading && !error && (
          <div className="grid gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {applications.length > 0 ? (
              applications.map(app => <ApplicationCard key={app._id} app={app} onClick={setSelectedApp} />)
            ) : (
              <p className="text-gray-700 text-center col-span-full">No applications found.</p>
            )}
          </div>
        )}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedApp.jobId.jobTitle}</h2>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Description:</span> {selectedApp.jobId.jobDescription}</p>
                <p><span className="font-medium">Category:</span> {selectedApp.jobId.category}</p>
                <p><span className="font-medium">Subcategory:</span> {selectedApp.jobId.subCategory}</p>
                <p><span className="font-medium">Location:</span> {selectedApp.jobId.location}</p>
                <p><span className="font-medium">Salary:</span> {selectedApp.jobId.salaryRange}</p>
                <p><span className="font-medium">Contract Type:</span> {selectedApp.jobId.contractType}</p>
                <p><span className="font-medium">Deadline:</span> {new Date(selectedApp.jobId.applicationDeadline).toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> <span className={`${selectedApp.status === 'pending' ? 'text-yellow-600' : selectedApp.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{selectedApp.status}</span></p>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Application
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default HelperApplications;