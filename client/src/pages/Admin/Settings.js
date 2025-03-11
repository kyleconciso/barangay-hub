import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material'
import { getSettings, updateSettings } from '../../api/settings';

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // success state

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
      setSuccess(false); 
      setError(null)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
      setSuccess(false);
    try {
      await updateSettings(settings);
        setSuccess(true); //set success to true
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };


    if (loading) {
    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Typography variant="h4" gutterBottom>
                  Settings
                </Typography>
                <Typography>Loading settings...</Typography>
            </Box>
        </Container>
        );
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
        <TextField
          fullWidth
          margin="normal"
          label="Announcement Text"
          name="announcementText"
          value={settings.announcementText || ''}
          onChange={handleChange}
          multiline 
          rows={4} 
        />
          {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error.message}
              </Alert>
            )}
            {success && ( 
              <Alert severity="success" sx={{ mt: 2 }}>
                Settings updated successfully!
              </Alert>
            )}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default AdminSettings;