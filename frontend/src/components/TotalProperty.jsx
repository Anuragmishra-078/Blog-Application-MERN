import {
    BarChart3,
    Eye,
    MessageSquare,
    ThumbsUp
} from "lucide-react";

import React, {
    useEffect,
    useState
} from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "./ui/card";

import {
    useDispatch,
    useSelector
} from "react-redux";

import { setBlog } from "@/redux/blogSlice";

import api from "@/api/axios";


const TotalProperty = () => {

    const { blog } = useSelector(
        (store) => store.blog
    );

    const [totalComments, setTotalComments] =
        useState(0);

    const [totalLikes, setTotalLikes] =
        useState(0);

    const dispatch = useDispatch();


    // ==========================================
    // GET OWN BLOGS
    // ==========================================

    const getOwnBlog = async () => {

        try {

            const res = await api.get(
                "/blog/get-own-blogs"
            );

            console.log(
                "Own blogs response:",
                res.data
            );

            if (res.data.success) {

                dispatch(
                    setBlog(
                        res.data.blogs || []
                    )
                );
            }

        } catch (error) {

            console.error(
                "Get own blogs error:",
                error
            );

            console.error(
                error.response?.data?.message ||
                "Failed to get blogs"
            );
        }
    };


    // ==========================================
    // GET TOTAL COMMENTS
    // ==========================================

    const getTotalComments = async () => {

        try {

            const res = await api.get(
                "/comment/my-blogs/comments"
            );

            console.log(
                "Total comments response:",
                res.data
            );

            if (res.data.success) {

                setTotalComments(
                    res.data.totalComments || 0
                );
            }

        } catch (error) {

            console.error(
                "Get total comments error:",
                error
            );

            console.error(
                error.response?.data?.message ||
                "Failed to get comments"
            );
        }
    };


    // ==========================================
    // GET TOTAL LIKES
    // ==========================================

    const getTotalLikes = async () => {

        try {

            const res = await api.get(
                "/blog/my-blogs/likes"
            );

            console.log(
                "Total likes response:",
                res.data
            );

            if (res.data.success) {

                setTotalLikes(
                    res.data.totalLikes || 0
                );
            }

        } catch (error) {

            console.error(
                "Get total likes error:",
                error
            );

            console.error(
                error.response?.data?.message ||
                "Failed to get likes"
            );
        }
    };


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        getOwnBlog();
        getTotalComments();
        getTotalLikes();

    }, []);


    // ==========================================
    // STATS
    // ==========================================

    const stats = [
        {
            title: "Total Views",
            value: "24.8K",
            icon: Eye,
            change: "+12%",
            trend: "up",
        },

        {
            title: "Total Blogs",
            value: blog?.length || 0,
            icon: BarChart3,
            change: "+4%",
            trend: "up",
        },

        {
            title: "Comments",
            value: totalComments,
            icon: MessageSquare,
            change: "+18%",
            trend: "up",
        },

        {
            title: "Likes",
            value: totalLikes,
            icon: ThumbsUp,
            change: "+7%",
            trend: "up",
        },
    ];


    return (

        <div className="md:p-10 p-4">

            <div className="flex flex-col md:flex-row justify-around gap-3 md:gap-7">

                {stats.map((stat) => {

                    const Icon = stat.icon;

                    return (

                        <Card
                            key={stat.title}
                            className="w-full dark:bg-gray-800"
                        >

                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>

                                <Icon className="h-4 w-4 text-muted-foreground" />

                            </CardHeader>


                            <CardContent>

                                <div className="text-2xl font-bold">
                                    {stat.value}
                                </div>

                                <p
                                    className={`text-xs ${
                                        stat.trend === "up"
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {stat.change} from last month
                                </p>

                            </CardContent>

                        </Card>

                    );
                })}

            </div>

        </div>
    );
};

export default TotalProperty;