import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBarPreLogin from "../components/NavBarPreLogin";
import Footer from "../components/footer";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const AuthPage = () => {
  const [tab, setTab] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
    role: "Seeker",
    skills: "",
    experience: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (tab === "register") {
      if (!formData.fullName) return "Full name is required";
      if (!formData.contactNo) return "Contact number is required";
      if (formData.password !== formData.confirmPassword) return "Passwords don't match";
      if (formData.role === "Helper" && !formData.skills) return "Skills are required for Helpers";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) return "Valid email is required";
    if (!formData.password || formData.password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleLogin = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      const token = res.data.token;
      const role = res.data.role || JSON.parse(atob(token.split('.')[1])).role;
      console.log("Login response:", res.data, "Extracted role:", role);
      if (!role) {
        throw new Error("Role not provided by server");
      }
      login(token, role);
      setError("");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      setTab("login");
      setError("Registration successful! Please log in.");
      setFormData({
        fullName: "",
        email: "",
        contactNo: "",
        password: "",
        confirmPassword: "",
        role: "Seeker",
        skills: "",
        experience: "",
      });
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPreLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
              {tab === "login" ? "Welcome Back!" : "Join HousePal"}
            </h1>
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
              alt="double-line"
              className="absolute left-12 top-12 w-40 lg:w-64"
            />
            <p className="mt-6 text-lg text-gray-700 font-light">
              {tab === "login"
                ? "Log in to manage your household needs."
                : "Sign up to connect with reliable helpers."}
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setTab("login")}
                className={`px-6 py-2 text-lg ${tab === "login" ? "text-emerald-500 border-b-2 border-emerald-500" : "text-gray-700"}`}
                disabled={loading}
              >
                Login
              </button>
              <button
                onClick={() => setTab("register")}
                className={`px-6 py-2 text-lg ${tab === "register" ? "text-emerald-500 border-b-2 border-emerald-500" : "text-gray-700"}`}
                disabled={loading}
              >
                Register
              </button>
            </div>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {tab === "register" && (
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {tab === "register" && (
                <>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <input
                    type="text"
                    name="contactNo"
                    placeholder="Contact Number"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={formData.contactNo}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <select
                    name="role"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="Seeker">Seeker</option>
                    <option value="Helper">Helper</option>
                  </select>
                  {formData.role === "Helper" && (
                    <>
                      <input
                        type="text"
                        name="skills"
                        placeholder="Skills (comma-separated)"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={formData.skills}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <input
                        type="text"
                        name="experience"
                        placeholder="Experience (e.g., 2 years)"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={formData.experience}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={tab === "login" ? handleLogin : handleRegister}
                className={`w-full py-3 rounded-lg text-white ${loading ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"}`}
                disabled={loading}
              >
                {loading ? "Processing..." : tab === "login" ? "Login" : "Register"}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AuthPage;