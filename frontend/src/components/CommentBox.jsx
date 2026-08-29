import React, { useEffect, useState } from "react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./ui/avatar";

import { Textarea } from "./ui/textarea";

import {
    FaHeart,
    FaRegHeart,
} from "react-icons/fa6";

import { LuSend } from "react-icons/lu";

import { Button } from "./ui/button";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { toast } from "sonner";

import { setBlog } from "@/redux/blogSlice";
import { setComment } from "@/redux/commentSlice";

import {
    Edit,
    Trash2,
} from "lucide-react";

import { BsThreeDots } from "react-icons/bs";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import api from "@/api/axios";


const CommentBox = ({ selectedBlog }) => {

    const { user } = useSelector(
        (store) => store.auth
    );

    const { comment } = useSelector(
        (store) => store.comment
    );

    const { blog } = useSelector(
        (store) => store.blog
    );

    const dispatch = useDispatch();


    // ==============================
    // State
    // ==============================

    const [content, setContent] = useState("");

    const [activeReplyId, setActiveReplyId] =
        useState(null);

    const [replyText, setReplyText] =
        useState("");

    const [editingCommentId, setEditingCommentId] =
        useState(null);

    const [editedContent, setEditedContent] =
        useState("");


    // ==============================
    // Reply button
    // ==============================

    const handleReplyClick = (commentId) => {

        setActiveReplyId(
            activeReplyId === commentId
                ? null
                : commentId
        );

        setReplyText("");
    };


    // ==============================
    // Comment input
    // ==============================

    const changeEventHandler = (e) => {

        setContent(e.target.value);
    };


    // ==============================
    // Get all comments
    // ==============================

    useEffect(() => {

        const getAllCommentsOfBlog = async () => {

            if (!selectedBlog?._id) {
                return;
            }

            try {

                const res = await api.get(
                    `/comment/${selectedBlog._id}/comment/all`
                );

                const data =
                    res.data.comments || [];

                dispatch(setComment(data));

            } catch (error) {

                console.error(
                    "Get comments error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load comments"
                );
            }
        };

        getAllCommentsOfBlog();

    }, [
        selectedBlog?._id,
        dispatch,
    ]);


    // ==============================
    // Create comment
    // ==============================

    const commentHandler = async () => {

        if (!content.trim()) {

            toast.error(
                "Please write a comment"
            );

            return;
        }

        try {

            const res = await api.post(
                `/comment/${selectedBlog._id}/create`,
                {
                    content,
                }
            );


            if (res.data.success) {

                const updatedCommentData = [
                    ...(comment || []),
                    res.data.comment,
                ];


                dispatch(
                    setComment(
                        updatedCommentData
                    )
                );


                // Update blog comments
                if (
                    Array.isArray(blog)
                ) {

                    const updatedBlogData =
                        blog.map((item) =>
                            item._id ===
                            selectedBlog._id
                                ? {
                                    ...item,
                                    comments:
                                        updatedCommentData,
                                }
                                : item
                        );

                    dispatch(
                        setBlog(
                            updatedBlogData
                        )
                    );
                }


                toast.success(
                    res.data.message ||
                    "Comment added successfully"
                );

                setContent("");
            }

        } catch (error) {

            console.error(
                "Comment add error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Comment add nahi hua"
            );
        }
    };


    // ==============================
    // Delete comment
    // ==============================

    const deleteComment = async (
        commentId
    ) => {

        try {

            const res = await api.delete(
                `/comment/${commentId}/delete`
            );


            if (res.data.success) {

                const updatedCommentData =
                    (comment || []).filter(
                        (item) =>
                            item._id !== commentId
                    );


                dispatch(
                    setComment(
                        updatedCommentData
                    )
                );


                toast.success(
                    res.data.message ||
                    "Comment deleted successfully"
                );
            }

        } catch (error) {

            console.error(
                "Delete comment error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Comment delete nahi hua"
            );
        }
    };


    // ==============================
    // Edit comment
    // ==============================

    const editCommentHandler = async (
        commentId
    ) => {

        if (!editedContent.trim()) {

            toast.error(
                "Comment cannot be empty"
            );

            return;
        }

        try {

            const res = await api.put(
                `/comment/${commentId}/edit`,
                {
                    content:
                        editedContent.trim(),
                }
            );


            if (res.data.success) {

                const updatedCommentData =
                    (comment || []).map(
                        (item) =>
                            item._id === commentId
                                ? {
                                    ...item,
                                    content:
                                        editedContent.trim(),
                                }
                                : item
                    );


                dispatch(
                    setComment(
                        updatedCommentData
                    )
                );


                toast.success(
                    res.data.message ||
                    "Comment updated successfully"
                );


                setEditingCommentId(null);

                setEditedContent("");
            }

        } catch (error) {

            console.error(
                "Edit comment error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to edit comment"
            );
        }
    };


    // ==============================
    // Like comment
    // ==============================

    const likeCommentHandler = async (
        commentId
    ) => {

        try {

            const res = await api.get(
                `/comment/${commentId}/like`
            );


            if (res.data.success) {

                const updatedComment =
                    res.data.updatedComment;


                const updatedCommentList =
                    (comment || []).map(
                        (item) =>
                            item._id === commentId
                                ? updatedComment
                                : item
                    );


                dispatch(
                    setComment(
                        updatedCommentList
                    )
                );


                toast.success(
                    res.data.message ||
                    "Comment liked"
                );
            }

        } catch (error) {

            console.error(
                "Like comment error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };


    // ==============================
    // Reply
    // ==============================

    const replyHandler = async (
        commentId
    ) => {

        if (!replyText.trim()) {

            toast.error(
                "Please write a reply"
            );

            return;
        }

        try {

            /*
             * This assumes your backend has:
             *
             * POST /api/v1/comment/:commentId/reply
             *
             * If your backend doesn't have this
             * endpoint, don't use this function yet.
             */

            const res = await api.post(
                `/comment/${commentId}/reply`,
                {
                    content:
                        replyText.trim(),
                }
            );


            if (res.data.success) {

                toast.success(
                    res.data.message ||
                    "Reply added successfully"
                );

                setReplyText("");

                setActiveReplyId(null);


                // Reload comments
                const commentsRes =
                    await api.get(
                        `/comment/${selectedBlog._id}/comment/all`
                    );


                dispatch(
                    setComment(
                        commentsRes.data.comments ||
                        []
                    )
                );
            }

        } catch (error) {

            console.error(
                "Reply error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Reply add nahi hua"
            );
        }
    };


    // ==============================
    // UI
    // ==============================

    return (
        <div>

            {/* Current user */}

            <div className="flex gap-4 mb-4 items-center">

                <Avatar>

                    <AvatarImage
                        src={user?.photoUrl}
                    />

                    <AvatarFallback>
                        CN
                    </AvatarFallback>

                </Avatar>

                <h3 className="font-semibold">

                    {user?.firstName}{" "}
                    {user?.lastName}

                </h3>

            </div>


            {/* Add comment */}

            <div className="flex gap-3">

                <Textarea
                    placeholder="Leave a comment"
                    className="bg-gray-100 dark:bg-gray-800"
                    onChange={
                        changeEventHandler
                    }
                    value={content}
                />

                <Button
                    onClick={commentHandler}
                    disabled={!content.trim()}
                >
                    <LuSend />
                </Button>

            </div>


            {/* Comments */}

            {comment?.length > 0 && (

                <div className="mt-7 bg-gray-100 dark:bg-gray-800 p-5 rounded-md">

                    {comment.map(
                        (item, index) => (

                            <div
                                key={
                                    item?._id ||
                                    index
                                }
                                className="mb-4"
                            >

                                <div className="flex items-center justify-between">

                                    <div className="flex gap-3 items-start">

                                        <Avatar>

                                            <AvatarImage
                                                src={
                                                    item
                                                        ?.userId
                                                        ?.photoUrl
                                                }
                                            />

                                            <AvatarFallback>
                                                CN
                                            </AvatarFallback>

                                        </Avatar>


                                        <div className="mb-2 space-y-1 md:w-[400px]">

                                            <h1 className="font-semibold">

                                                {
                                                    item
                                                        ?.userId
                                                        ?.firstName
                                                }{" "}

                                                {
                                                    item
                                                        ?.userId
                                                        ?.lastName
                                                }

                                                <span className="text-sm ml-2 font-light">
                                                    yesterday
                                                </span>

                                            </h1>


                                            {/* Edit */}

                                            {
                                                editingCommentId ===
                                                item?._id ? (

                                                    <>
                                                        <Textarea
                                                            value={
                                                                editedContent
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setEditedContent(
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="mb-2 bg-gray-200 dark:bg-gray-700"
                                                        />

                                                        <div className="flex py-1 gap-2">

                                                            <Button
                                                                size="sm"
                                                                onClick={() =>
                                                                    editCommentHandler(
                                                                        item._id
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setEditingCommentId(
                                                                        null
                                                                    );

                                                                    setEditedContent(
                                                                        ""
                                                                    );
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>

                                                        </div>
                                                    </>

                                                ) : (

                                                    <p>
                                                        {
                                                            item?.content
                                                        }
                                                    </p>

                                                )
                                            }


                                            {/* Like + Reply */}

                                            <div className="flex gap-5 items-center">

                                                <div
                                                    className="flex gap-1 items-center cursor-pointer"
                                                    onClick={() =>
                                                        likeCommentHandler(
                                                            item._id
                                                        )
                                                    }
                                                >

                                                    {
                                                        item?.likes?.includes(
                                                            user?._id
                                                        ) ? (
                                                            <FaHeart fill="red" />
                                                        ) : (
                                                            <FaRegHeart />
                                                        )
                                                    }

                                                    <span>
                                                        {
                                                            item?.numberOfLikes ||
                                                            0
                                                        }
                                                    </span>

                                                </div>


                                                <p
                                                    onClick={() =>
                                                        handleReplyClick(
                                                            item._id
                                                        )
                                                    }
                                                    className="text-sm cursor-pointer"
                                                >
                                                    Reply
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Edit/Delete */}

                                    {
                                        user?._id ===
                                        item
                                            ?.userId
                                            ?._id && (

                                            <DropdownMenu>

                                                <DropdownMenuTrigger>
                                                    <BsThreeDots />
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent className="w-[180px]">

                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setEditingCommentId(
                                                                item._id
                                                            );

                                                            setEditedContent(
                                                                item.content
                                                            );
                                                        }}
                                                    >

                                                        <Edit />

                                                        Edit

                                                    </DropdownMenuItem>


                                                    <DropdownMenuItem
                                                        className="text-red-500"
                                                        onClick={() =>
                                                            deleteComment(
                                                                item._id
                                                            )
                                                        }
                                                    >

                                                        <Trash2 />

                                                        Delete

                                                    </DropdownMenuItem>

                                                </DropdownMenuContent>

                                            </DropdownMenu>

                                        )
                                    }

                                </div>


                                {/* Reply input */}

                                {
                                    activeReplyId ===
                                    item?._id && (

                                        <div className="flex gap-3 w-full px-10 mt-2">

                                            <Textarea
                                                placeholder="Reply here ..."
                                                className="border-2 dark:border-gray-500 bg-gray-200 dark:bg-gray-700"
                                                onChange={(e) =>
                                                    setReplyText(
                                                        e.target.value
                                                    )
                                                }
                                                value={
                                                    replyText
                                                }
                                            />

                                            <Button
                                                onClick={() =>
                                                    replyHandler(
                                                        item._id
                                                    )
                                                }
                                                disabled={
                                                    !replyText.trim()
                                                }
                                            >
                                                <LuSend />
                                            </Button>

                                        </div>
                                    )
                                }

                            </div>
                        )
                    )}

                </div>

            )}

        </div>
    );
};

export default CommentBox;