import BlogCard from "@/components/BlogCard";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBlog } from "@/redux/blogSlice";
import api from "@/api/axios";

const Blog = () => {
    const dispatch = useDispatch();

    const { blog } = useSelector((store) => store.blog);

    useEffect(() => {
        const getAllPublishedBlogs = async () => {
            try {
                const res = await api.get(
                    "/blog/get-published-blogs"
                );

                console.log(
                    "Published blogs response:",
                    res.data
                );

                if (res.data.success) {
                    dispatch(
                        setBlog(res.data.blogs || [])
                    );
                }

            } catch (error) {
                console.error(
                    "Get published blogs error:",
                    error
                );

                console.error(
                    error.response?.data?.message ||
                    "Failed to load blogs"
                );
            }
        };

        getAllPublishedBlogs();
    }, [dispatch]);

    return (
        <div className="pt-16">

            {/* Page heading */}
            <div className="max-w-6xl mx-auto text-center flex flex-col space-y-4 items-center">

                <h1 className="text-4xl font-bold text-center pt-10">
                    Our Blogs
                </h1>

                <hr className="w-24 text-center border-2 border-red-500 rounded-full" />

            </div>

            {/* Blog list */}
            <div className="max-w-6xl mx-auto grid gap-10 grid-cols-1 md:grid-cols-3 py-10 px-4 md:px-0">

                {blog?.length > 0 ? (

                    blog.map((item, index) => (
                        <BlogCard
                            blog={item}
                            key={item?._id || index}
                        />
                    ))

                ) : (

                    <div className="col-span-full text-center py-10">

                        <p className="text-gray-500 dark:text-gray-400">
                            No blogs available.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Blog;