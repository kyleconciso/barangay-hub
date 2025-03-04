import { useState, useCallback } from 'react';

const useForm = ({ initialValues, validationSchema, onSubmit }) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

   const handleChange = useCallback((event) => {
     const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        // clear err when change
        if(errors[name]){
            setErrors((prevErrors) => ({
              ...prevErrors,
              [name]: null,
            }));
        }

    }, [errors]);

    const validate = useCallback(() => {
        if (!validationSchema) {
          return true; // no schema-validation
        }

        try {
            validationSchema.validateSync(values, { abortEarly: false });
            setErrors({});
            return true; // pass
        } catch (validationErrors) {
          const formattedErrors = {};
          validationErrors.inner.forEach((error) => {
            formattedErrors[error.path] = error.message;
          });
          setErrors(formattedErrors);
          return false; // fail
        }
    }, [validationSchema, values]);

    const handleSubmit = useCallback(async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      if (validate()) {
        try {
          await onSubmit(values); // call passed onSubmit
        } catch (error) {
             console.error("Submission error:", error);
        }
      }
        setIsSubmitting(false);
    }, [onSubmit, validate, values]); //  dependencies

  return { values, errors, isSubmitting, handleChange, handleSubmit };
};

export default useForm;