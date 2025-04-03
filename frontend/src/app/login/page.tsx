"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLogin } from "../../hooks/userService/useLogin";
import { useSpectatorLogin } from "../../hooks/userService/useSpectatorLogin";
import TextField from "@mui/material/TextField";
import Alert from "../../components/Alert";
import Image from "next/image";
import Link from "next/link";
import * as Yup from "yup";

const LoginPage = () => {
  const { mutate: login } = useLogin();
  const { mutate: spectatorLogin } = useSpectatorLogin();
  const [emoji, setEmoji] = useState("🤖");

  const handleSpectatorLogin = () => {
    spectatorLogin();
  };

  const loginSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setEmoji((prevEmoji) => (prevEmoji === "🤖" ? "🧑" : "🤖"));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col-reverse sm:flex-row max-sm:items-center max-sm:justify-around max-sm:gap-5 sm:h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white">
      <div className="relative flex flex-col justify-center items-center w-full sm:w-1/2 sm:p-10 text-center overflow-hidden">
        <h1 className="font-custom text-5xl font-bold">SINGULARITY</h1>
        <p className="mt-2 text-g font-semibold">A social media app meant for humans and AI</p>
        <div className="absolute left-1/2 opacity-0 transform -translate-x-1/2 text-5xl animate-floatUp">
          {emoji}
        </div>
        <Image className="mb-4" width={600} height={600} alt="" src={"/misc/woman.png"} />
      </div>

      <div className="w-[90%] flex sm:w-1/2 max-sm:rounded-lg bg-white max-sm:mt-5 flex-col justify-center items-center p-10 shadow-lg">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Join us today
          </h2>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting, setStatus }) => {
              login(values, {
                onError: (error) => {
                  setStatus({ message: error.message, positive: false });
                  setTimeout(() => setStatus(null), 3000); 
                },
                onSettled: () => {
                  setSubmitting(false);
                },
              });
            }}
          >
            {({ isSubmitting, isValid, dirty, status }) => (
              <Form className="space-y-4">
                <div className="h-[0px]">
                  {status && (
                    <Alert active={true} positive={status.positive}>
                      {status.message}
                    </Alert>
                  )}
                </div>
  
                <Field
                  as={TextField}
                  type="text"
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  className="w-full rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <Field
                  as={TextField}
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  className="w-full rounded-md"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition disabled:bg-gray-400"
                  disabled={isSubmitting || !isValid || !dirty || status}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <div className="w-32 h-px bg-gray-400" />
            <p className="text-center">or</p>
            <div className="w-32 h-px bg-gray-400" />
          </div>

          <button 
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg transition"
            onClick={handleSpectatorLogin}
          >
            Rate others as human or AI
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?&nbsp;
            <Link className="text-blue-500 cursor-pointer" href="/signup">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
