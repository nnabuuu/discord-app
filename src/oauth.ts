// This server is used to fetch user token

import express from 'express';
import { AuthorizationCode } from 'simple-oauth2';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Replace with your application's client ID and client secret
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Replace with your application's OAuth2 redirect URL
const REDIRECT_URI = 'http://50.18.130.205:8877/callback';

// Scopes your application needs to access. You can modify this as needed.
const SCOPE = 'bot applications.commands';

// Discord's authorization endpoint
const AUTHORIZATION_BASE_URL = 'https://discord.com/api/oauth2/authorize';

// Discord's token endpoint
const TOKEN_URL = 'https://discord.com/api/oauth2/token';

// Create an OAuth2 client with your application's credentials
const oauth2Client = new AuthorizationCode({
  client: {
    id: CLIENT_ID,
    secret: CLIENT_SECRET,
  },
  auth: {
    authorizePath: AUTHORIZATION_BASE_URL,
    tokenHost: 'https://discord.com',
    tokenPath: TOKEN_URL,
  },
});

// Redirect the user to Discord's authorization endpoint to start the OAuth2 flow
app.get('/', (req, res) => {
  const authorizationUri = oauth2Client.authorizeURL({
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
  });
  console.log("Redirecting to:", authorizationUri);
  res.redirect(authorizationUri);
});

// Exchange the authorization code for an access token
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokenParams = {
      code: code as string,
      redirect_uri: REDIRECT_URI,
    };
    const tokenResponse = await oauth2Client.getToken(tokenParams);
    console.log("User's token:", tokenResponse.token.access_token);
    // Use the access token to make API requests on behalf of the user
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenResponse.token.access_token}`,
      },
    });
    const user = await userResponse.json();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});

app.listen(8877, () => {
  console.log('Server started on port 8877');
});
