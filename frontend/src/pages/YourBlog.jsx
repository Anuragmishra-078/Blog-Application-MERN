import { Card } from "@/components/ui/card";

import React, { useEffect } from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { setBlog } from "@/redux/blogSlice";

import {
    Edit,
    Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { BsThreeDotsVertical } from "react-icons/bs";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import api from "@/api/axios";


const YourBlog = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { blog } = useSelector(
        (store) => store.blog
    );


    // ==================================================
    // GET OWN BLOGS
    // ==================================================

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

            toast.error(
                error.response?.data?.message ||
                "Failed to load your blogs"
            );
        }
    };


    // ==================================================
    // DELETE BLOG
    // ==================================================

    const deleteBlog = async (id) => {

        try {

            const res = await api.delete(
                `/blog/delete/${id}`
            );

            if (res.data.success) {

                const updatedBlogData =
                    (blog || []).filter(
                        (blogItem) =>
                            blogItem?._id !== id
                    );

                dispatch(
                    setBlog(
                        updatedBlogData
                    )
                );

                toast.success(
                    res.data.message ||
                    "Blog deleted successfully"
                );

            } else {

                toast.error(
                    res.data.message ||
                    "Failed to delete blog"
                );
            }

        } catch (error) {

            console.error(
                "Delete blog error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };


    // ==================================================
    // LOAD BLOGS
    // ==================================================

    useEffect(() => {

        getOwnBlog();

    }, []);


    // ==================================================
    // FORMAT DATE
    // ==================================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "-";
        }

        const date = new Date(
            dateValue
        );

        return date.toLocaleDateString(
            "en-GB"
        );
    };


    return (

        <div className="pb-10 pt-20 md:ml-[320px] min-h-screen">

            <div className="max-w-6xl mx-auto mt-8">

                <Card className="w-full p-5 space-y-2 dark:bg-gray-800">

                    <Table>

                        <TableCaption>
                            A list of your recent blogs.
                        </TableCaption>


                        {/* ==================================
                            HEADER
                        ================================== */}

                        <TableHeader>

                            <TableRow>

                                <TableHead>
                                    Title
                                </TableHead>

                                <TableHead>
                                    Category
                                </TableHead>

                                <TableHead>
                                    Date
                                </TableHead>

                                <TableHead className="text-center">
                                    Action
                                </TableHead>

                            </TableRow>

                        </TableHeader>


                        {/* ==================================
                            BODY
                        ================================== */}

                        <TableBody>

                            {blog?.length > 0 ? (

                                blog.map(
                                    (item, index) => (

                                        <TableRow
                                            key={
                                                item?._id ||
                                                index
                                            }
                                        >

                                            {/* Title */}

                                            <TableCell className="flex gap-4 items-center">

                                                {item?.thumbnail && (

                                                    <img
                                                        src={
                                                            item.thumbnail
                                                        }
                                                        alt={
                                                            item?.title ||
                                                            "Blog thumbnail"
                                                        }
                                                        className="w-20 rounded-md hidden md:block"
                                                    />

                                                )}


                                                <h1
                                                    className="hover:underline cursor-pointer"
                                                    onClick={() =>
                                                        navigate(
                                                            `/blogs/${item._id}`
                                                        )
                                                    }
                                                >
                                                    {item?.title ||
                                                        "Untitled Blog"}
                                                </h1>

                                            </TableCell>


                                            {/* Category */}

                                            <TableCell>

                                                {
                                                    item?.category ||
                                                    "-"
                                                }

                                            </TableCell>


                                            {/* Date */}

                                            <TableCell>

                                                {formatDate(
                                                    item?.createdAt
                                                )}

                                            </TableCell>


                                            {/* Actions */}

                                            <TableCell className="text-center">

                                                <DropdownMenu>

                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >

                                                        <button
                                                            type="button"
                                                            className="p-2"
                                                        >
                                                            <BsThreeDotsVertical />
                                                        </button>

                                                    </DropdownMenuTrigger>


                                                    <DropdownMenuContent className="w-[180px]">

                                                        {/* Edit */}

                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                navigate(
                                                                    `/dashboard/write-blog/${item._id}`
                                                                )
                                                            }
                                                        >

                                                            <Edit />

                                                            Edit

                                                        </DropdownMenuItem>


                                                        {/* Delete */}

                                                        <DropdownMenuItem
                                                            className="text-red-500"
                                                            onClick={() =>
                                                                deleteBlog(
                                                                    item._id
                                                                )
                                                            }
                                                        >

                                                            <Trash2 />

                                                            Delete

                                                        </DropdownMenuItem>

                                                    </DropdownMenuContent>

                                                </DropdownMenu>

                                            </TableCell>

                                        </TableRow>

                                    )
                                )

                            ) : (

                                <TableRow>

                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-10"
                                    >
                                        No blogs found
                                    </TableCell>

                                </TableRow>

                            )}

                        </TableBody>

                    </Table>

                </Card>

            </div>

        </div>
    );
};

export default YourBlog;