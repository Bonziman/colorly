import axios from 'axios';

const mailgunApiKey = import.meta.env.VITE_MAILGUN_API_KEY; // Use the VITE_ prefix for environment variables in Vite
const mailgunDomain = import.meta.env.VITE_MAILGUN_DOMAIN;
const mailgunBaseUrl = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;

// Function to send the welcome email
export const sendWelcomeEmail = async (email: string) => {
  try {
    const response = await axios.post(
      mailgunBaseUrl,
      new URLSearchParams({
        from: 'eloirdiwi@gmail.com', // This should be a valid email address associated with Mailgun
        to: email,
        subject: 'Welcome to Our Newsletter!',
        text: 'Thank you for subscribing to our newsletter. We are glad to have you with us!',
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from('api:' + mailgunApiKey).toString('base64')}`,
        },
      }
    );
    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
