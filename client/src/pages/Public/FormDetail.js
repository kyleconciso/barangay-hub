
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Link } from '@mui/material';
import { getForm } from '../../api/forms';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const FormDetail = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const fetchedForm = await getForm(id);
                if (fetchedForm) {
                    setForm(fetchedForm);
                } else {
                    setError(new Error("Form not found"));
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFormData();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error.message} />;
    if (!form) return <div>Form not found.</div>

    return (
        <Container>
            <Typography variant='h3' gutterBottom>{form.title}</Typography>
            <Typography variant='body1'>{form.description}</Typography>
            <Link href={form.link} target="_blank" rel="noopener noreferrer">
                Go to Form
            </Link>
            {form.logoURL && (
                <img src={form.logoURL} alt={form.title} style={{maxWidth: '100%', marginTop: '1rem'}} />
            )}
        </Container>
    )
}

export default FormDetail;