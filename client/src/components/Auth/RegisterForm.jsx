// src/components/Auth/RegisterForm.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './RegisterForm.css';
import { registerSchema } from '../../utils/validation';

function RegisterForm() {
    const { register } = useAuth();
    const navigate = useNavigate();


     const { values, errors, handleChange, handleSubmit } = useForm({
       initialValues: {
         email: '',
         password: '',
         confirmPassword: '',
         displayName: '',
         phone: ''
       },
       validationSchema: registerSchema,
       onSubmit: async (formValues) => {
         try{
            await register(formValues);
            navigate('/');
         }
         catch(error){
         }
       }
     });

    return (
        <div className={styles.formContainer}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} noValidate>
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    error={errors.email}
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={errors.password}
                />
                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                />
                <Input
                    label="Display Name"
                    name="displayName"
                    type="text"
                    value={values.displayName}
                    onChange={handleChange}
                    placeholder="Enter your display name"
                    error={errors.displayName}
                />
                <Input
                    label="Phone (Optional)"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    error={errors.phone}
                />
                <Button type="submit">Register</Button>
            </form>
        </div>
    );
}

export default RegisterForm;