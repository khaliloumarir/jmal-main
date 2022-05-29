import * as yup from "yup";
export const addProductSchema = yup.object().shape({
  Name: yup.string().required().min(1),
  Price: yup.number().required().positive().integer(),
  Contact: yup.string().required().min(1),
  Media: yup.array().min(1),
});
