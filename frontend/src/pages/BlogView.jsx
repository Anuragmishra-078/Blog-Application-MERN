import React, { useEffect, useState } from "react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    Bookmark,
    MessageSquare,
    Share2,
} from "lucide-react";

import CommentBox from "@/components/CommentBox";

import { FaHeart, FaRegHeart } from "react-icons/fa6";

import { setBlog } from "@/redux/blogSlice";

import { toast } from "sonner";

import api from "@/api/axios";


const BlogView = () => {

    const params = useParams();

    const blogId = params.blogId;

    const dispatch = useDispatch();


    // ==========================================
    // Redux
    // ==========================================

    const { blog } = useSelector(
        (store) => store.blog
    );

    const { user } = useSelector(
        (store) => store.auth
    );

    const { comment } = useSelector(
        (store) => store.comment
    );


    // ==========================================
    // Find selected blog
    // ==========================================

    const selectedBlog = blog?.find(
        (item) => item._id === blogId
    );


    // ==========================================
    // Like state
    // ==========================================

    const [blogLike, setBlogLike] = useState(
        selectedBlog?.likes?.length || 0
    );

    const [liked, setLiked] = useState(
        selectedBlog?.likes?.includes(user?._id) ||
        false
    );


    // ==========================================
    // Keep like state updated
    // ==========================================

    useEffect(() => {

        if (!selectedBlog) {
            return;
        }

        setBlogLike(
            selectedBlog.likes?.length || 0
        );

        setLiked(
            selectedBlog.likes?.includes(
                user?._id
            ) || false
        );

    }, [
        selectedBlog,
        user?._id
    ]);


    // ==========================================
    // Like / Dislike
    // ==========================================

    const likeOrDislikeHandler = async () => {

        if (!selectedBlog?._id) {
            return;
        }

        try {

            const action = liked
                ? "dislike"
                : "like";


            const res = await api.get(
                `/blog/${selectedBlog._id}/${action}`
            );


            if (res.data.success) {

                const updatedLikes = liked
                    ? blogLike - 1
                    : blogLike + 1;


                setBlogLike(
                    updatedLikes
                );

                setLiked(
                    !liked
                );


                const updatedBlogData =
                    blog.map((item) => {

                        if (
                            item._id ===
                            selectedBlog._id
                        ) {

                            return {
                                ...item,

                                likes: liked
                                    ? item.likes.filter(
                                        (id) =>
                                            id !==
                                            user?._id
                                    )
                                    : [
                                        ...(item.likes || []),
                                        user?._id
                                    ],
                            };
                        }

                        return item;
                    });


                dispatch(
                    setBlog(
                        updatedBlogData
                    )
                );


                toast.success(
                    res.data.message ||
                    "Action successful"
                );
            }

        } catch (error) {

            console.error(
                "Like/dislike error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to update like"
            );
        }
    };


    // ==========================================
    // Date formatting
    // ==========================================

    const changeTimeFormat = (
        isoDate
    ) => {

        if (!isoDate) {
            return "";
        }

        const date = new Date(
            isoDate
        );

        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };

        return date.toLocaleDateString(
            "en-GB",
            options
        );
    };


    // ==========================================
    // Share
    // ==========================================

    const handleShare = (id) => {

        const blogUrl =
            `${window.location.origin}/blogs/${id}`;


        if (navigator.share) {

            navigator
                .share({
                    title:
                        "Check out this blog!",
                    text:
                        "Read this amazing blog post.",
                    url: blogUrl,
                })
                .then(() => {
                    console.log(
                        "Shared successfully"
                    );
                })
                .catch((error) => {
                    console.error(
                        "Error sharing:",
                        error
                    );
                });

        } else {

            navigator.clipboard
                .writeText(blogUrl)
                .then(() => {

                    toast.success(
                        "Blog link copied to clipboard!"
                    );

                })
                .catch((error) => {

                    console.error(
                        "Failed to copy:",
                        error
                    );

                });
        }
    };


    // ==========================================
    // Scroll to top
    // ==========================================

    useEffect(() => {

        window.scrollTo(
            0,
            0
        );

    }, []);


    // ==========================================
    // Blog not found
    // ==========================================

    if (!selectedBlog) {

        return (
            <div className="pt-20 flex justify-center items-center min-h-screen">

                <div className="text-center">

                    <h1 className="text-2xl font-bold mb-3">
                        Blog not found
                    </h1>

                    <Link to="/blogs">

                        <Button>
                            Back to Blogs
                        </Button>

                    </Link>

                </div>

            </div>
        );
    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="pt-14">

            <div className="max-w-6xl mx-auto p-10">

                {/* ==================================
                    Breadcrumb
                ================================== */}

                <Breadcrumb>

                    <BreadcrumbList>

                        <BreadcrumbItem>

                            <Link to="/">
                                <BreadcrumbLink>
                                    Home
                                </BreadcrumbLink>
                            </Link>

                        </BreadcrumbItem>

                        <BreadcrumbSeparator />


                        <BreadcrumbItem>

                            <Link to="/blogs">
                                <BreadcrumbLink>
                                    Blogs
                                </BreadcrumbLink>
                            </Link>

                        </BreadcrumbItem>

                        <BreadcrumbSeparator />


                        <BreadcrumbItem>

                            <BreadcrumbPage>

                                {selectedBlog.title}

                            </BreadcrumbPage>

                        </BreadcrumbItem>

                    </BreadcrumbList>

                </Breadcrumb>


                {/* ==================================
                    Blog Header
                ================================== */}

                <div className="my-8">

                    <h1 className="text-4xl font-bold tracking-tight mb-4">

                        {selectedBlog.title}

                    </h1>


                    <div className="flex items-center justify-between flex-wrap gap-4">

                        <div className="flex items-center space-x-4">

                            <Avatar>

                                <AvatarImage
                                    src={
                                        selectedBlog
                                            ?.author
                                            ?.photoUrl
                                    }
                                    alt="Author"
                                />

                                <AvatarFallback>
                                    JD
                                </AvatarFallback>

                            </Avatar>


                            <div>

                                <p className="font-medium">

                                    {
                                        selectedBlog
                                            ?.author
                                            ?.firstName
                                    }

                                    {" "}

                                    {
                                        selectedBlog
                                            ?.author
                                            ?.lastName
                                    }

                                </p>


                                <p className="text-sm text-muted-foreground">

                                    {
                                        selectedBlog
                                            ?.author
                                            ?.occupation ||
                                        "Author"
                                    }

                                </p>

                            </div>

                        </div>


                        <div className="text-sm text-muted-foreground">

                            Published on{" "}

                            {changeTimeFormat(
                                selectedBlog.createdAt
                            )}

                            {" "}• 8 min read

                        </div>

                    </div>

                </div>


                {/* ==================================
                    Featured Image
                ================================== */}

                <div className="mb-8 rounded-lg overflow-hidden">

                    <img
                        src={
                            selectedBlog?.thumbnail
                        }
                        alt={
                            selectedBlog?.title ||
                            "Blog"
                        }
                        width={1000}
                        height={500}
                        className="w-full object-cover"
                    />

                    <p className="text-sm text-muted-foreground mt-2 italic">

                        {
                            selectedBlog.subtitle
                        }

                    </p>

                </div>


                {/* ==================================
                    Description
                ================================== */}

                <p
                    dangerouslySetInnerHTML={{
                        __html:
                            selectedBlog.description ||
                            "",
                    }}
                />


                {/* ==================================
                    Tags
                ================================== */}

                <div className="mt-10">

                    <div className="flex flex-wrap gap-2 mb-8">

                        <Badge variant="secondary">
                            Next.js
                        </Badge>

                        <Badge variant="secondary">
                            React
                        </Badge>

                        <Badge variant="secondary">
                            Web Development
                        </Badge>

                        <Badge variant="secondary">
                            JavaScript
                        </Badge>

                    </div>


                    {/* ==================================
                        Engagement
                    ================================== */}

                    <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">

                        <div className="flex items-center space-x-4">

                            {/* Like */}

                            <Button
                                onClick={
                                    likeOrDislikeHandler
                                }
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                            >

                                {
                                    liked

                                        ?

                                        <FaHeart
                                            size={24}
                                            className="cursor-pointer text-red-600"
                                        />

                                        :

                                        <FaRegHeart
                                            size={24}
                                            className="cursor-pointer text-white hover:text-gray-600"
                                        />
                                }


                                <span>
                                    {blogLike}
                                </span>

                            </Button>


                            {/* Comments */}

                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                            >

                                <MessageSquare
                                    className="h-4 w-4"
                                />

                                <span>
                                    {comment?.length || 0}
                                    {" "}
                                    Comments
                                </span>

                            </Button>

                        </div>


                        {/* Share */}

                        <div className="flex items-center space-x-2">

                            <Button
                                variant="ghost"
                                size="sm"
                            >
                                <Bookmark
                                    className="h-4 w-4"
                                />
                            </Button>


                            <Button
                                onClick={() =>
                                    handleShare(
                                        selectedBlog._id
                                    )
                                }
                                variant="ghost"
                                size="sm"
                            >

                                <Share2
                                    className="h-4 w-4"
                                />

                            </Button>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    Comments
                ================================== */}

                <CommentBox
                    selectedBlog={
                        selectedBlog
                    }
                />

            </div>

        </div>
    );
};

export default BlogView;