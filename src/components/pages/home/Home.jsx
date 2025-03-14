import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../common/Header";
import heroImg from "../../../assets/hero.png";
import epron1 from "../../../assets/epron_2.JPG";
import epron2 from "../../../assets/epron_3.JPG";
import epron3 from "../../../assets/recycle_img.JPG";
import dropImg from "../../../assets/dropoff.png";
import requestImg from "../../../assets/request.png";
import oemImg from "../../../assets/oem.jpg";
import recyImg from "../../../assets/recycler.png";
import collImg from "../../../assets/collector.jpg";
import Footer from "../../common/Footer";
import GoToTop from "../../common/GoToTop";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <GoToTop />
      <Header />
      <div className="hero hero-bg items-center flex">
        <div className="max-w-5xl">
          <h2 className="text-3xl lg:text-5xl xl:text-6xl hero-header">
            Save The Environment
          </h2>
          <h3 className="text-lg lg:text-2xl mt-2">
            Recycle your electronic wastes
          </h3>
          <p className="my-5">
            This initiative is part of efforts of the National Environmental
            Standards and Regulations Enforcement Agency (NESREA) to ensure that
            we have a cleaner, healthier and safer environment by ensuring that
            all electronic wastes in the country are properly disposed. OEMs,
            Recyclers and e-waste Collection centres have a role to play to
            ensure the success of this programme.
          </p>
          <div className="flex items-center gap-3">
            <button
              className="home-btn green-btn"
              onClick={() => {
                navigate("/user");
              }}
            >
              Sign Up
            </button>
            <button
              className="home-btn green-btn xl:hidden"
              onClick={() => {
                navigate("/signin");
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
      <div className="banner lg:flex justify-between items-center p-side py-5">
        <div className="max-w-2xl xl:max-w-none">
          <h3 className="text-xl font-semibold">
            Recycle, Reuse, Reduce Environmental Pollution!
          </h3>
          <p className="max-w-4xl">
            Ensuring a cleaner and healthier environment is our collective
            responsibility. Together we preserve it for future generations.
          </p>
        </div>
        <Link to="pick-up">
          <button className="home-btn white-btn mt-2 lg:mt-0">
            Recycle E-waste
          </button>
        </Link>
      </div>
      <div className="">
        <div className="p-side bg-gray-50">
          <div className="item-wrap py-14 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
            <div className="h-full">
              <img className="h-full object-cover" src={epron1} alt="" />
              {/* <div className="tag">Request E-waste Pick Up</div> */}
            </div>
            <div>
              <h3 className="text-xl mb-2 font-semibold">Did you know?</h3>
              <p>
                Requesting e-waste pick up is simple. Click on the “Request
                e-waste pick up” button below to access the simple form. You
                will be required to enter your location so that our agent knows
                where to pick up from.
              </p>

              <h3 className="text-xl my-2 font-semibold">
                What kind of electronic items can be recycled?
              </h3>
              <p>
                Any electronic items including the following - Cooling &
                Freezing equipment, Screens & Monitors, Lamps, Large Equipment,
                Small IT & telecommunication equipment amongst others. If you
                have any of these items in your possession which you no longer
                have use for, then contact us today to get it securely disposed!
              </p>
              <Link to="/pick-up">
                <button className="home-btn green-btn mt-5">
                  Request Pick up
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="">
          <div className="item-wrap bg-gray-100 py-14 p-side grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
            <div>
              <h3 className="text-xl mb-2 font-semibold">Did you know?</h3>
              <p>
                Individuals or corporate bodies who have electronic wates can
                drop off at the collection centre closest to them by clicking on
                the Drop off e-waste button below.{" "}
              </p>

              <h3 className="text-xl mb-2 font-semibold">
                How Can I locate a collection centre?{" "}
              </h3>
              <p>
                You can enter your preferred location on the Drop off e-waste
                page and then a list of all the collection centres closest to
                you will be displayed. From this list, you can find the
                addresses and phone numbers of collection centres close to you.
              </p>
              <Link to="/drop-off">
                <button className="home-btn green-btn mt-5">
                  Drop-off E-waste
                </button>
              </Link>
            </div>
            <div className="h-full">
              <img className="h-full object-cover" src={epron2} alt="" />
              {/* <div className="tag">Drop-off E-waste</div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-14">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Who Should Sign Up?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-10 p-side">
          <div>
            <div className="">
              <img src={oemImg} alt="" className="w-full" />
            </div>
            <div className="shadow trans-img p-3 xl:p-5 xl:mx-3">
              <p className="green-text text-lg text-center font-semibold">
                OEMs/Producers/Importers
              </p>
              <p>
                OEM is the entity (which may include, but is not limited to the
                brand owner, manufacturer, franchise, assembler, distributor,
                retailer or first importer of the product) who sells, offers for
                sale, or distributes the product.
              </p>
            </div>
          </div>
          <div>
            <div className="">
              <img src={epron3} alt="" className="w-full" />
            </div>
            <div className="shadow trans-img p-3 xl:p-5 xl:mx-3">
              <p className="green-text text-lg text-center font-semibold">
                Recyclers
              </p>
              <p>
                Recyclers are registered/licensed person or entity who processes
                e-waste to recover useful materials.
              </p>
            </div>
          </div>
          <div>
            <div className="">
              <img src={collImg} alt="" className="w-full block" />
            </div>
            <div className="shadow trans-img p-3 xl:p-5 xl:mx-3">
              <p className="green-text text-lg text-center font-semibold">
                Collection Centres
              </p>
              <p>
                This is a place or point where used EEE and/or e-waste is
                collected and stored temporarily for the purpose of recycling.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
