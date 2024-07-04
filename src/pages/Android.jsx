import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductsCard from "../components/ProductsCard";
import "../styles/Products.css";
import Navbar from "../components/Navbar";
import { useRecoilState } from "recoil";
import { allPhonesDataState } from "../recoil/atoms/data";
import Loader from "../assets/loader.gif";
import iconClose from "../assets/icon-close.svg";
import { FaFilter } from "react-icons/fa";

const Android = () => {
  const [allPhones, setAllPhones] = useRecoilState(allPhonesDataState);
  const [filterData, setFilterData] = useState([]);
  const [processors, setProcessors] = useState([]);
  const [memory, setMemory] = useState([]);
  const [os, setOs] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    processors: [],
    memory: [],
    os: [],
  });

  const [filtersFlag, setFiltersFlag] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/data/android",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.status === 200) {
        setAllPhones(res.data.phones);
        setFilterData(res.data.phones);
        // console.log(res.data.phones);
        // const uniqueProcessors = [...new Set(res.data.phones.map((item) => item.processor))];
        // const uniqueMemory = [...new Set(res.data.phones.map((item) => item.memory))];
        // const uniqueOs = [...new Set(res.data.phones.map((item) => item.os))];
        setProcessors(uniqueProcessors);
        setMemory(uniqueMemory);
        setOs(uniqueOs);
      } else {
        console.log("Some Erro occ");
      }
    } catch (error) {
      console.log(`Error in component :${error}`);
    }
  };

  const applyFilters = () => {
    const hasActiveFilters =
      selectedFilters.price.length > 0 ||
      selectedFilters.processors.length > 0 ||
      selectedFilters.memory.length > 0 ||
      selectedFilters.os.length > 0 ||
      selectedPriceRange.length > 0; // Include price range filter

    if (hasActiveFilters) {
      const filteredData = allPhones.filter((item) => {
        const processorFilter =
          selectedFilters.processors.length === 0 ||
          selectedFilters.processors.includes(item.processor);
        const memoryFilter =
          selectedFilters.memory.length === 0 ||
          selectedFilters.memory.includes(item.memory);
        const osFilter =
          selectedFilters.os.length === 0 ||
          selectedFilters.os.includes(item.os);

        // Check if the item's price range is included in the selectedPriceRange
        const priceRangeFilter =
          selectedPriceRange.length === 0 ||
          selectedPriceRange.includes(item.priceRange);

        return processorFilter && memoryFilter && osFilter && priceRangeFilter;
      });

      setFilterData(filteredData);
    } else {
      getData();
    }
  };

  const priceRanges = [
    { label: "5000-10000", value: "range1" },
    { label: "10000-20000", value: "range2" },
    { label: "20000-50000", value: "range3" },
    { label: "50000 Above", value: "range4" },
  ];

  const handleCheckboxChange = (category, value) => {
    if (category === "price") {
      setSelectedPriceRange((prevPriceRanges) => {
        const updatedPriceRanges = prevPriceRanges.includes(value)
          ? prevPriceRanges.filter((item) => item !== value)
          : [...prevPriceRanges, value];

        // Update state for price range filter
        setSelectedPriceRange(updatedPriceRanges);

        // Return updated state for further processing
        // console.log(updatedPriceRanges);
        return updatedPriceRanges;
      });
    } else {
      setSelectedFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        if (updatedFilters[category].includes(value)) {
          updatedFilters[category] = updatedFilters[category].filter(
            (item) => item !== value
          );
        } else {
          updatedFilters[category] = [...updatedFilters[category], value];
        }
        return updatedFilters;
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const uniqueProcessors = [
      ...new Set(allPhones.map((item) => item.processor)),
    ];
    const uniqueMemory = [...new Set(allPhones.map((item) => item.memory))];
    const uniqueOs = [...new Set(allPhones.map((item) => item.os))];
    setProcessors(uniqueProcessors);
    setMemory(uniqueMemory);
    setOs(uniqueOs);
  }, [allPhones]);

  return (
    <>
      <div
        style={{
          // position: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "90%",
          zIndex: 999,
          backgroundColor: "white",
        }}
      >
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", padding: "4px 1rem" }}>
          BEST DEALS{" "}
        </h1>
        <FaFilter
          className="products-filter"
          onClick={() => setFiltersFlag((prevFlag) => !prevFlag)}
        />
      </div>
      <div className="container">
        <div
          className="left"
          style={filtersFlag ? { right: "8rem" } : { right: "119rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "2rem", fontWeight: "600" }}>Filters</h2>
            <img
              src={iconClose}
              alt="close"
              onClick={() => setFiltersFlag((prevFlag) => !prevFlag)}
              className="produtcs-close"
              style={{ cursor: "pointer" }}
            />
          </div>

          <br />
          <button
            className="button"
            onClick={() => {
              applyFilters();
              setFiltersFlag(false);
            }}
          >
            Apply Filters
          </button>
          <br />
          <br />
          <h2>Price</h2>
          <ul>
            {/* <li>
              <input
                type="checkbox"
                id={`price-1000-5000`}
                checked={selectedFilters.price.includes("1000-5000")}
                onChange={() => handleCheckboxChange("price", "1000-5000")}
              />{" "}
              1000 - 5000
            </li> */}
            <li>
              {priceRanges.map((range) => (
                <li key={range.label}>
                  <input
                    type="checkbox"
                    id={`price-${range.label}`}
                    checked={selectedPriceRange.includes(range.label)}
                    onChange={() => handleCheckboxChange("price", range.label)}
                  />{" "}
                  {range.label}
                </li>
              ))}
            </li>
            {/* <li>
              <input type="checkbox" name="" id="" /> 10000-20000
            </li>
            <li>
              <input type="checkbox" name="" id="" /> 20000 Above.
            </li> */}
          </ul>

          <br />
          <h2>Processor</h2>
          <ul>
            {processors &&
              processors.map((elem) => {
                return (
                  <li>
                    <input
                      type="checkbox"
                      id={`processor-${elem}`}
                      checked={selectedFilters.processors.includes(elem)}
                      onChange={() => handleCheckboxChange("processors", elem)}
                    />{" "}
                    {elem}
                  </li>
                );
              })}
          </ul>

          <br />
          <h2>Memory</h2>
          <ul>
            {memory &&
              memory.map((elem) => {
                return (
                  <li>
                    <input
                      type="checkbox"
                      id={`memory-${elem}`}
                      checked={selectedFilters.memory.includes(elem)}
                      onChange={() => handleCheckboxChange("memory", elem)}
                    />{" "}
                    {elem}
                  </li>
                );
              })}
          </ul>

          <br />

          <h2>Operating System</h2>
          <ul>
            {os &&
              os.map((elem) => {
                return (
                  <li>
                    <input
                      type="checkbox"
                      id={`os-${elem}`}
                      checked={selectedFilters.os.includes(elem)}
                      onChange={() => handleCheckboxChange("os", elem)}
                    />{" "}
                    {elem}
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="right">
          {allPhones && allPhones.length > 0 ? (
            filterData.length > 0 ? (
              filterData.map((elem) => (
                <ProductsCard key={elem._id} data={elem} />
              ))
            ) : (
              <h1>No data Found</h1>
            )
          ) : (
            <img
              style={{
                width: "4rem",
                aspectRatio: "1/1",
                display: "block",
                margin: "auto",
                objectFit: "cover",
              }}
              src={Loader}
              alt="Loading..."
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Android;
