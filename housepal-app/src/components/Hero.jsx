import React from 'react';

const Hero = () => (
    <section className="relative overflow-hidden bg-[#faf8f4]" id="su0q4b">
        <div className="mx-auto grid max-w-7xl gap-20 px-5 py-10 lg:grid-cols-2 lg:gap-5 lg:py-20">
            <div>
                <div className="relative text-3xl font-bold leading-tight md:text-5xl xl:text-7xl">
                    <h1 className="min-h-[6rem] pr-24 [font-family:var(--font-family-heading)]">
                        <span className="relative z-20">Elevate Your Home</span>
                        <span> </span>
                        <span className="relative">
                            With HousePal
                            <img
                                className="absolute -bottom-2 left-0 z-10 w-40 md:-bottom-4 md:w-60 xl:-bottom-6 xl:w-auto"
                                src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/double-line.svg"
                                alt=""
                            />
                        </span>
                        <span> </span>
                        <span className="relative z-20">Your Trusted Assistant</span>
                    </h1>
                    <div className="absolute right-0 top-0">
                        <img
                            className="relative z-20 h-24 w-24 rounded-2xl bg-gray-200 object-cover md:h-24 md:w-24 xl:rounded-[30px]"
                            src="https://media.gettyimages.com/id/2156062809/photo/headshot-closeup-portrait-middle-eastern-israel-businesswoman-business-lady-standing-isolated.jpg?b=1&s=612x612&w=0&k=20&c=mPEqaET5s98W_40DmBTRbYY5z0F-_1YkqdC4TCHJeig="
                            alt="girl"
                        />
                        <div className="absolute inset-0 z-0 h-24 w-24 -translate-y-1 translate-x-1 rounded-2xl bg-[var(--primary-color)] md:h-24 md:w-24 xl:rounded-[30px]"></div>
                    </div>
                </div>
                <p className="pb-9 pt-4 text-lg font-light text-[var(--gray-text-color)]">
                    HousePal connects you with reliable househelps for cleaning, cooking, babysitting, and more, making household management effortless and efficient.
                </p>
                <div className="relative flex flex-col items-start gap-4 pb-24 sm:flex-row md:items-center md:gap-10">
                    <a
                        href="/register"
                        className="inline-block rounded-[var(--button-rounded-radius)] rounded-br-none border border-[var(--primary-button-bg-color)] bg-emerald-500 px-8 py-4 text-lg text-[var(--primary-button-text-color)] transition ease-linear hover:bg-emerald-600 hover:text-white"
                    >
                        Get Started Today
                    </a>
                    <a
                        className="group flex items-center gap-2 border-b border-[var(--primary-button-bg-color)] p-2 transition ease-linear md:p-4 lg:hover:border-transparent"
                        href="/find-help"
                    >
                        <span className="text-lg font-thin text-[var(--primary-color)]">
                            Explore Our Services
                        </span>
                        <i className="fa-regular fa-arrow-up-right text-[var(--primary-color)] transform rotate-45" aria-hidden="true" />
                    </a>
                    <img
                        className="absolute right-0 top-10 z-10 w-20 md:w-auto xl:top-0"
                        src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/green-curve-shape.svg"
                        alt="curve shape"
                    />
                </div>
            </div>
            <div className="lg:flex lg:justify-end">
                <div className="relative grid grid-cols-5 gap-x-8 gap-y-4 lg:pl-20">
                    <div className="relative col-span-2">
                        <div>
                            <img
                                className="absolute -right-8 bottom-4 z-10 w-24 sm:right-0 sm:w-auto"
                                src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/orange-bubble.svg"
                                alt=""
                            />
                            <p className="absolute -right-1 bottom-14 z-10 -rotate-[25deg] text-xl font-semibold text-white/80 sm:bottom-20 sm:right-10 sm:text-4xl lg:text-3xl xl:text-4xl">
                                Easy
                            </p>
                        </div>
                        <img
                            src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/four-angle-star.svg"
                            alt=""
                        />
                    </div>
                    <div className="relative col-span-3">
                        <img
                            className="relative z-20 h-40 w-full rounded-[30px] object-cover shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:h-48"
                            src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/e9ece190-054e-4b46-a1ad-bcde35167c00/public"
                            alt="girl"
                        />
                        <div className="absolute inset-0 z-[1] h-40 w-full -translate-y-2 translate-x-2 rounded-[30px] bg-[var(--primary-color)] sm:h-48"></div>
                    </div>
                    <div className="relative col-span-5">
                        <img
                            className="relative z-20 h-64 w-full rounded-[30px] object-cover shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:h-[340px]"
                            src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/315443b6-006b-47c3-1ad3-84550de22900/public"
                            alt="girl"
                        />
                        <div className="absolute inset-0 z-10 h-64 w-full translate-x-2 translate-y-2 rounded-[30px] bg-[var(--primary-color)] sm:h-[340px]"></div>
                        <img
                            className="absolute -left-6 -top-6 z-30 w-16 sm:w-auto"
                            src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/orange-dots.svg"
                            alt=""
                        />
                        <img
                            className="absolute -bottom-10 -right-10 z-30 w-16 sm:w-auto"
                            src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/orange-dots.svg"
                            alt=""
                        />
                    </div>
                    <div className="relative col-span-3 sm:col-span-2">
                        <img
                            className="relative z-20 h-32 w-full rounded-[30px] object-cover shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] xl:h-40"
                            src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/be38f8f7-11f5-4773-1ee2-b8509950d400/publicContain"
                            alt="girl"
                        />
                        <div className="absolute inset-0 z-[1] h-32 w-full -translate-y-1 translate-x-1 rounded-[30px] bg-[var(--primary-color)] xl:h-40"></div>
                    </div>
                    <div className="relative col-span-2 sm:col-span-3">
                        <img
                            className="absolute -left-8 top-4 z-10 w-28 sm:left-0 sm:w-auto"
                            src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/yellow-bubble.svg"
                            alt=""
                        />
                        <p className="absolute left-0 top-12 z-10 rotate-[28deg] text-xl sm:left-8 sm:text-2xl">
                            Fun :)
                        </p>
                        <img
                            className="absolute right-0 top-4 z-10 sm:left-32"
                            src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/four-angle-star.svg"
                            alt=""
                        />
                        <img
                            className="absolute -bottom-10 right-0 z-10 hidden sm:block xl:bottom-0"
                            src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/template10/orange-curve-shape.svg"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default Hero;