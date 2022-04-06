import React, { useState, useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import { createClient } from "../actions";
import MenuIcon from "@mui/icons-material/Menu";
import Product from "../components/routes/Feed/Product";
import "../components/routes/Feed/feed.css";
import { apiId, apiHash } from "../config";
import ConnectedHeader from "../components/routes/ConnectedHeader";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery, useInfiniteQuery } from "react-query";
//helper
import { checkConnection, getGroups, validMessages } from "../helpers";

function Feed(props) {
  async function fetchProducts({ pageParam = 0 }) {
    const algorithmResult = await getGroups(params, props, pageParam);
    const { productsList, nextBatch } = await validMessages(
      algorithmResult,
      props,
      params.channel ? params.channel : "santochi1337"
    );
    if (productsList.length) {
      return { productsList, nextBatch };
    } else {
      return { nextBatch };
    }
  }
  const {
    isLoading,
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery("products", fetchProducts, {
    enabled: false,
    getNextPageParam: (lastPage, pages) => {
      const lastElement = pages[pages.length - 1];
      //if no product has been retrieved, then there is no more products to fetch
      if (lastElement?.productsList?.length) {
        return pages[pages.length - 1].nextBatch;
      } else {
        return undefined;
      }
    },
  });
  const observer = useRef();
  const lastElementOfProductsRef = useCallback(
    (node) => {
      // this function auto refetch next batch of products when the last element is getting viewed
      if (isLoading || isFetching || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (hasNextPage) {
            fetchNextPage();
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, isFetchingNextPage, isLoading]
  );

  const navigate = useNavigate();
  const params = useParams();
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    //if client instance doesn't exist, but session does
    //then connect client
    //and create client state
    //if client instance doesn't exist, nor session, then redirect to telegram

    checkConnection(props, navigate, setIsClientLoaded);
  }, []);
  useEffect(() => {
    if (isClientLoaded) {
      if (props.client) {
        refetch();
      }
    }
  }, [isClientLoaded]);

  const [DateFilter, setDate] = useState(0);
  const handleFilterByDate = (event) => {
    setDate(parseInt(event.target.value));
  };
  const [loadingNewDate, setLoadingNewDate] = useState(false);
  const [filteredData, setFilteredData] = useState();
  useEffect(() => {
    if (data) {
      if (DateFilter > 0) {
        function filterDataByDate() {
          const finalProductsList = [];
          data.pages.forEach(({ productsList, nextBatch }) => {
            const now = Math.floor(Date.now() / 1000);
            let dateFilter = DateFilter * 86400;
            if (productsList) {
              const newData = productsList.filter((productItem) => {
                const date = Math.floor(new Date(productItem.date) / 1000);
                if (dateFilter >= 86400) {
                  if (Math.abs(now - date) <= dateFilter) {
                    return true;
                  }
                } else {
                  return true;
                }
              });
              if (newData.length) {
                finalProductsList.push({
                  productsList: [...newData],
                  nextBatch,
                });
              }
            }
          });
          return finalProductsList;
        }
        setFilteredData(filterDataByDate());
      } else {
        setFilteredData([...data?.pages]);
      }
    }
  }, [data, DateFilter]);

  function render() {
    if (isClientLoaded) {
      if (loadingNewDate) {
        return (
          <div className="flex justify-center items-center h-[50vh] w-full text-main">
            <CircularProgress color="inherit" />
          </div>
        );
      } else {
        if (isLoading) {
          return (
            <div className="flex justify-center items-center h-[50vh] w-full text-main">
              <CircularProgress color="inherit" />
            </div>
          );
        } else {
          return (
            <div>
              {/* ==============Products section ============ */}
              <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 sm:m-0 my-6">
                {filteredData?.map(({ productsList }, index) => {
                  return (
                    <React.Fragment key={index}>
                      {productsList?.map((item, itemIndex) => {
                        if (itemIndex + 1 === productsList.length) {
                          return (
                            <div ref={lastElementOfProductsRef}>
                              <Product
                                product={item}
                                key={Math.floor(Math.random() * 9999)}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div>
                              <Product
                                product={item}
                                key={Math.floor(Math.random() * 9999)}
                              />
                            </div>
                          );
                        }
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="flex justify-center items-center my-16 w-full text-main">
                {isFetchingNextPage && <CircularProgress color="inherit" />}
              </div>
            </div>
          );
        }
      }
    } else {
      return (
        <div className="flex justify-center items-center h-[50vh] w-full text-main">
          <CircularProgress color="inherit" />
        </div>
      );
    }
  }
  return (
    <div>
      <ConnectedHeader />
      <section className="sm:flex items-center my-6 hidden">
        <i>
          <MenuIcon />
        </i>
        <h6>Categories</h6>
      </section>
      <hr className="border-[#C3C8BF] sm:w-[16%] my-6 hidden" />
      <div className="flex ">
        {/* ==============Filtering and categories section ============ */}

        <div className="basis-[20%] sm:block hidden">
          <form className="">
            <p className="filterTitle">Date Listed</p>
            <ul className="daysFilter  ">
              <li>
                <label
                  htmlFor="one"
                  className="flex items-center my-2 justify-between  w-[70%]"
                >
                  <span className="">Last 24 hours</span>
                  <input
                    onChange={handleFilterByDate}
                    className=""
                    value={1}
                    id="one"
                    name="filterByDay"
                    type="radio"
                  />
                </label>
              </li>
              <li>
                <label
                  htmlFor="three"
                  className="flex items-center my-2 justify-between  w-[70%]"
                >
                  <span className="">Last 3 Days</span>
                  <input
                    onChange={handleFilterByDate}
                    className=""
                    value={3}
                    id="three"
                    name="filterByDay"
                    type="radio"
                  />
                </label>
              </li>
              <li>
                <label
                  htmlFor="seven"
                  className="flex items-center my-2 justify-between  w-[70%]"
                >
                  {" "}
                  <span className="">Last 7 Days</span>
                  <input
                    onChange={handleFilterByDate}
                    className=""
                    value={7}
                    id="seven"
                    name="filterByDay"
                    type="radio"
                  />
                </label>
              </li>
              <li>
                <label
                  htmlFor="thirty"
                  className="flex items-center my-2 justify-between  w-[70%]"
                >
                  {" "}
                  <span className="">Last 30 Days</span>
                  <input
                    onChange={handleFilterByDate}
                    className=""
                    value={30}
                    id="thirty"
                    name="filterByDay"
                    type="radio"
                  />
                </label>
              </li>
            </ul>
          </form>
        </div>

        {render()}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    client: state.client,
    firebase: state.firebase,
    session: state.session,
  };
}

export default connect(mapStateToProps, { createClient })(Feed);
