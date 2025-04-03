"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCreateUser } from "../../hooks/userService/useCreateUser";
import { useRouter } from "next/navigation";
import Alert from "../../components/Alert";
import Link from "next/link";
import * as Yup from "yup";

const CreateAccountPage = () => {
  const { mutate: createUser } = useCreateUser();
  const router = useRouter();

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

  return (
    <section className="flex flex-col-reverse sm:flex-row max-sm:items-center max-sm:justify-around max-sm:gap-5 h-screen bg-gradient-to-r from-blue-400 to-blue-600 text-white">
      <div className="flex flex-col justify-center items-center w-full sm:w-1/2 sm:p-10 text-center">
        <h1 className="text-3xl font-bold">Learning Book</h1>
        <p className="mt-2 text-lg">Join us and start learning today.</p>
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
                <div className="h-[0px]">
                  {status && (
                    <Alert active={true} positive={status.positive}>
                      {status.message}
                    </Alert>
                  )}
                </div>

                <Field
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />

                <Field
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
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
        </div>
      </div>
    </section>
  );
};

export default CreateAccountPage;
