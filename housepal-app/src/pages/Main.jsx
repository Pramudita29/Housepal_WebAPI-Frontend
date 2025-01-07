import React from "react";
import Footer from "../components/footer";
import Hero from "../components/Hero";
import JoinUs from "../components/JoinUs";
import NavBarPreLogin from "../components/NavBarPreLogin";
import Process from "../components/Process";
import Services from "../components/Services";

const MainPage = () => {
    return (
        <div className="min-h-screen">
            <NavBarPreLogin />
            <Hero />
            <Services />
            <JoinUs />
            <Process />
            <Footer />
        </div>
    );
};

export default MainPage;