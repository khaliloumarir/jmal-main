import React, { useState, useEffect, useRef, useCallback } from "react"
import { connect } from "react-redux"
import { createClient } from "../actions"
import MenuIcon from '@mui/icons-material/Menu';
import Product from '../components/routes/Feed/Product';
import "../components/routes/Feed/feed.css"
import { apiId, apiHash } from "../config"
import ConnectedHeader from "../components/routes/ConnectedHeader"
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery, useInfiniteQuery } from "react-query"
//helper
import { checkConnection, getGroups, validMessages } from "../helpers"





function Feed(props) {
    async function fetchProducts({ pageParam = 0 }) {
        console.log("next batch, aka pageParam ", pageParam)
        const algorithmResult = await getGroups(params, props, pageParam)
        const { productsList, nextBatch } = await validMessages(algorithmResult, props, params.channel ? params.channel : "santochi1337")
        if (productsList.length) {
            return { productsList, nextBatch }
        } else {
            return { nextBatch }
        }

    }
    const { isLoading, data, refetch, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery("products", fetchProducts, {
        enabled: false,
        getNextPageParam: (lastPage, pages) => {

            const lastElement = pages[pages.length - 1]
            //if no product has been retrieved, then there is no more products to fetch
            if (lastElement?.productsList?.length) {
                return pages[pages.length - 1].nextBatch
            } else {
                return undefined
            }

        }
    })
    const observer = useRef()
    const lastElementOfProductsRef = useCallback((node) => {
        // this function auto refetch next batch of products when the last element is getting viewed
        if (isLoading || isFetching || isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (hasNextPage) {
                    fetchNextPage()
                }
            }
        })
        if (node) observer.current.observe(node)
    }, [isFetching, isFetchingNextPage, isLoading])



    const navigate = useNavigate()
    const params = useParams()
    const [products, setProducts] = useState([])
    const [isClientLoaded, setIsClientLoaded] = useState(false)

    useEffect(() => {
        //if client instance doesn't exist, but session does
        //then connect client
        //and create client state
        //if client instance doesn't exist, nor session, then redirect to telegram

        checkConnection(props, navigate, setIsClientLoaded)
    }, [])
    useEffect(() => {
        if (isClientLoaded) {
            if (props.client) {
                refetch()

            }
        }

    }, [isClientLoaded])

    const [DateFilter, setDate] = useState(0)
    const handleFilterByDate = (event) => {
        setDate(parseInt(event.target.value))
    }
    const [loadingNewDate, setLoadingNewDate] = useState(false)

    useEffect(() => {
        if (DateFilter > 0) {
            setLoadingNewDate(true)
            async function filterByDate(days) {

                const groups = await getGroups()
                const productsList = await validMessages(groups)
                const now = Math.floor(Date.now() / 1000)

                let dateFilter = days * 86400
                const temp = productsList
                console.log("dateFilter", dateFilter)
                const newData = temp.filter((productItem) => {
                    const date = Math.floor(new Date(productItem.date) / 1000)
                    console.log("dateFilter", dateFilter)
                    if (dateFilter >= 86400) {

                        if (Math.abs(now - date) <= dateFilter) {

                            return true;
                        }
                    } else {
                        return true;
                    }
                })

                setProducts([...newData])
            }
            filterByDate(DateFilter)

            setLoadingNewDate(false)
        }

    }, [DateFilter])

    function render() {
        if (isClientLoaded) {
            if (loadingNewDate) {
                return (
                    <div className="flex justify-center items-center h-[50vh] w-full text-main">
                        <CircularProgress color="inherit" />
                    </div>
                )
            } else {
                if (!isLoading) {
                    return (
                        <>
                            {/* ==============Products section ============ */}
                            <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 sm:m-0 my-6">

                                {data?.pages.map((group, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {group.productsList?.map((item, groupIndex) => {
                                                if (groupIndex + 1 == group.productsList.length) {
                                                    return (
                                                        <div ref={lastElementOfProductsRef}>
                                                            <Product product={item} key={Math.floor(Math.random() * 9999)} />
                                                        </div>

                                                    )
                                                } else {
                                                    return (
                                                        <div>
                                                            <Product product={item} key={Math.floor(Math.random() * 9999)} />
                                                        </div>
                                                    )
                                                }

                                            })}

                                        </React.Fragment>
                                    )


                                })}

                            </div>

                        </>
                    )
                } else {
                    if (DateFilter > 0) {
                        return (
                            <>
                                <h1>didn't find any data</h1>
                            </>
                        )
                    } else {
                        return (
                            <div className="flex justify-center items-center h-[50vh] w-full text-main">
                                <CircularProgress color="inherit" />
                            </div>
                        )
                    }
                }
            }


        } else {
            return (
                <div className="flex justify-center items-center h-[50vh] w-full text-main">
                    <CircularProgress color="inherit" />
                </div>
            )
        }
    }
    return (
        <div>
            <ConnectedHeader />
            <section className="sm:flex items-center my-6 hidden">
                <i><MenuIcon /></i>
                <h6>Categories</h6>
            </section>
            <hr className="border-[#C3C8BF] sm:w-[16%] my-6 hidden" />
            <div className="flex ">
                {/* ==============Filtering and categories section ============ */}

                <div className="basis-[20%] sm:block hidden">

                    <form className="">
                        <p className="filterTitle">Date Listed</p>
                        <ul className="daysFilter  ">
                            <li className="flex items-center my-2">
                                <label htmlFor="one" > <span className="">Last 24 hours</span><input onChange={handleFilterByDate} className="" value={1} id="one" name="filterByDay" type="radio" /></label>
                            </li>
                            <li className="flex items-center my-2">
                                <label htmlFor="three" > <span className="">Last 3 Days</span><input onChange={handleFilterByDate} className="" value={3} id="three" name="filterByDay" type="radio" /></label>
                            </li>
                            <li className="flex items-center my-2">
                                <label htmlFor="seven" > <span className="">Last 7 Days</span><input onChange={handleFilterByDate} className="" value={7} id="seven" name="filterByDay" type="radio" /></label>
                            </li>
                            <li className="flex items-center my-2" >
                                <label htmlFor="thirty" > <span className="">Last 30 Days</span><input onChange={handleFilterByDate} className="" value={30} id="thirty" name="filterByDay" type="radio" /></label>
                            </li>
                        </ul>
                    </form>
                </div>

                {
                    render()

                }

            </div>
            <button onClick={() => {
                fetchNextPage()
            }} >Load More</button>
        </div>
    )
}


function mapStateToProps(state) {
    return ({
        client: state.client, firebase: state.firebase, session: state.session
    })
}

export default connect(mapStateToProps, { createClient })(Feed)