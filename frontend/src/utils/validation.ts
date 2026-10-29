import * as Yup from "yup";

export const contentSchema = Yup.object({
  content: Yup.string()
    .min(4, "Your content must have more than 4 characters")
    .max(250, "Your content must have less than 250 characters")
    .required("You must write something first"),
});
