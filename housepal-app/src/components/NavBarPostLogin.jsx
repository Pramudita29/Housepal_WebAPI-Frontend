import React, { useContext, useEffect, useState } from "react";
import { FaBars, FaBell, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const NavBarPostLogin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [profile, setProfile] = useState(null); // To store fetched profile data

  // Fetch user profile if user exists but lacks fullName or image
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && (!user.fullName || !user.image)) {
        try {
          console.log("Fetching profile from /auth/me for user:", user.email);
          const res = await api.get("/auth/me");
          console.log("Fetched profile data:", res.data);
          setProfile(res.data);
        } catch (err) {
          console.error("Error fetching profile:", err.response?.data || err);
          setImageError(true); // Fallback to initials if fetch fails
        }
      } else if (user) {
        setProfile(user); // Use existing user data if complete
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      api.get("/notifications")
        .then(res => {
          console.log("Fetched notifications:", res.data);
          setNotifications(res.data);
        })
        .catch(err => console.error("Error fetching notifications:", err));
    }
  }, [user]);

  const navItems = user?.role === "Helper" ? [
    { label: "Home", path: "/helper" },
    { label: "All Jobs", path: "/helper/jobs" },
    { label: "Your Applications", path: "/helper/applications" },
    { label: "Saved Jobs", path: "/helper/saved-jobs" },
    { label: "Tasks", path: "/helper/tasks" },
  ] : [
    { label: "Home", path: "/seeker" },
    { label: "All Jobs", path: "/seeker/jobs" },
    { label: "Applications", path: "/seeker/applications" },
    { label: "Post a Job", path: "/seeker/post-job" },
    { label: "Bookings", path: "/seeker/bookings" },
  ];

  const handleNotificationClick = () => {
    setNotificationsOpen(!notificationsOpen);
    setDropdownOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      await api.patch("/notifications/mark-all-as-read");
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      setNotifications(notifications); // Revert on failure
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) {
      console.warn("Full name is missing, defaulting to 'NA'");
      return "NA";
    }
    const names = fullName.trim().split(" ");
    return names.map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleImageError = () => {
    console.log("Image failed to load, switching to initials");
    setImageError(true);
  };

  const displayUser = profile || user; // Use fetched profile if available, else fallback to context user

  return (
    <nav className="bg-[#faf8f4] shadow-md z-50 relative">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
        <a href="/" className="text-3xl font-bold text-emerald-500 font-[var(--font-family-heading)]">
          HousePal
        </a>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl md:hidden">
          <FaBars />
        </button>
        <div className={`absolute left-0 top-full w-full bg-[#faf8f4] pb-4 transition-all lg:static lg:flex lg:w-auto lg:items-center lg:pb-0 ${menuOpen ? "block" : "hidden"}`}>
          <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.path}
                  className="block px-4 py-2 lg:px-0 lg:py-0 text-gray-700 hover:text-emerald-500"
                  onClick={(e) => { e.preventDefault(); navigate(item.path); }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {user && (
            <div className="mt-4 lg:mt-0 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 lg:space-x-6 lg:pl-12 px-5 md:px-0">
              <div className="relative">
                <button onClick={handleNotificationClick} className="relative focus:outline-none">
                  <FaBell className="text-emerald-500 text-xl" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                      {notifications.some(n => !n.isRead) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkAllAsRead(); }}
                          className="text-emerald-500 text-sm hover:text-emerald-700 font-medium"
                        >
                          Mark All as Read
                        </button>
                      )}
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 border-b border-gray-200 ${notification.isRead ? "bg-gray-100" : "bg-white"} hover:bg-gray-50`}
                        >
                          <p className="text-gray-700 text-sm">{notification.message}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-gray-700 text-sm">No notifications yet.</div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative group">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 text-gray-700 hover:text-emerald-500 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-emerald-500 text-white font-semibold">
                    {displayUser?.image && !imageError ? (
                      <img
                        src={`http://localhost:3000/api/images/${displayUser.image.split(/[\/\\]/).pop()}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <span>{getInitials(displayUser?.fullName)}</span>
                    )}
                  </div>
                  <FaChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`hidden group-hover:block absolute right-0 top-full w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50 ${dropdownOpen ? "block" : "hidden"}`}>
                  <a
                    href={user.role === "Helper" ? "/helper/profile" : "/seeker/profile"}
                    className="block px-4 py-2 text-gray-700 hover:bg-emerald-100 hover:text-emerald-500"
                    onClick={(e) => { e.preventDefault(); navigate(user.role === "Helper" ? "/helper/profile" : "/seeker/profile"); }}
                  >
                    Profile
                  </a>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-100 hover:text-emerald-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBarPostLogin;