"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as Yup from "yup";
import { useCreateUser } from "../../hooks/userService/useCreateUser";
import AuthShell from "../../components/AuthShell";
import Button from "../../components/Button";

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

const fields = [
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "name", label: "Name", type: "text", placeholder: "How people will see you" },
  { name: "password", label: "Password", type: "password", placeholder: "At least 8 characters" },
];

const CreateAccountPage = () => {
  const { mutate: createUser } = useCreateUser();
  const router = useRouter();

  return (
    <AuthShell>
      <h2 className="text-2xl font-semibold">Create Your Account</h2>

      <Formik
        initialValues={{ email: "", name: "", password: "" }}
        validationSchema={createUserSchema}
        onSubmit={(values, { setSubmitting }) => {
          createUser(
            values,
            {
              onSuccess: () => router.push("/login"),
              onSettled: () => setSubmitting(false),
            }
          );
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                  {field.label}
                </label>
                <Field
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="input"
                />
                <ErrorMessage name={field.name} component="div" className="form-error" />
              </div>
            ))}

            <Button type="submit" className="w-full" disabled={isSubmitting || !isValid || !dirty}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </Form>
        )}
      </Formik>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="link" href="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

export default CreateAccountPage;
