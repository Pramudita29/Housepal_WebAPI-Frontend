import React from 'react';

const JoinUs = () => {
  return (
    <section className="bg-[#faf8f4]" id="scy54v">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:py-20">
        <IntroSection />
        <StatisticsGrid />
      </div>
    </section>
  );
};

const IntroSection = () => {
  return (
    <div className="relative grid items-center gap-y-5 lg:grid-cols-2 xl:gap-10">
      <IntroHeading />
      <IntroParagraph />
      <DecorativeCurve />
    </div>
  );
};

const IntroHeading = () => {
  return (
    <div className="relative">
      <h1 className="pr-12 text-4xl/normal font-bold [font-family:var(--font-family-heading)] lg:text-5xl/normal xl:text-6xl/normal">
        Why Choose HousePal?
      </h1>
      <img
        className="absolute left-12 top-12 z-10 w-40 lg:top-16 lg:w-64 xl:top-20"
        src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
        alt=""
      />
      <img
        className="absolute right-0 top-0 z-10 block md:top-4 lg:block xl:w-16"
        src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/four-angle-star.svg"
        alt=""
      />
    </div>
  );
};

const IntroParagraph = () => {
  return (
    <p className="font-thin lg:pl-20 lg:text-lg">
      HousePal revolutionizes how households connect with skilled househelps, making everyday tasks more manageable and efficient. Our platform caters to both helpers and seekers, ensuring you find the right assistance or opportunities effortlessly. With a commitment to reliability, transparency, and user satisfaction, HousePal is your go-to solution for all home management needs.
    </p>
  );
};

const DecorativeCurve = () => {
  return (
    <img
      className="absolute right-0 top-40 z-10 hidden lg:block"
      src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/green-curve-shape-choose.svg"
      alt=""
    />
  );
};

const StatisticsGrid = () => {
  return (
    <div className="relative mt-10 grid grid-cols-8 gap-5 lg:mt-28">
      <StatisticCard value="10,000+" description="Households Served" />
      <StatisticCard value="5,000+" description="Trusted Househelps" />
      <StatisticCard value="98%" description="User Satisfaction Rate" />
      <StatisticCard value="100+" description="Available Services" />
    </div>
  );
};

const StatisticCard = ({ value, description }) => {
  return (
    <div className="relative z-10 col-span-4 flex h-28 flex-col items-center justify-center gap-5 rounded-2xl bg-emerald-500 p-6 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl md:col-span-2 md:h-40 md:rounded-[30px] lg:h-52 lg:p-10">
      <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">{value}</h1>
      <p className="text-center text-sm font-medium md:text-base lg:text-lg">{description}</p>
    </div>
  );
};

export default JoinUs;