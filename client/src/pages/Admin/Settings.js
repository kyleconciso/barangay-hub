import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { getSettings, updateSettings } from '../../api/settings';

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSettings();
        setSettings(data || {});
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings((prevSettings) => ({ ...prevSettings, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateSettings(settings);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Google Gemini Key"
          name="googleGeminiKey"
          value={settings.googleGeminiKey || ''}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Facebook Page ID"
          name="facebookPageId"
          value={settings.facebookPageId || ''}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Facebook Access Token"
          name="facebookAccessToken"
          value={settings.facebookAccessToken || ''}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default AdminSettings;