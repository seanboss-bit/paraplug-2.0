import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />
      <section className="bg-white text-gray-900 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-wide mb-3">
              About Us
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Passion for quality. Commitment to authenticity. Driven by style.
            </p>
          </div>

          {/* Section 1 */}
          <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Who We Are
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to{" "}
                <span className="font-semibold text-gray-900">Paraplug</span>,
                your one-stop shop for the latest and greatest Nike and Jordan
                sneakers. We believe that a great pair of sneakers can take you
                anywhere — from the court to the street — and we’re passionate
                about bringing you the best from these iconic brands.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="https://manofmany.com/wp-content/uploads/2022/03/Air-Jordan-1-OG-High-Chicago-Reimagined-feature-1200x900.jpg"
                alt="Jordan sneakers"
                className="w-full rounded-2xl shadow-xl object-cover"
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-20">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to provide you with a seamless shopping
                experience and top-tier customer service. We offer sneakers for
                men, women, and kids — from the latest releases to timeless
                classics. At{" "}
                <span className="font-semibold text-gray-900">Paraplug</span>,
                style meets comfort in every pair.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="https://www.highsnobiety.com/static-assets/thumbor/24t3i4G37yNhlUSVkx0DUWRPYmA=/1200x720/www.highsnobiety.com/static-assets/wp-content/uploads/2021/01/15142643/valuable-jordan-sneakers-ebay-feat1.jpg"
                alt="Our mission"
                className="w-full rounded-2xl shadow-xl object-cover"
              />
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col md:flex-row items-center gap-10 mb-20">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                High-Quality Sneakers
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We take pride in offering only authentic products sourced
                directly from Nike and Jordan. With our commitment to quality,
                you’ll get the real deal — along with competitive prices,
                discounts, and exclusive drops.
              </p>
            </div>
            <div className="flex-1">
              <img
                src="https://robbreport.com/wp-content/uploads/2022/10/RR_Best_Jordan_Sneakers_Lead.jpg?w=1000"
                alt="High quality sneakers"
                className="w-full rounded-2xl shadow-xl object-cover"
              />
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Why Shop With Us?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We understand that online sneaker shopping can be overwhelming,
                which is why we’ve made our process simple, transparent, and
                enjoyable. With detailed product descriptions, sharp visuals,
                and smooth navigation, you can shop with confidence.
              </p>
              <p className="text-gray-600 leading-relaxed">
                So what are you waiting for? Explore our Nike and Jordan
                collection and find your next favorite pair today. Have
                questions? We’re always here to help you step up your sneaker
                game!
              </p>
            </div>
            <div className="flex-1">
              <img
                src="https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i4jPhKEFw1NE/v0/1200x-1.jpg"
                alt="Why shop with us"
                className="w-full rounded-2xl shadow-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default page;
