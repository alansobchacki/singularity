import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEditPost } from "../../hooks/postService/useEditPost";
import { contentSchema } from "../../utils/validation";
import Post from "../../interfaces/post/Post";
import Button from "../Button";
import Modal from "../Modal";

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
}

const EditPostModal = ({ post, onClose }: EditPostModalProps) => {
  const { mutate: editPost } = useEditPost();

  return (
    <Modal title="Edit post" onClose={onClose}>
      <Formik
        initialValues={{ content: post.content }}
        validationSchema={contentSchema}
        onSubmit={(values, { setSubmitting }) => {
          editPost(
            { postId: post.id, content: values.content },
            { onSuccess: onClose, onSettled: () => setSubmitting(false) }
          );
        }}
      >
        {({ isSubmitting, isValid, values }) => (
          <Form className="space-y-3">
            <Field as="textarea" name="content" rows={4} className="input resize-none" />
            <ErrorMessage name="content" component="div" className="form-error" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || !values.content.trim()}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditPostModal;
