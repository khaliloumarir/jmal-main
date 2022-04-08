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
  const params = useParams();
  async function fetchProducts({ pageParam = 0 }) {
    const algorithmResult = await getGroups(params, props, pageParam);
    const { productsList, nextBatch } = await validMessages(
      algorithmResult,
      props,
      params.channel ? params.channel : "santochi1337"
    );

    return { productsList, nextBatch };
  }
  const {
    isLoading,
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    `${params.channel ? params.channel : "santochi1337"}`,
    fetchProducts,
    {
      enabled: false,
      cacheTime: 0,
      getNextPageParam: (lastPage, pages) => {
        const lastElement = pages[pages.length - 1];
        let productsListEmptyNumber = 0;
        pages.forEach((page) => {
          if (!page.productsList.length) {
            productsListEmptyNumber++;
          }
        });

        //if 10 productsList has returned empty, then there is no more products to fetch from the channel
        if (productsListEmptyNumber >= 10) {
          return undefined;
        } else {
          return lastElement.nextBatch;
        }
      },
    }
  );

  const observer = useRef();
  const [filteredData, setFilteredData] = useState();
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
    [isFetching, isFetchingNextPage, isLoading, filteredData]
  );

  const navigate = useNavigate();
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
  const [category, setCategory] = useState("");
  function filterDataByDate(useCategoryData) {
    const now = Math.floor(Date.now() / 1000);
    let dateFilter = DateFilter * 86400;
    function checkDate(productItem) {
      const date = Math.floor(new Date(productItem.date) / 1000);
      if (dateFilter >= 86400) {
        if (Math.abs(now - date) <= dateFilter) {
          return true;
        }
      } else {
        return true;
      }
    }
    const finalProductsList = [];
    if (useCategoryData) {
      //use category data
      const categoriedData = filterDataByCategory();
      const returned = categoriedData.filter((productItem) => {
        const date = Math.floor(new Date(productItem.date) / 1000);
        if (dateFilter >= 86400) {
          if (Math.abs(now - date) <= dateFilter) {
            return true;
          }
        } else {
          return true;
        }
      });
      console.log("returned data of the filter and category:", returned);
      return returned;
    } else {
      //use data
      data.pages.forEach(({ productsList, nextBatch }) => {
        if (productsList.length) {
          const newFilter = productsList.filter((productItem) => {
            return checkDate(productItem);
          });

          if (newFilter.length) {
            finalProductsList.push(...newFilter);
          }
        }
      });
      return finalProductsList;
    }
  }
  function filterDataByCategory() {
    const finalProductsList = [];
    data.pages.forEach(({ productsList }) => {
      if (productsList.length) {
        const newCategoryFilter = productsList.filter((productItem) => {
          if (category == productItem.Category) {
            return true;
          }
        });
        if (newCategoryFilter.length) {
          finalProductsList.push(...newCategoryFilter);
        }
      }
    });

    return finalProductsList;
  }
  useEffect(() => {
    let newData;
    if (data?.pages?.length) {
      if (DateFilter > 0) {
        if (category.length) {
          //TODO:should filter the right category from data then filter the date
          newData = filterDataByDate(true);
        } else {
          //TODO:should filter the date right away
          newData = filterDataByDate(false);
        }
      } else {
        if (category.length) {
        } else {
          const cleanedData = [];
          data.pages.forEach(({ productsList }) => {
            cleanedData.push(...productsList);
          });
          if (cleanedData.length) {
            newData = cleanedData;
          }
        }
      }
    }
    if (newData !== undefined) {
      setFilteredData([...newData]);
    }
  }, [data, DateFilter]);
  useEffect(() => {
    //categorized data

    let newData;
    //update the categorized when the fetching is executed
    if (data?.pages?.length) {
      if (category.length) {
        //TODO:Should remove the date and filter category
        newData = filterDataByCategory();
        setDate(0);
      } else {
        //no category is present
      }
      if (newData !== undefined) {
        setFilteredData([...newData]);
      }
    }
  }, [category, data]);
  useEffect(() => {
    console.log("filtered data changed to:", filteredData);
  }, [filteredData]);
  useEffect(() => {
    //this logic handles the fetching in case there is no product in the page,
    //because auto fetching is set when the user reaches the last product
    //but if no product exist then this logic do the refetching
    if (!isFetching && !isFetchingNextPage) {
      //keep fetching until the hasnextPage is false or any productsList.length is true
      if (hasNextPage) {
        //check if any productsList exist
        if (!filteredData?.length) {
          fetchNextPage();
        }
      }
    }
  }, [isFetchingNextPage, isFetching]);

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
                {filteredData?.map((productItem, index) => {
                  if (index + 1 === filteredData.length) {
                    return (
                      //FIXME: Change key from math rand to uuid
                      <div
                        key={Math.floor(Math.random() * 9999)}
                        ref={lastElementOfProductsRef}
                      >
                        <Product
                          product={productItem}
                          key={Math.floor(Math.random() * 9999)}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div key={Math.floor(Math.random() * 9999)}>
                        <Product
                          product={productItem}
                          key={Math.floor(Math.random() * 9999)}
                        />
                      </div>
                    );
                  }
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
        {/* <i>
          <MenuIcon />
        </i>
        <h6>Categories</h6> */}
        <select
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="shirts">shirts</option>
          <option value="pants">pants</option>
          <option value="afdada">afdada</option>
        </select>
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
                  htmlFor="All"
                  className="flex items-center my-2 justify-between  w-[70%]"
                >
                  <span className="">All</span>
                  <input
                    onChange={handleFilterByDate}
                    className=""
                    value={0}
                    id="All"
                    name="filterByDay"
                    type="radio"
                    checked={DateFilter === 0}
                  />
                </label>
              </li>
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
                    checked={DateFilter === 1}
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
                    checked={DateFilter === 3}
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
                    checked={DateFilter === 7}
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
                    checked={DateFilter === 30}
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
