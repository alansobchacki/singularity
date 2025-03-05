"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLogin } from "../../hooks/userService/useLogin";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const LoginPage = () => {
  const { mutate: login } = useLogin();
  const router = useRouter();

  const loginSchema = Yup.object({
    email: Yup.string()
      .email("Write a valid email")
      .required("Write your email"),
    password: Yup.string()
      .min(8, "Minimum of 8 characters")
      .required("Write your password"),
  });

  return (
    <section id="login-section" className="flex flex-row h-screen bg-white">
      <div id="left-container" className="flex flex-col justify-center items-center w-1/2 bg-blue-200">
        <h1 className="text-xl font-bold text-black">Learning Book</h1>
        <h2 className="text-black">A full-stack social media app built for learning purposes.</h2>
      </div>

      <div id="right-container" className="w-1/2 flex flex-col justify-center gap-5">
        <div id="form-container" className="flex flex-col mx-auto gap-3">
          <h2 className="text-xl font-bold text-black">Welcome Back</h2>
          <Formik
            initialValues={{
              email: "newuser69@example.com",
              password: "password123",
            }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
              login(values, {
                onError: () => {
                  alert("Wrong email or password. Please try again.");
                },
                onSettled: () => {
                  setSubmitting(false);
                },
              });
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <>
                  <Field
                    type="text"
                    name="email"
                    placeholder="Email"
                    className="text-black border p-2 rounded-lg"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500"
                  />
                </>

                <>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="text-black border p-2 rounded-lg"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500"
                  />
                </>

                <button
                  type="submit"
                  className="text-black border p-3 rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-black text-gray-400 text-center">- or -</p>
          
          {/*<button className="text-black border p-3 rounded-lg" disabled>Google Button (soon)</button>*/}
          <button className="text-black border p-3 rounded-lg">Enter as a guest</button>

          <p className="text-black">
            Don't have an account?{" "}
            <span
              className="cursor-pointer text-blue-500"
              onClick={() => router.push("/signup")}
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
