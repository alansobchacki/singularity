"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import { useLogin } from "../../hooks/userService/useLogin";
import AuthShell from "../../components/AuthShell";
import Button from "../../components/Button";

const loginSchema = Yup.object({
  email: Yup.string().email("Please enter a valid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const { mutate: login } = useLogin();

  return (
    <AuthShell>
      <h2 className="text-2xl font-semibold">Sign in to create content</h2>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values, { setSubmitting }) => {
          login(values, { onSettled: () => setSubmitting(false) });
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <Field id="email" type="email" name="email" placeholder="you@example.com" className="input" />
              <ErrorMessage name="email" component="div" className="form-error" />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                Password
              </label>
              <Field id="password" type="password" name="password" className="input" />
              <ErrorMessage name="password" component="div" className="form-error" />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !isValid || !dirty}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </Form>
        )}
      </Formik>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link className="link" href="/signup">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
};

export default LoginPage;
