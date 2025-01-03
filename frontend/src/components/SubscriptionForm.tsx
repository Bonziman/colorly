import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail } from '../utils/emailService'; // Import the email service

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SubscriptionForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email) {
      setMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Insert email into Supabase table
      const { data, error } = await supabase.from('Subscribed_Emails').insert([{ email }]);

      if (error) {
        throw error;
      }

      // Send welcome email using Mailgun
      await sendWelcomeEmail(email); // Call the function to send the welcome email

      setEmail('');
      setStatus('success');
      setMessage('Thank you for subscribing! A welcome email has been sent.');
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.subscribeContainer}>
      <input
        type="email"
        placeholder="Enter your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSubscribe} style={styles.button} disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && <p style={status === 'success' ? styles.successMessage : styles.errorMessage}>{message}</p>}
    </div>
  );
};

// Your styles
const styles = {
  subscribeContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '10px',
    marginTop: '10px',
  },
  input: {
    flex: '1',
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  successMessage: {
    color: 'green',
    fontSize: '14px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
  },
};

export default SubscriptionForm;
