'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Accepts formats like: 123-456-7890, (123) 456-7890, 123.456.7890, 1234567890
    const phoneRegex = /^[\d\s\-\.\(\)]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Name Field */}
      <div className="field">
        <input className={`${errors.name ? 'border-red/20' : ''}`} type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder=' ' aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
        <label htmlFor="name">Name</label>
        {errors.name && (<p id="name-error" className="error">{errors.name}</p>)}
      </div>

      {/* Email Field */}
      <div className="field">
        <input className={`${errors.email ? 'border-red/20' : ''}`} type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder=' ' aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
        <label htmlFor="email">Email</label>
        {errors.email && (<p id="email-error" className="error">{errors.email} </p>)}
      </div>

      {/* Phone Field */}
      <div className="field">
        <input className={`${errors.phone ? 'border-red/20' : ''}`} type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder=' ' aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} />
        <label htmlFor="phone">Phone</label>
        {errors.phone && (<p id="phone-error" className="error">{errors.phone}</p>)}
      </div>

      {/* Message Field */}
      <div className="field">
        <textarea className={`${errors.message ? 'border-red/20' : ''}`} id="message" name="message" value={formData.message} onChange={handleChange} rows={5} placeholder=' ' aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />
        <label htmlFor="message">Message</label>
        {errors.message && (<p id="message-error" className="error">{errors.message}</p>)}
      </div>

      {/* Submit Button */}
      <button className='btn self-start mt-2' type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send'}</button>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <p className="success">Thank you! Your message has been sent successfully.</p>
      )}
      {submitStatus === 'error' && (
        <p className="error">Sorry, there was an error sending your message. Please try again.</p>
      )}
    </form>
  );
}
