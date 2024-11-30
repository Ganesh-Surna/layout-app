'use client'
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import ReactJson from 'react-json-view';

const ServiceTester = () => {
  const [serviceName, setServiceName] = useState('GamesLiveService');
  const [methodName, setMethodName] = useState('getByGamePin');
  const [requestBody, setRequestBody] = useState('{"gamePin":"272780"}');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
         serviceName, // Assuming service is part of the payload, can be empty or fixed
         methodName,
         reqBody: JSON.parse(requestBody), // Parse the request body to send as an object
      };
      // Send POST request to /api/client
      const response = await fetch('/api/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred while invoking the service',err);
      console.log("Error ",err)
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Test Service API
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Service Name"
              fullWidth
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              helperText="Enter the service name if applicable"
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Method Name"
              fullWidth
              value={methodName}
              onChange={(e) => setMethodName(e.target.value)}
              required
              helperText="Enter the method name to invoke"
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Request Body (JSON format)"
              fullWidth
              multiline
              rows={4}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              required
              helperText="Enter a JSON object for the request body"
            />
          </Box>

          <Button variant="contained" color="primary" type="submit">
            Invoke API
          </Button>
        </form>

        {result && (
          <Box mt={4}>
            <Typography variant="h6">API Response:</Typography>
            <ReactJson src={result} theme="monokai" collapsed={false}  enableClipboard={true} />
          </Box>
        )}

        {error && (
          <Box mt={4}>
            <Typography color="error" variant="h6">
              Error: {error}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ServiceTester;
