import { Formik, Form, Field, ErrorMessage } from "formik";
import { useCreateComment } from "../../hooks/commentService/useCreateComment";
import { contentSchema } from "../../utils/validation";
import Button from "../Button";

interface CommentFormProps {
  postId: string;
  onDone: () => void;
}

const CommentForm = ({ postId, onDone }: CommentFormProps) => {
  const { mutate: createComment } = useCreateComment();

  return (
    <Formik
      initialValues={{ postId, content: "" }}
      validationSchema={contentSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        createComment(values, {
          onSuccess: () => {
            resetForm();
            onDone();
          },
          onSettled: () => setSubmitting(false),
        });
      }}
    >
      {({ isSubmitting, isValid, values }) => (
        <Form className="mt-3 space-y-2">
          <Field
            as="textarea"
            name="content"
            rows={2}
            placeholder="Write a comment..."
            className="input resize-none"
            autoFocus
          />
          <ErrorMessage name="content" component="div" className="form-error" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onDone}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || !values.content.trim()}
            >
              {isSubmitting ? "Commenting..." : "Comment"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CommentForm;
