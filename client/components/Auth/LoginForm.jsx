import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './LoginForm.css';
import { loginSchema } from '../../utils/validation';

function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();

     const { values, errors, handleChange, handleSubmit } = useForm(
       {
         initialValues: { email: '', password: '' },
         validationSchema: loginSchema,
         onSubmit: async (formValues) => {
           try {
             await login(formValues);
             navigate('/');
           } catch (error) {
           }
         },
       }
     );

    return (
        <div className={styles.formContainer}>
            <h2>Login</h2>
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
                <Button type="submit" className={styles.loginButton}>Login</Button>
            </form>
        </div>
    );
}

export default LoginForm;