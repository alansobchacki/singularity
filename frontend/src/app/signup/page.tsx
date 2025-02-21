"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCreateUser } from "../../hooks/userService/useCreateUser";
import * as Yup from "yup";

const CreateAccountPage = () => {
  const { mutate: user } = useCreateUser();

  const createUserSchema = Yup.object({
    email: Yup.string()
      .email("Write a valid email")
      .required("Write your email"),
    name: Yup.string()
      .min(4, "Your name must have more than 4 characters")
      .required("Write your name"),
    password: Yup.string()
      .min(8, "Your password must have more than 8 characters")
      .required("Write your password"),
  });

  return (
    <div className="flex flex-row h-screen bg-white">
      <div className="w-1/2 bg-blue-200"></div>
      <div className="w-1/2 flex flex-col justify-center items-center">
        <h1 className="text-xl font-bold text-black">Login</h1>
        <Formik
          initialValues={{ email: "", name: "", password: "" }}
          validationSchema={createUserSchema}
          onSubmit={(values, { setSubmitting }) => {
            const userData = { ...values, userType: "REGULAR" };

            user(userData, {
              onSuccess: () => {
                alert("Account Created!");
              },
              onError: () => {
                alert("Failed to create account. Please try again later.");
              },
              onSettled: () => {
                setSubmitting(false);
              },
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
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

              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="text-black border p-2"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500"
              />

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
      </div>
    </div>
  );
};

export default CreateAccountPage;
