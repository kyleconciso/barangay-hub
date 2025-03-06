import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/settings.service';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import Loader from '../UI/Loader'; 
import ErrorMessage from '../UI/ErrorMessage';

function SettingsForm() {
  const [settings, setSettings] = useState({
    googleGeminiKey: '',
    facebookPageId: '',
    facebookAccessToken: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const fetchedSettings = await getSettings();
        setSettings(fetchedSettings);
      } catch (err) {
        setError('Failed to load settings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError('');
    setSuccess('');
    try {
      await updateSettings(settings);
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError(err.message ||'Failed to update settings.');
    }finally{
        setLoading(false);
    }
  };

  if (loading) {
    return <Loader />; // Show a loading indicator
  }


  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Site Settings
      </Typography>
        {error && <ErrorMessage message={error}/>}
        {success && <Typography color='green'>{success}</Typography>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Google Gemini Key"
          name="googleGeminiKey"
          value={settings.googleGeminiKey || ''}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Facebook Page ID"
          name="facebookPageId"
          value={settings.facebookPageId || ''}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Facebook Access Token"
          name="facebookAccessToken"
          value={settings.facebookAccessToken || ''}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
}

export default SettingsForm;