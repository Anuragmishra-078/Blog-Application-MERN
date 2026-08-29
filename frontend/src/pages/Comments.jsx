import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Eye } from "lucide-react";

import React, {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import api from "@/api/axios";


const Comments = () => {

    const [allComments, setAllComments] =
        useState([]);

    const navigate = useNavigate();


    // =====================================================
    // GET ALL COMMENTS OF MY BLOGS
    // =====================================================

    const getTotalComments = async () => {

        try {

            const res = await api.get(
                "/comment/my-blogs/comments"
            );

            console.log(
                "Comments response:",
                res.data
            );

            if (res.data.success) {

                setAllComments(
                    res.data.comments || []
                );
            }

        } catch (error) {

            console.error(
                "Get comments error:",
                error
            );

            console.error(
                error.response?.data?.message ||
                "Failed to fetch comments"
            );
        }
    };


    // =====================================================
    // FETCH WHEN COMPONENT LOADS
    // =====================================================

    useEffect(() => {

        getTotalComments();

    }, []);


    return (

        <div className="pb-10 pt-20 md:ml-[320px] min-h-screen">

            <div className="max-w-6xl mx-auto mt-8">

                <Card className="w-full p-5 space-y-2 dark:bg-gray-800">

                    <Table>

                        <TableCaption>
                            A list of your recent comments.
                        </TableCaption>


                        {/* ================================
                            HEADER
                        ================================= */}

                        <TableHeader>

                            <TableRow>

                                <TableHead>
                                    Blog Title
                                </TableHead>

                                <TableHead>
                                    Comment
                                </TableHead>

                                <TableHead>
                                    Author
                                </TableHead>

                                <TableHead className="text-center">
                                    Action
                                </TableHead>

                            </TableRow>

                        </TableHeader>


                        {/* ================================
                            BODY
                        ================================= */}

                        <TableBody>

                            {allComments.length > 0 ? (

                                allComments.map(
                                    (comment, index) => (

                                        <TableRow
                                            key={
                                                comment?._id ||
                                                index
                                            }
                                        >

                                            {/* Blog title */}

                                            <TableCell className="font-medium">

                                                {
                                                    comment
                                                        ?.postId
                                                        ?.title ||
                                                    "No title"
                                                }

                                            </TableCell>


                                            {/* Comment */}

                                            <TableCell>

                                                {
                                                    comment?.content ||
                                                    ""
                                                }

                                            </TableCell>


                                            {/* Author */}

                                            <TableCell>

                                                {
                                                    comment
                                                        ?.userId
                                                        ?.firstName ||
                                                    "Unknown"
                                                }

                                                {" "}

                                                {
                                                    comment
                                                        ?.userId
                                                        ?.lastName ||
                                                    ""
                                                }

                                            </TableCell>


                                            {/* Action */}

                                            <TableCell className="text-center">

                                                <div className="flex justify-center">

                                                    <Eye
                                                        className="cursor-pointer hover:scale-110 transition"
                                                        onClick={() => {

                                                            if (
                                                                comment
                                                                    ?.postId
                                                                    ?._id
                                                            ) {

                                                                navigate(
                                                                    `/blogs/${comment.postId._id}`
                                                                );

                                                            }

                                                        }}
                                                    />

                                                </div>

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
                                        No comments found
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


export default Comments;