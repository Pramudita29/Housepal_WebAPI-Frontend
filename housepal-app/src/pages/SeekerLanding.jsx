import React from "react";
import NavBarPostLogin from "../components/NavBarPostLogin";
import Footer from "../components/footer";

const SeekerLanding = () => {
  return (
    <div className="bg-[#faf8f4] min-h-screen flex flex-col">
      <NavBarPostLogin />
      <section className="flex-grow max-w-7xl mx-auto px-5 py-10 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 font-[var(--font-family-heading)] lg:text-5xl">
              Welcome, Seeker – Simplify Your Home Management
              <img
                src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
                alt="double-line"
                className="mt-2 w-40 lg:w-60"
              />
            </h1>
            <p className="mt-6 text-lg text-gray-700 font-light">
              Post jobs, find reliable helpers, and manage your household tasks effortlessly with HousePal. Get started today!
            </p>
            <div className="mt-8 flex gap-6">
              <a
                href="/seeker/post-job"
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600"
              >
                Post a Job Now
              </a>
              <a
                href="/seeker/jobs"
                className="flex items-center gap-2 border-b border-emerald-500 text-emerald-500 hover:text-emerald-600"
              >
                Browse Jobs
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/315443b6-006b-47c3-1ad3-84550de22900/public"
              alt="seeker"
              className="h-64 rounded-3xl object-cover shadow-lg"
            />
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/green-curve-shape.svg"
              alt="curve"
              className="absolute right-0 bottom-0 w-20"
            />
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/four-angle-star.svg"
              alt="star"
              className="absolute left-0 top-0 w-16"
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 font-[var(--font-family-heading)]">
            Why Choose HousePal as a Seeker?
            <img
              src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
              alt="double-line"
              className="mt-2 w-40"
            />
          </h2>
          <div className="grid gap-6 mt-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-emerald-100 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800">Trusted Helpers</h3>
              <p className="mt-2 text-gray-700">Connect with verified and reliable helpers for your home needs.</p>
            </div>
            <div className="rounded-3xl bg-emerald-100 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800">Easy Job Posting</h3>
              <p className="mt-2 text-gray-700">Post jobs quickly and manage applications seamlessly.</p>
            </div>
            <div className="rounded-3xl bg-emerald-100 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800">24/7 Support</h3>
              <p className="mt-2 text-gray-700">Get assistance anytime with our dedicated support team.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SeekerLanding;