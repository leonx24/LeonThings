# EmailJS Setup Guide

Follow these steps to connect your contact form to EmailJS:

## 1. Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email

## 2. Add Email Service

1. Go to **Email Services** in dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Connect your email account
5. Note down your **Service ID** (e.g., `service_xyz123`)

## 3. Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

```
Subject: New Contact from {{from_name}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}
```

4. Save and note down your **Template ID** (e.g., `template_abc456`)

## 4. Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `AbCdEfGhIjKlMnOp`)

## 5. Update Contact Component

Open `src/components/contact.jsx` and replace these values:

```javascript
await emailjs.send(
  "service_xyz123",     // Replace with your Service ID
  "template_abc456",    // Replace with your Template ID
  {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
  },
  "AbCdEfGhIjKlMnOp"  // Replace with your Public Key
)
```

## 6. Test the Form

1. Run `npm run dev`
2. Fill out the contact form
3. Submit and check your email inbox

## Free Tier Limits

- 200 emails/month
- Perfect for portfolio contact forms
- Upgrade if you need more

## Alternative: Formspree

If you prefer Formspree instead:
1. Go to https://formspree.io/
2. Create account and get form endpoint
3. Replace EmailJS with simple fetch() to Formspree endpoint

---

**Note:** Don't commit your EmailJS keys to GitHub! 
Consider using environment variables for production.
