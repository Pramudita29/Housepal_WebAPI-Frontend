import React, { useState } from "react";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBarPreLogin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            <li><a href="/about" className="block px-4 py-2 lg:px-0 lg:py-0 text-gray-700 hover:text-emerald-500">About Us</a></li>
            <li><a href="/how-it-works" className="block px-4 py-2 lg:px-0 lg:py-0 text-gray-700 hover:text-emerald-500">How It Works</a></li>
            <li className="group relative">
              <button className="flex items-center gap-1 px-4 py-2 lg:px-0 lg:py-0 text-gray-700 hover:text-emerald-500">
                <span>Services</span>
                <FaChevronDown className="ml-1 transition-transform group-hover:rotate-180" />
              </button>
              <div className="hidden group-hover:block absolute left-0 top-full w-full lg:w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                {["Cleaning", "Cooking", "Babysitting", "More"].map((service) => (
                  <a key={service} href={`/${service.toLowerCase()}`} className="block px-4 py-2 text-gray-700 hover:bg-emerald-100 hover:text-emerald-500">
                    {service}
                  </a>
                ))}
              </div>
            </li>
          </ul>
          <div className="mt-4 lg:mt-0 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 lg:space-x-6 lg:pl-12 px-5 md:px-0">
            <a href="/login" className="rounded-lg border border-emerald-500 px-6 py-2 text-lg font-light text-emerald-500 hover:bg-emerald-500 hover:text-white">
              Login
            </a>
            <a href="/register" className="rounded-lg border border-emerald-500 px-6 py-2 text-lg font-light text-emerald-500 hover:bg-emerald-500 hover:text-white">
              Register
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarPreLogin;