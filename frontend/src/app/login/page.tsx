"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLogin } from "../../hooks/userService/useLogin";
import { useSpectatorLogin } from "../../hooks/userService/useSpectatorLogin";
import Link from "next/link";
import * as Yup from "yup";

const LoginPage = () => {
  const { mutate: login } = useLogin();
  const { mutate: spectatorLogin } = useSpectatorLogin();

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

  return (
    <section className="flex flex-col-reverse sm:flex-row max-sm:items-center max-sm:justify-around max-sm:gap-5 h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white">
      <div className="flex flex-col justify-center items-center w-full sm:w-1/2 sm:p-10 text-center">
        <h1 className="text-3xl font-bold">Learning Book</h1>
        <p className="mt-2 text-lg">A full-stack social media app built for learning purposes.</p>
      </div>

      <div className="w-[90%] flex sm:w-1/2 max-sm:rounded-lg max-sm:mt-5 flex-col justify-center items-center bg-white p-10 shadow-lg">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Welcome Back
          </h2>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
              login(values, {
                onError: () => {
                  alert("Incorrect email or password. Please try again.");
                },
                onSettled: () => {
                  setSubmitting(false);
                },
              });
            }}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className="space-y-4">
                <Field
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition disabled:bg-gray-400"
                  disabled={isSubmitting || !isValid || !dirty}
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
            View as Spectator
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
