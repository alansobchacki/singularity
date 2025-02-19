"use client";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";

const LoginPage = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
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
      <div className="w-1/2 flex flex-col justify-center items-center">
        <h1 className="text-xl font-bold text-black">Login</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            console.log(values);
            alert("Form submitted!");
            // implement valid logic here
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.email}
                name="email"
                placeholder="Email"
                className="text-black border p-2"
              />
              {props.errors.email && props.touched.email && (
                <div className="text-red-500">{props.errors.email}</div>
              )}

              <input
                type="password"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.password}
                name="password"
                placeholder="Password"
                className="text-black border p-2"
              />
              {props.errors.password && props.touched.password && (
                <div className="text-red-500">{props.errors.password}</div>
              )}
              <button className="text-black border p-3" type="submit">
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
