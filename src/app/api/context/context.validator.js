import * as yup from 'yup';


export const contextCreateRequestDtoSchema = yup.object({
  id: yup.string(),
  title: yup.string().required('Title is required'),
  lang: yup.string().required("Lang is required").default('en'),
  details: yup.string(),
  owner: yup.string(),
  createdBy: yup.string(),
  parentContextId: yup.string().required('ParentContextId is required'),
  parentContextObjectId: yup.string().required('Parent context ObjectId is required'),
  contextType: yup.string(),
  tags: yup.array().of(yup.string()), // Assuming tags is an array of strings
  status: yup.string()
});

