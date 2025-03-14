import React, { useState, useEffect } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
// import InputGroup from "../../common/InputGroup";
import SearchSelect from "../../common/SearchSelect";
// import { states, locations } from "../../../data/state";
import { centres } from "../../../data/centres";
import {
  // useFetchCitiesMutation,
  useFetchLgasMutation,
} from "../../../services/location";
import GoToTop from "../../common/GoToTop";
import { showToast } from "../../../reducers/toastSlice";
import { useDispatch } from "react-redux";
import Spinner from "../../common/Spinner";
import { useGetCollectionCentresByLocationMutation } from "../../../services/adminService";

function DropOff() {
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [centreLoading, setCentreLoading] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  // const [showLocation, setShowLocation] = useState(true);
  const [location, setLocation] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  // const [searchValue, setSearchValue] = useState("");
  const [centers, setCenters] = useState(null);
  const [getCentresByLocation] = useGetCollectionCentresByLocationMutation();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [fetchLgas] = useFetchLgasMutation();
  const dispatch = useDispatch();
  const locationData = { country: "NG", state: "Lagos" };

  const onStateChange = (selectedOption) => {
    // setState(selectedOption);
    // setShowLocation(false);
  };
  const onLocationChange = (selectedOption) => {
    setLocation(selectedOption);
  };

  const getLgas = (data) => {
    let cityArr = [];
    data.map((item, key) =>
      cityArr.push({ value: item, label: item, id: key })
    );
    setLocationOptions(cityArr);
  };

  useEffect(() => {
    setLoading(true);
    fetchLgas(locationData)
      .unwrap()
      .then((res) => {
        if (!res.error) {
          setLoading(false);
          getLgas(res.data.lgas);
        } else {
          setLoading(false);
          dispatch(
            showToast({
              status: "error",
              title: "Error",
              message: res.message,
            })
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        let errMsg;
        if (!err.data) {
          errMsg = "Check your network and try again";
        } else errMsg = err.data.message;
        dispatch(
          showToast({
            status: "error",
            title: "Error",
            message: `${errMsg}`,
          })
        );
      });
  }, []);

  const getCollectionCentres = () => {
    if(!location.value) {
      return dispatch(
        showToast({
          status: "error",
          title: "Error",
          message: "Pick a location and try again",
        })
      );
    } 
    // setCentreLoading(true);
    const availableCenters = centres.filter(centre => centre.lga === location.value)
    setCenters(availableCenters)
    // getCentresByLocation(location.value)
    //   .unwrap()
    //   .then((res) => {
    //     setCentreLoading(false);
    //     if (!res.error) {
    //       setCenters(res.user);
    //       setState("");
    //       setLocation("");
    //     } else {
    //       setCentreLoading(false);
    //       setLoading(false);
    //       dispatch(
    //         showToast({
    //           status: "error",
    //           title: "Error",
    //           message: res.message,
    //         })
    //       );
    //     }
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     let errMsg;
    //     if (!err.data) {
    //       errMsg = "Check your network and try again";
    //     } else errMsg = err.data.message;
    //     dispatch(
    //       showToast({
    //         status: "error",
    //         title: "Error",
    //         message: `${errMsg}`,
    //       })
    //     );
    //   });

    // const data = centres[selectedLocation];
    // setCenters(data);
    setSelectedLocation(location.value);
    setState("");
    setLocation("");
  };
  return (
    <div>
      <GoToTop />
      <Header />
      <main className="">
        <div className="min-h-screen">
          <div className="flex flex-col p-side pt-32 pb-20 md:py-20 hero-bg">
            <h1 className="text-xl md:text-3xl lg:text-4xl text-center md:text-left text-white md:mt-24 mb-5 font-semibold">
              Find A Collection Centre Closest To You
            </h1>
            <p className="text-white text-center md:text-left max-w-4xl lg:text-lg mb-10">
              If you prefer to drop off your electronic waste at a collection
              centre yourself, Kindly find the address of the centre closes to
              you from the options below.
            </p>
            <div className="flex flex-col md:flex-row gap-1 relative md:gap-5">
              {/* <label htmlFor="state">Select a state</label> */}
              <div className="select-width relative z-0">
                <SearchSelect
                  value={state}
                  name={"State"}
                  selectData={stateOptions}
                  onChange={onStateChange}
                  isDisabled={true}
                  defaultValue={"Lag"}
                  placeholder={"Lagos"}
                />
              </div>
              <div className="select-width">
                <SearchSelect
                  placeholder={"City"}
                  isHidden={false}
                  value={location}
                  name={"Location"}
                  selectData={locationOptions}
                  onChange={onLocationChange}
                  // isDisabled={showLocation}
                  defaultValue={"Choose one"}
                />
              </div>
              {/* <input
                value={searchValue}
                name="collectionCentre"
                placeholder="Search for a centre"
                className="px-3 h-10 block rounded-md input-width"
              /> */}
              {loading ? (
                <button className="rounded-md w-24 bg-green-600 text-white h-10 select-btn">
                  <Spinner />
                </button>
              ) : (
                <button
                  className="rounded-md w-24 bg-green-600 text-white h-10 select-btn"
                  onClick={() => {
                    getCollectionCentres();
                  }}
                >
                  Search
                </button>
              )}
            </div>
          </div>
          {!centreLoading && centers ? (
            <div className="results text-base mt-5 p-side">
              <div>
                {centers.length > 0 ? (
                  <div>
                    <h1 className="summary text-xl font-semibold mb-5">
                      {centers.length} collection centres found in{" "}
                      {selectedLocation}, Lagos
                    </h1>
                    {centers.map((item, index) => (
                      <div
                        key={index}
                        className="result-wrap border-t border-b"
                      >
                        <div className="result-item py-5">
                          <h1 className="font-semibold text-lg">{item.name}</h1>
                          {/* <p>Lekki, Lagos</p> */}
                          <div className="flex mt-2">
                            <i className="fas fa-map mr-2 mt-2"></i>
                            <p>{item.address || "nil"}</p>
                          </div>
                          <div className="flex items-center mt-2">
                            <i className="fas fa-clock mr-2"></i>
                            <p>Opens - 9:00 am - 4:00 pm daily.</p>
                          </div>
                          {/* <div className="flex items-center mt-2">
                            <i className="fas fa-phone mr-2"></i>
                            <p>{item.phoneNumber}</p>
                          </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-5">
                    <h1 className="summary text-xl font-semibold mb-2">
                      No collection centres found in {selectedLocation}, Lagos
                    </h1>
                    <p>Try another location close to you</p>
                  </div>
                )}
              </div>
            </div>
          ) : centreLoading ? <div className="mt-5"><Spinner /></div> : (
            <p className="results text-base my-5 p-side">
              No Location selected
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DropOff;
