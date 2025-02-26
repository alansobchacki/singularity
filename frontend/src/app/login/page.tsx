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
      .min(8, "Your password must have more than 8 characters")
      .required("Write your password"),
  });

  return (
    <div className="flex flex-row h-screen bg-white">
      <div className="w-1/2 bg-blue-200"></div>
      <div className="w-1/2 flex flex-col justify-center items-center gap-5">
        <h1 className="text-xl font-bold text-black">Login</h1>
        <Formik
          initialValues={{
            email: "newuser69@example.com",
            password: "password123",
          }}
          validationSchema={loginSchema}
          onSubmit={(values, { setSubmitting }) => {
            login(values, {
              onSuccess: () => {
                alert("Login successful!");
              },
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
                  className="text-black border p-2"
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
                  className="text-black border p-2 w-full"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500"
                />
              </>

              <button
                type="submit"
                className="text-black border p-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-black">
          Don't have an account?{" "}
          <span
            className="cursor-pointer text-blue-500"
            onClick={() => router.push("/signup")}
          >
            Create one.
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
