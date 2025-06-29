// src/lib/schemas.js
// Simplified Yup-like schema for demonstration
export const yup = {
  string: () => {
    const schema = { _type: 'string', _required: false, _min: 0, _message: '' };
    schema.required = (message) => {
      schema._required = true;
      schema._message = message;
      return schema; // Return schema for chaining
    };
    schema.min = (len, message) => {
      schema._min = len;
      if (message) schema._message = message; // Update message if provided
      return schema; // Return schema for chaining
    };
    return schema;
  },
  array: () => {
    const schema = { _type: 'array', _required: false, _min: 0, _message: '' };
    schema.required = (message) => {
      schema._required = true;
      schema._message = message;
      return schema; // Return schema for chaining
    };
    schema.min = (len, message) => {
      schema._min = len;
      if (message) schema._message = message; // Update message if provided
      return schema; // Return schema for chaining
    };
    return schema;
  },
  object: () => ({
    shape: (fields) => ({
      _type: 'object',
      _fields: fields,
      validateSync: (data, options) => {
        const errors = { inner: [] };
        for (const key in fields) {
          const fieldSchema = fields[key];
          const value = data[key];

          if (fieldSchema._required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))) {
            errors.inner.push({ path: key, message: fieldSchema._message || `${key} is required.` });
          }

          if (fieldSchema._type === 'string' && fieldSchema._min && typeof value === 'string' && value.length < fieldSchema._min) {
            errors.inner.push({ path: key, message: fieldSchema._message || `${key} must be at least ${fieldSchema._min} characters.` });
          }
          if (fieldSchema._type === 'array' && fieldSchema._min && Array.isArray(value) && value.length < fieldSchema._min) {
            errors.inner.push({ path: key, message: fieldSchema._message || `${key} must have at least ${fieldSchema._min} items.` });
          }
        }
        if (errors.inner.length > 0) {
          throw errors;
        }
        return data;
      },
      validateAt: (path, data, options) => {
        const errors = { inner: [] };
        const fieldSchema = fields[path];
        const value = data[path];

        if (fieldSchema._required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))) {
          errors.inner.push({ path: path, message: fieldSchema._message || `${path} is required.` });
        }

        if (fieldSchema._type === 'string' && fieldSchema._min && typeof value === 'string' && value.length < fieldSchema._min) {
          errors.inner.push({ path: path, message: fieldSchema._message || `${path} must be at least ${fieldSchema._min} characters.` });
        }
        if (fieldSchema._type === 'array' && fieldSchema._min && Array.isArray(value) && value.length < fieldSchema._min) {
            errors.inner.push({ path: path, message: fieldSchema._message || `${path} must have at least ${fieldSchema._min} items.` });
        }

        if (errors.inner.length > 0) {
            throw errors;
        }
        return { [path]: value };
      }
    }),
  }),
};

export const onboardingFormSchema = yup.object().shape({
  name: yup.string().required('Artist Name is required.'),
  bio: yup.string().required('Bio is required.').min(50, 'Bio must be at least 50 characters.'),
  category: yup.array().min(1, 'At least one category must be selected.').required('Category is required.'),
  languagesSpoken: yup.array().min(1, 'At least one language must be selected.').required('Languages Spoken are required.'),
  feeRange: yup.string().required('Fee Range is required.'),
  location: yup.string().required('Location is required.'),
});
