import axios from 'axios';

const sendinblueApiKey = import.meta.env.VITE_SENDINBLUE_API_KEY; 
const sendinblueBaseUrl = 'https://api.sendinblue.com/v3/smtp/email';

// Function to send the welcome email
export const sendWelcomeEmail = async (email: string) => {
  try {
    const response = await axios.post(
      sendinblueBaseUrl,
      {
        sender: { email: 'eloirdiwi@gmail.com', name: 'Colorly By Aymane Eloirdiwi' }, // Replace with your sender details
        to: [{ email }],
        subject: 'Welcome to Our Newsletter!',
        htmlContent: `<p>Thank you for subscribing to our newsletter. We're excited to have you with us!</p>`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': sendinblueApiKey,
        },
      }
    );

    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error);
  }
};
