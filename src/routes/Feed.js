import React, { useState, useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import { createClient } from "../actions";
import Product from "../components/routes/Feed/Product";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useInfiniteQuery } from "react-query";
import ChannelDetails from "../components/routes/Feed/ChannelDetails";
import NewHeader from "../components/NewHeader";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Check from "@mui/icons-material/Check";
//helper
import { getGroups, validMessages } from "../helpers";
import { Api } from "telegram";
import { useTranslation } from "react-i18next";
function Feed(props) {
  const params = useParams();
  const { t } = useTranslation();
  async function fetchProducts({ pageParam = 0 }) {
    const algorithmResult = await getGroups(params, props, pageParam);
    const { productsList, nextBatch } = await validMessages(
      algorithmResult,
      props,
      params.channel ? params.channel : "sellaprod"
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
    `${params.channel ? params.channel : "sellaprod"}`,
    fetchProducts,
    {
      enabled: false,
      cacheTime: 30000,
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
    [isFetching, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage]
  );

  const [categoryAnchor, setCategoryAnchor] = useState(null);

  const openCategory = Boolean(categoryAnchor);
  const handleClick = (event) => {
    setCategoryAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setCategoryAnchor(null);
  };
  const [filterAnchor, setFilterAnchor] = useState(null);

  const openFilter = Boolean(filterAnchor);
  const handleClickFilter = (event) => {
    setFilterAnchor(event.currentTarget);
  };
  const handleCloseFilter = () => {
    setFilterAnchor(null);
  };
  const [channelData, setChannelData] = useState();
  useEffect(() => {
    if (props.isClientLoaded) {
      if (props.client) {
        async function getChannelData() {
          const result = await props.client.invoke(
            new Api.channels.GetFullChannel({
              channel: params.channel,
            })
          );
          const data = {
            about: result.fullChat.about,
            title: result.chats[0].title,
            channelPhoto: result.fullChat.chatPhoto,
          };
          try {
            const picture = await props.client.invoke(
              new Api.upload.GetFile({
                precise: true,
                cdnSupported: true,
                location: new Api.InputPhotoFileLocation({
                  id: data.channelPhoto.id.value,
                  accessHash: data.channelPhoto.accessHash.value,
                  fileReference: data.channelPhoto.fileReference,
                  thumbSize:
                    data.channelPhoto.sizes[data.channelPhoto.sizes.length - 2]
                      .type,
                }),
                offset: 0,
                limit: 1048576,
              })
            );
            data.channelPhoto = picture;
          } catch (err) {
            //TODO:Throw Error
          }

          setChannelData({ ...data });
        }
        if (params.channel !== "sellaprod") {
          getChannelData();
        }

        refetch();
      }
    }
  }, [props.isClientLoaded]);

  const [DateFilter, setDate] = useState(0);

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
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
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
          if (category === productItem.Category) {
            return true;
          } else {
            return false;
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
          newData = filterDataByCategory();
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
  }, [
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    filteredData?.length,
    hasNextPage,
  ]);

  function render() {
    if (props.isClientLoaded) {
      if (isLoading) {
        return (
          <div className="flex justify-center items-center h-[50vh] w-full text-main">
            <CircularProgress color="inherit" />
          </div>
        );
      } else {
        return (
          <div className="my-2">
            {/* ==============Products section ============ */}
            <div className="grid lg:grid-cols-5 gap-2 sm:grid-cols-3 grid-cols-1 sm:m-0 my-6">
              {filteredData?.map((productItem, index) => {
                if (index + 1 === filteredData.length) {
                  return (
                    //FIXME: Change key from math rand to uuid
                    <div
                      key={productItem.date.getTime()}
                      ref={lastElementOfProductsRef}
                    >
                      <Product product={productItem} />
                    </div>
                  );
                } else {
                  return (
                    <div key={productItem.date.getTime()}>
                      <Product product={productItem} />
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
    } else {
      return (
        <div className="flex justify-center items-center h-[50vh] w-full text-main">
          <h4>{t("connecting_to_telegram_servers")}</h4>
          <CircularProgress color="inherit" />
        </div>
      );
    }
  }
  return (
    <div className="px-2 sm:px-4 lg:px-8">
      <NewHeader />

      <section className="flex items-center  border-[1px] border-[#DFDFDD] p-2">
        <div>
          <p
            id="basic-button"
            className="hover:bg-[#f1f1f1] cursor-pointer px-2 py-3"
            style={{ backgroundColor: openCategory ? "#d8d8d8" : undefined }}
            aria-controls={openCategory ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openCategory ? "true" : undefined}
            onClick={handleClick}
          >
            {t("category")} <KeyboardArrowDownIcon />
          </p>
          <Menu
            dense
            id="basic-menu"
            anchorEl={categoryAnchor}
            open={openCategory}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {[
              { value: "Fashion", name: t("Fashion") },
              { value: "Accessories", name: t("Accessories") },
              {
                value: "Home gadgets and Electronics",
                name: t("Home_gadgets_and_electronics"),
              },
            ].map(({ name, value }) => {
              return (
                <MenuItem
                  key={value}
                  onClick={() => {
                    setCategory(value);
                    handleClose();
                  }}
                >
                  {category === value && (
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                  )}
                  <p>{name} </p>
                </MenuItem>
              );
            })}
          </Menu>
        </div>
        <div>
          <p
            className="hover:bg-[#f1f1f1] cursor-pointer px-2 py-3"
            style={{ backgroundColor: openFilter ? "#d8d8d8" : undefined }}
            id="filterDate"
            aria-controls={openFilter ? "filterDate-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openFilter ? "true" : undefined}
            onClick={handleClickFilter}
          >
            {t("filter_by_date")}
            <KeyboardArrowDownIcon />
          </p>
          <Menu
            dense
            id="filterDate-menu"
            anchorEl={filterAnchor}
            open={openFilter}
            onClose={handleCloseFilter}
            MenuListProps={{
              "aria-labelledby": "filterDate",
            }}
          >
            {[
              { name: t("all"), value: 0 },
              { name: t("last_24_hours"), value: 1 },
              {
                name: t("last_3_days"),
                value: 3,
              },
              {
                name: t("last_7_days"),
                value: 7,
              },
              {
                name: t("last_30_days"),
                value: 30,
              },
            ].map((item) => {
              return (
                <MenuItem
                  key={item.name}
                  onClick={() => {
                    setDate(item.value);
                    handleCloseFilter();
                  }}
                >
                  {DateFilter === item.value && (
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                  )}
                  <p>{item.name} </p>
                </MenuItem>
              );
            })}
          </Menu>
        </div>
      </section>
      {/* <div className="flex justify-center">
        <ReplayIcon fontSize={"large"} />
      </div> */}
      {channelData && filteredData?.length && (
        <ChannelDetails
          title={channelData.title}
          photo={channelData.channelPhoto}
          about={channelData.about}
        />
      )}

      <hr className="border-[#C3C8BF] sm:w-[16%] my-6 hidden" />
      <div className="flex ">{render()}</div>
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
