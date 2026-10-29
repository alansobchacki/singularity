import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCreatePost } from "../../hooks/postService/useCreatePost";
import { contentSchema } from "../../utils/validation";
import Button from "../Button";

const CreatePostForm = ({ authorId }: { authorId: string }) => {
  const { mutate: createPost } = useCreatePost();

  return (
    <Formik
      initialValues={{ authorId, content: "" }}
      validationSchema={contentSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        createPost(values, {
          onSuccess: () => resetForm(),
          onSettled: () => setSubmitting(false),
        });
      }}
    >
      {({ isSubmitting, isValid, values }) => (
        <Form className="card space-y-3">
          <Field
            as="textarea"
            name="content"
            rows={3}
            placeholder="What's on your mind?"
            className="input resize-none"
            data-cy="post-content-input"
          />
          <ErrorMessage name="content" component="div" className="form-error" />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !values.content.trim()}
              data-cy="submit-post-button"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePostForm;
