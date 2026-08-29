import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import JoditEditor from "jodit-react";

import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import api from "@/api/axios";

import { toast } from "sonner";

import { setBlog } from "@/redux/blogSlice";


const UpdateBlog = () => {

    const editor = useRef(null);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const params = useParams();

    const id = params.blogId;


    // =====================================================
    // REDUX
    // =====================================================

    const { blog } = useSelector(
        (store) => store.blog
    );


    // =====================================================
    // SELECT BLOG
    // =====================================================

    const selectedBlog = blog?.find(
        (item) => item._id === id
    );


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(false);

    const [publish, setPublish] =
        useState(
            selectedBlog?.isPublished || false
        );

    const [content, setContent] =
        useState(
            selectedBlog?.description || ""
        );

    const [blogData, setBlogData] =
        useState({
            title: selectedBlog?.title || "",
            subtitle: selectedBlog?.subtitle || "",
            description: selectedBlog?.description || "",
            category: selectedBlog?.category || "",
            thumbnail: null,
        });

    const [previewThumbnail, setPreviewThumbnail] =
        useState(
            selectedBlog?.thumbnail || ""
        );


    // =====================================================
    // KEEP STATE UPDATED WHEN BLOG LOADS
    // =====================================================

    useEffect(() => {

        if (!selectedBlog) {
            return;
        }

        setPublish(
            selectedBlog.isPublished || false
        );

        setContent(
            selectedBlog.description || ""
        );

        setBlogData({
            title: selectedBlog.title || "",
            subtitle: selectedBlog.subtitle || "",
            description:
                selectedBlog.description || "",
            category:
                selectedBlog.category || "",
            thumbnail: null,
        });

        setPreviewThumbnail(
            selectedBlog.thumbnail || ""
        );

    }, [selectedBlog]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setBlogData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =====================================================
    // CATEGORY
    // =====================================================

    const selectCategory = (value) => {

        setBlogData((prev) => ({
            ...prev,
            category: value,
        }));
    };


    // =====================================================
    // THUMBNAIL
    // =====================================================

    const selectThumbnail = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        setBlogData((prev) => ({
            ...prev,
            thumbnail: file,
        }));


        const fileReader =
            new FileReader();

        fileReader.onloadend = () => {

            setPreviewThumbnail(
                fileReader.result
            );
        };

        fileReader.readAsDataURL(file);
    };


    // =====================================================
    // UPDATE BLOG
    // =====================================================

    const updateBlogHandler = async () => {

        if (!selectedBlog) {
            toast.error("Blog not found");
            return;
        }


        if (!blogData.title.trim()) {
            toast.error("Please enter a title");
            return;
        }


        if (!blogData.category) {
            toast.error(
                "Please select a category"
            );
            return;
        }


        try {

            setLoading(true);


            const formData =
                new FormData();

            formData.append(
                "title",
                blogData.title
            );

            formData.append(
                "subtitle",
                blogData.subtitle || ""
            );

            formData.append(
                "description",
                content || ""
            );

            formData.append(
                "category",
                blogData.category
            );


            // Only send a new file if selected
            if (blogData.thumbnail) {

                formData.append(
                    "file",
                    blogData.thumbnail
                );
            }


            const res = await api.put(
                `/blog/${id}`,
                formData
            );


            console.log(
                "Update blog response:",
                res.data
            );


            if (res.data.success) {

                toast.success(
                    res.data.message ||
                    "Blog updated successfully"
                );


                // Update Redux state if backend
                // returns updated blog
                if (res.data.blog) {

                    const updatedBlogData =
                        blog.map((item) =>
                            item._id === id
                                ? res.data.blog
                                : item
                        );

                    dispatch(
                        setBlog(
                            updatedBlogData
                        )
                    );

                }


            } else {

                toast.error(
                    res.data.message ||
                    "Failed to update blog"
                );
            }

        } catch (error) {

            console.error(
                "Update blog error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to update blog"
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // PUBLISH / UNPUBLISH
    // =====================================================

    const togglePublishUnpublish = async (
        action
    ) => {

        if (!selectedBlog) {
            return;
        }

        try {

            const res = await api.patch(
                `/blog/${id}`,
                null,
                {
                    params: {
                        action,
                    },
                }
            );


            console.log(
                "Publish response:",
                res.data
            );


            if (res.data.success) {

                setPublish(
                    action === "true"
                );


                // Update Redux when backend returns blog
                if (res.data.blog) {

                    const updatedBlogData =
                        blog.map((item) =>
                            item._id === id
                                ? res.data.blog
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
                    "Blog status updated"
                );

                navigate(
                    "/dashboard/your-blog"
                );

            } else {

                toast.error(
                    res.data.message ||
                    "Failed to update"
                );
            }

        } catch (error) {

            console.error(
                "Publish/unpublish error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to update publish status"
            );
        }
    };


    // =====================================================
    // DELETE BLOG
    // =====================================================

    const deleteBlog = async () => {

        if (!selectedBlog) {
            return;
        }


        try {

            setLoading(true);


            const res = await api.delete(
                `/blog/delete/${id}`
            );


            console.log(
                "Delete blog response:",
                res.data
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


                navigate(
                    "/dashboard/your-blog"
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

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // BLOG NOT FOUND
    // =====================================================

    if (!selectedBlog) {

        return (
            <div className="min-h-screen pt-20 md:ml-[320px] flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-2xl font-bold mb-4">
                        Blog not found
                    </h2>

                    <Button
                        onClick={() =>
                            navigate(
                                "/dashboard/your-blog"
                            )
                        }
                    >
                        Back to Your Blogs
                    </Button>

                </div>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="pb-10 px-3 pt-20 md:ml-[320px]">

            <div className="max-w-6xl mx-auto mt-8">

                <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-2">

                    <h1 className="text-4xl font-bold">
                        Basic Blog Information
                    </h1>

                    <p>
                        Make changes to your blog here.
                        Click publish when you're done.
                    </p>


                    {/* ==================================================
                        PUBLISH / DELETE
                    ================================================== */}

                    <div className="space-x-2">

                        <Button
                            onClick={() =>
                                togglePublishUnpublish(
                                    selectedBlog.isPublished
                                        ? "false"
                                        : "true"
                                )
                            }
                        >
                            {
                                selectedBlog.isPublished
                                    ? "UnPublish"
                                    : "Publish"
                            }
                        </Button>


                        <Button
                            variant="destructive"
                            disabled={loading}
                            onClick={deleteBlog}
                        >
                            Remove Blog
                        </Button>

                    </div>


                    {/* ==================================================
                        TITLE
                    ================================================== */}

                    <div className="pt-10">

                        <Label>
                            Title
                        </Label>

                        <Input
                            type="text"
                            placeholder="Enter a title"
                            name="title"
                            value={
                                blogData.title
                            }
                            onChange={
                                handleChange
                            }
                            className="dark:border-gray-300"
                        />

                    </div>


                    {/* ==================================================
                        SUBTITLE
                    ================================================== */}

                    <div>

                        <Label>
                            Subtitle
                        </Label>

                        <Input
                            type="text"
                            placeholder="Enter a subtitle"
                            name="subtitle"
                            value={
                                blogData.subtitle
                            }
                            onChange={
                                handleChange
                            }
                            className="dark:border-gray-300"
                        />

                    </div>


                    {/* ==================================================
                        DESCRIPTION
                    ================================================== */}

                    <div>

                        <Label>
                            Description
                        </Label>

                        <JoditEditor
                            ref={editor}
                            value={
                                blogData.description
                            }
                            onChange={
                                (newContent) => {

                                    setContent(
                                        newContent
                                    );

                                    setBlogData(
                                        (prev) => ({
                                            ...prev,
                                            description:
                                                newContent,
                                        })
                                    );
                                }
                            }
                        />

                    </div>


                    {/* ==================================================
                        CATEGORY
                    ================================================== */}

                    <div>

                        <Label>
                            Category
                        </Label>

                        <Select
                            value={
                                blogData.category
                            }
                            onValueChange={
                                selectCategory
                            }
                        >

                            <SelectTrigger className="w-[180px]">

                                <SelectValue placeholder="Select a category" />

                            </SelectTrigger>


                            <SelectContent>

                                <SelectGroup>

                                    <SelectLabel>
                                        Category
                                    </SelectLabel>

                                    <SelectItem value="Web Development">
                                        Web Development
                                    </SelectItem>

                                    <SelectItem value="Digital Marketing">
                                        Digital Marketing
                                    </SelectItem>

                                    <SelectItem value="Blogging">
                                        Blogging
                                    </SelectItem>

                                    <SelectItem value="Photography">
                                        Photography
                                    </SelectItem>

                                    <SelectItem value="Cooking">
                                        Cooking
                                    </SelectItem>

                                </SelectGroup>

                            </SelectContent>

                        </Select>

                    </div>


                    {/* ==================================================
                        THUMBNAIL
                    ================================================== */}

                    <div>

                        <Label>
                            Thumbnail
                        </Label>

                        <Input
                            id="file"
                            type="file"
                            onChange={
                                selectThumbnail
                            }
                            accept="image/*"
                            className="w-fit dark:border-gray-300"
                        />


                        {previewThumbnail && (

                            <img
                                src={
                                    previewThumbnail
                                }
                                className="w-64 my-2"
                                alt="Blog thumbnail"
                            />

                        )}

                    </div>


                    {/* ==================================================
                        ACTION BUTTONS
                    ================================================== */}

                    <div className="flex gap-3">

                        <Button
                            variant="outline"
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            Back
                        </Button>


                        <Button
                            disabled={loading}
                            onClick={
                                updateBlogHandler
                            }
                        >

                            {
                                loading
                                    ? "Please Wait"
                                    : "Save"
                            }

                        </Button>

                    </div>

                </Card>

            </div>

        </div>
    );
};

export default UpdateBlog;