"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCreateUser } from "../../hooks/userService/useCreateUser";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const CreateAccountPage = () => {
  const { mutate: createUser } = useCreateUser();
  const router = useRouter();

  const createUserSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    name: Yup.string()
      .min(4, "Your name must have more than 4 characters")
      .required("Name is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  return (
    <section className="flex h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white">
      <div className="flex flex-col justify-center items-center w-1/2 p-10 text-center">
        <h1 className="text-3xl font-bold">Learning Book</h1>
        <p className="mt-2 text-lg">Join us and start learning today.</p>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-10 shadow-lg">
        <div className="w-full flex flex-col max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Create Your Account</h2>

          <Formik
            initialValues={{ email: "", name: "", password: "" }}
            validationSchema={createUserSchema}
            onSubmit={(values, { setSubmitting }) => {
              const userData = { ...values, userType: "REGULAR" };

              createUser(userData, {
                onSuccess: () => {
                  alert("Account Created!");
                  router.push("/login");
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
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="email"
                    placeholder="Email"
                    className="w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </Form>
            )}
          </Formik>

          <button
            className="text-blue-500 text-center mx-auto cursor-pointer bg-transparent border-none p-0"
            onClick={() => router.push("/login")}
          >
            ← Return
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateAccountPage;
