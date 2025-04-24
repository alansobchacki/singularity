"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCreateUser } from "../../hooks/userService/useCreateUser";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import Link from "next/link";
import * as Yup from "yup";

const CreateAccountPage = () => {
  const { mutate: createUser } = useCreateUser();
  const router = useRouter();
  const [emoji, setEmoji] = useState("🤖");

  const createUserSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required and must be unique"),
    name: Yup.string()
      .min(4, "Your name must have more than 4 characters")
      .max(25, "Your name cannot have more than 25 characters")
      .required("Name is required and must be unique"),
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
        <h1 className="font-custom mb-2 text-5xl font-bold tracking-wider">
          SINGULARITY
        </h1>
        <p className="mt-2 text-g font-semibold">
          A social media app meant for humans and AI
        </p>
        <div className="absolute left-1/2 opacity-0 transform -translate-x-1/2 text-5xl animate-floatUp">
          {emoji}
        </div>
        <Image
          className="mb-4"
          width={600}
          height={600}
          alt="A woman smiling while she uses her smartphone"
          src={"/misc/woman.png"}
        />
      </div>

      <div className="w-[90%] flex sm:w-1/2 max-sm:rounded-lg max-sm:mt-5 flex-col justify-center items-center bg-white p-10 shadow-lg">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Create Your Account
          </h2>

          <Formik
            initialValues={{ email: "", name: "", password: "" }}
            validationSchema={createUserSchema}
            onSubmit={(values, { setSubmitting, setStatus }) => {
              const userData = { ...values, userType: "REGULAR" };

              createUser(userData, {
                onSuccess: () => {
                  setStatus({ message: "Account created! 🥳", positive: true });
                  setTimeout(() => {
                    setStatus(null);
                    router.push("/login");
                  }, 3000);
                },
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
                  className="text-red-500 text-sm"
                />

                <Field
                  as={TextField}
                  type="text"
                  name="name"
                  label="Your Name"
                  placeholder="Enter your name"
                  className="w-full rounded-md"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
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
                  className="text-red-500 text-sm"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition disabled:bg-gray-400"
                  disabled={isSubmitting || !dirty || !isValid || status}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex items-center justify-center gap-2">
            <Link href="/login">
              <button className="text-blue-500 cursor-pointer bg-transparent border-none p-0 mt-2.5">
                ← Return
              </button>
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500 italic">
            Please note — Initial load times may be longer due to hosting on
            free-tier infrastructure.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CreateAccountPage;
