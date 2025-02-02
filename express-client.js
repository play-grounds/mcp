#!/usr/bin/env node

const axios = require('axios');

// Helper function to create a JSON-RPC request
function createRequest (method, params = null) {
  return {
    jsonrpc: "2.0",
    method: method,
    params: params,
    id: Math.floor(Math.random() * 10000) // Generate a random request ID
  };
}

// Helper function to send requests to the server
async function sendRequest (request) {
  try {
    const response = await axios.post('http://localhost:4000', request, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

async function main () {
  try {
    // Send initialize request
    console.log('Sending initialize request...');
    const initResponse = await sendRequest(createRequest('initialize'));
    console.log('Initialize response:', initResponse);

    // Send echo request
    console.log('\nSending echo request...');
    const echoResponse = await sendRequest(createRequest('echo', 'Hello, Server!'));
    console.log('Echo response:', echoResponse);

    // Test error case with unknown method
    console.log('\nTesting unknown method...');
    const errorResponse = await sendRequest(createRequest('unknown_method'));
    console.log('Error response:', errorResponse);

  } catch (error) {
    console.error('Failed to communicate with server:', error.message);
  }
}

// Run the client
main();