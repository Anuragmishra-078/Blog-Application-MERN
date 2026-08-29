import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import api from "@/api/axios";
import { toast } from 'sonner'
import auth from "../assets/auth.jpg"

const Signup = () => {

    const navigate = useNavigate()

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Signup data:", user);

        try {

            const response = await api.post(
                "/user/register",
                user
            );

            console.log("Signup response:", response.data);

            if (response.data.success) {

                toast.success(
                    response.data.message || "Account created successfully"
                );

                navigate("/login");

            } else {

                toast.error(
                    response.data.message || "Registration failed"
                );
            }

        } catch (error) {

            console.error("Signup error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="flex h-screen md:pt-14 md:h-[760px]">

            <div className="hidden md:block">
                <img
                    src={auth}
                    alt="Authentication"
                    className="h-[700px]"
                />
            </div>

            <div className="flex justify-center items-center flex-1 px-4 md:px-0">

                <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">

                    <CardHeader>

                        <CardTitle>
                            <h1 className="text-center text-xl font-semibold">
                                Create an account
                            </h1>
                        </CardTitle>

                        <p className="mt-2 text-sm font-serif text-center dark:text-gray-300">
                            Enter your details below to create your account
                        </p>

                    </CardHeader>

                    <CardContent>

                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit}
                        >

                            {/* First Name + Last Name */}

                            <div className="flex gap-3">

                                <div className="flex-1">

                                    <Label>First Name</Label>

                                    <Input
                                        type="text"
                                        placeholder="First Name"
                                        name="firstName"
                                        value={user.firstName}
                                        onChange={handleChange}
                                        className="dark:border-gray-600 dark:bg-gray-900"
                                        required
                                    />

                                </div>

                                <div className="flex-1">

                                    <Label>Last Name</Label>

                                    <Input
                                        type="text"
                                        placeholder="Last Name"
                                        name="lastName"
                                        value={user.lastName}
                                        onChange={handleChange}
                                        className="dark:border-gray-600 dark:bg-gray-900"
                                        required
                                    />

                                </div>

                            </div>

                            {/* Email */}

                            <div>

                                <Label>Email</Label>

                                <Input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    className="dark:border-gray-600 dark:bg-gray-900"
                                    required
                                />

                            </div>

                            {/* Password */}

                            <div className="relative">

                                <Label>Password</Label>

                                <Input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a Password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    className="dark:border-gray-600 dark:bg-gray-900"
                                    required
                                />

                                <button
                                    type="button"
                                    className="absolute right-3 top-9 text-gray-500"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {
                                        showPassword
                                            ? <EyeOff size={20} />
                                            : <Eye size={20} />
                                    }
                                </button>

                            </div>

                            {/* Submit */}

                            <Button
                                type="submit"
                                className="w-full"
                            >
                                Sign Up
                            </Button>

                            {/* Login link */}

                            <p className="text-center text-gray-600 dark:text-gray-300">

                                Already have an account?{" "}

                                <Link to="/login">

                                    <span className="underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100">
                                        Sign in
                                    </span>

                                </Link>

                            </p>

                        </form>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
};

export default Signup;