import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Services = () => {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:py-20 bg-[#faf8f4]">
      <MainContent />
      <FeatureGrid />
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="relative grid items-center gap-y-5 lg:grid-cols-2 xl:gap-10">
      <HeadingWithImage />
      <IntroParagraph />
      <DecorativeCurve />
    </div>
  );
};

const HeadingWithImage = () => {
  return (
    <div className="relative">
      <h1 className="text-4xl/normal font-bold [font-family:var(--font-family-heading)] lg:text-5xl/normal xl:text-6xl/normal">
        Empower Your Home with HousePal
      </h1>
      <img
        className="absolute left-12 top-12 z-10 w-40 lg:top-16 lg:w-64 xl:top-20"
        src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
        alt=""
      />
    </div>
  );
};

const IntroParagraph = () => {
  return (
    <p className="font-thin text-[var(--gray-text-color)] lg:pl-20 lg:text-lg">
      Discover a seamless way to connect with skilled househelps who can assist with cleaning, cooking, babysitting, and more. Whether you're looking for help or offering your services, HousePal is your trusted partner in home management.
    </p>
  );
};

const DecorativeCurve = () => {
  return (
    <img
      className="absolute left-1/2 top-32 z-10 hidden -translate-x-1/2 lg:block xl:top-40"
      src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/green-curve-shape-easy.svg"
      alt=""
    />
  );
};

const FeatureGrid = () => {
  return (
    <div className="grid gap-9 pt-10 lg:grid-cols-3 lg:pt-28">
      <FeatureCard
        title="Customized Connections for"
        highlight="Households"
        text="Easily find househelps tailored to your needs with advanced search filters. Browse verified profiles and enjoy the convenience of real-time availability for a hassle-free experience."
        imgSrc="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/swirl.svg"
      />
      <FeatureCard
        title="Empower Househelps to"
        highlight="Grow Their Careers"
        text="Helpers can showcase their skills and experience to attract households. With instant job bookings and secure payments, HousePal facilitates a rewarding experience for every helper."
        imgSrc="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/globe.svg"
      />
      <FeatureCard
        title="Build Trust with"
        highlight="Verified Profiles"
        text="Both seekers and helpers can rely on detailed profiles backed by thorough background checks and user ratings, ensuring a trustworthy environment for everyone involved."
        imgSrc="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/arrow.svg"
      />
    </div>
  );
};

const FeatureCard = ({ title, highlight, text, imgSrc }) => {
  return (
    <div className="relative rounded-3xl bg-gray-200 px-6 pb-40 pt-8 xl:px-9 xl:pt-12">
      <h3 className="text-2xl md:text-3xl xl:text-4xl">
        <span>{title}</span>
        <span> </span>
        <span className="text-[var(--primary-color)]">{highlight}</span>
      </h3>
      <p className="pt-4 text-lg font-thin">{text}</p>
      <img className="absolute bottom-4 left-4 h-[100px] w-[105px]" src={imgSrc} alt="" />
      <DecorativeBlob />
    </div>
  );
};

const DecorativeBlob = () => {
  return (
    <div className="absolute bottom-0 right-0 flex h-24 w-24 items-end justify-end rounded-tl-3xl bg-[#faf8f4] md:h-32 md:w-32">
      <div className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 md:h-28 md:w-28">
        <div className="text-[var(--primary-color)] text-3xl">
          <FaSearch />
        </div>
        <BlobShadows />
      </div>
    </div>
  );
};

const BlobShadows = () => {
  return (
    <>
      <div className="absolute -left-10 bottom-0 z-10 h-12 w-6 rounded-br-3xl bg-gray-200 shadow-[0_15px_0_0_#faf8f4] lg:shadow-[0_25px_0_0_#faf8f4]"></div>
      <div className="absolute -top-16 right-0 z-10 h-12 w-6 rounded-br-3xl bg-gray-200 shadow-[0_15px_0_0_#faf8f4] lg:shadow-[0_25px_0_0_#faf8f4]"></div>
    </>
  );
};

export default Services;