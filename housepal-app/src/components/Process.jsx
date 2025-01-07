import React from 'react';

const Process = () => {
    return (
        <div className="mx-auto max-w-7xl px-5 py-10 lg:py-20 bg-[#faf8f4]">
            <IntroContent />
            <FeaturesGrid />
        </div>
    );
};

const IntroContent = () => {
    return (
        <div className="relative grid items-center gap-y-5 lg:grid-cols-2 xl:gap-10">
            <HeaderWithImage />
            <IntroParagraph />
            <DecorativeStar />
        </div>
    );
};

const HeaderWithImage = () => {
    return (
        <div className="relative">
            <h1 className="text-4xl/normal font-bold [font-family:var(--font-family-heading)] lg:text-5xl/normal xl:text-6xl/normal">
                Tailored Solutions for Your Home Needs
            </h1>
            <img
                className="absolute left-32 top-12 z-10 w-40 lg:top-16 lg:w-64 xl:left-52 xl:top-20"
                src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
                alt=""
            />
        </div>
    );
};

const IntroParagraph = () => {
    return (
        <p className="font-thin lg:pl-20 lg:text-lg">
            HousePal connects households with skilled helpers who can assist with various tasks, from cleaning and cooking to babysitting. Our platform is designed to simplify your search for reliable assistance, ensuring you find the right match for your home.
        </p>
    );
};

const DecorativeStar = () => {
    return (
        <img
            className="absolute left-1/2 top-0 z-10 hidden h-[76px] w-[72px] -translate-x-1/2 lg:block"
            src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/star.svg"
            alt=""
        />
    );
};

const FeaturesGrid = () => {
    return (
        <div className="grid gap-5 pt-10 lg:grid-cols-3 lg:gap-9 lg:pt-28">
            <FeatureCard
                imageSrc="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/ba298908-5808-4c16-90d6-979b7d7c9d00/public"
                title="Find the Perfect Match for Your Household"
                description="Utilize advanced search features to effortlessly connect with househelps who meet your specific requirements, ensuring that you find the right fit for your family's needs."
                icon="user"
            />
            <FeatureCard
                imageSrc="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/9bb76859-b77d-4ae8-b1b4-939acb4c5f00/public"
                title="Reliable and Verified Profiles"
                description="Experience peace of mind by browsing through profiles that have undergone thorough background checks, allowing you to hire with confidence."
                icon="check"
            />
            <FeatureCard
                imageSrc="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/376ad948-285c-40fd-cddb-7668d8204700/public"
                title="Streamlined Communication and Booking"
                description="Engage directly with househelps through in-app chat and manage your bookings effortlessly for a smooth and hassle-free experience."
                icon="chat"
            />
        </div>
    );
};

const FeatureCard = ({ imageSrc, title, description, icon }) => {
    return (
        <div className="relative rounded-3xl bg-gray-200 p-4 md:pb-20 lg:pb-8">
            <img
                className="relative z-40 h-60 w-full rounded-xl object-cover md:h-72 lg:h-56 xl:h-72"
                src={imageSrc}
                alt=""
            />
            <h3 className="pt-8 text-xl font-bold text-black/80">{title}</h3>
            <p className="pr-24 pt-4 text-lg text-gray-800 sm:pt-12 md:pr-32 md:pt-8">{description}</p>
            <IconWithShadows icon={icon} />
        </div>
    );
};

const IconWithShadows = ({ icon }) => {
    return (
        <div className="absolute bottom-0 right-0 flex h-20 w-20 items-end justify-end rounded-tl-3xl bg-[#faf8f4] md:h-28 md:w-28">
            <div className="group relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200 md:h-24 md:w-24 md:rounded-3xl">
                {icon === "user" && <i className="fa-solid fa-user-plus text-[var(--primary-color)] text-3xl"></i>}
                {icon === "check" && <i className="fa-regular fa-circle-check text-[var(--primary-color)] text-3xl"></i>}
                {icon === "chat" && <i className="fa-regular fa-comments text-[var(--primary-color)] text-3xl"></i>}
            </div>
        </div>
    );
};

export default Process;