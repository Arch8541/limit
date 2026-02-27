'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  HelpCircle,
  Bug,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Footer } from '@/components/layout/Footer';

type InquiryType = 'general' | 'support' | 'bug' | 'partnership';

const inquiryTypes: { id: InquiryType; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'general', label: 'General Inquiry', icon: <MessageSquare className="w-5 h-5" />, description: 'Questions about LIMIT' },
  { id: 'support', label: 'Technical Support', icon: <HelpCircle className="w-5 h-5" />, description: 'Help with the platform' },
  { id: 'bug', label: 'Report a Bug', icon: <Bug className="w-5 h-5" />, description: 'Found an issue?' },
  { id: 'partnership', label: 'Partnership', icon: <Briefcase className="w-5 h-5" />, description: 'Business opportunities' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: 'general' as InquiryType,
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production, this would send to your backend
    console.log('Contact form submitted:', formData);

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

        <header className="relative z-50 border-b border-[var(--border-subtle)]">
          <nav className="container-wide py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                  <Building2 className="w-5 h-5 text-[var(--bg-primary)]" />
                </div>
                <span className="text-xl font-bold tracking-tight">LIMIT</span>
              </Link>
            </div>
          </nav>
        </header>

        <div className="relative min-h-[70vh] flex items-center justify-center">
          <div className="container-narrow text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[var(--success-bg)] flex items-center justify-center mx-auto mb-8 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-[var(--success)]" />
            </div>
            <h1 className="heading-2 mb-4">Message Sent Successfully</h1>
            <p className="body-large mb-8">
              Thank you for reaching out! We've received your message and will get back to you within 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          </div>
        </div>

        <Footer variant="minimal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

      {/* Navigation */}
      <header className="relative z-50 border-b border-[var(--border-subtle)]">
        <nav className="container-wide py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <Building2 className="w-5 h-5 text-[var(--bg-primary)]" />
              </div>
              <span className="text-xl font-bold tracking-tight">LIMIT</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 border-b border-[var(--border-subtle)]">
        <div className="container-base text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] mb-6">
            <Mail className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-sm font-mono text-[var(--text-secondary)]">Get in Touch</span>
          </div>
          <h1 className="heading-1 mb-4">Contact Us</h1>
          <p className="body-large max-w-2xl mx-auto">
            Have questions about LIMIT? Need technical support? Want to explore partnership opportunities? We're here to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="heading-3 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:support@limitplatform.com" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                        support@limitplatform.com
                      </a>
                      <p className="text-sm text-[var(--text-muted)] mt-1">For general inquiries and support</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--blueprint-subtle)] flex items-center justify-center text-[var(--blueprint)] flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a href="tel:+919876543210" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                        +91 98765 43210
                      </a>
                      <p className="text-sm text-[var(--text-muted)] mt-1">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--success-bg)] flex items-center justify-center text-[var(--success)] flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office</h3>
                      <p className="text-[var(--text-secondary)]">
                        Ahmedabad, Gujarat<br />
                        India 380015
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--warning-bg)] flex items-center justify-center text-[var(--warning)] flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Response Time</h3>
                      <p className="text-[var(--text-secondary)]">
                        24-48 hours for general inquiries
                      </p>
                      <p className="text-sm text-[var(--text-muted)] mt-1">Priority support for paid users</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-[var(--border-subtle)]">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex items-center gap-3">
                  <a
                    href="https://twitter.com/limitplatform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/company/limitplatform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* FAQ Callout */}
              <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                <h3 className="font-semibold mb-2">Looking for quick answers?</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Check our documentation for common questions about GDCR compliance and platform usage.
                </p>
                <Button variant="secondary" size="sm">
                  View Documentation
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="p-8 rounded-[var(--radius-xl)] bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                <h2 className="heading-3 mb-2">Send us a Message</h2>
                <p className="text-[var(--text-secondary)] mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--error-bg)] border border-[var(--error)]/20">
                      <AlertCircle className="w-5 h-5 text-[var(--error)] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[var(--error)]">{error}</p>
                    </div>
                  )}

                  {/* Inquiry Type Selection */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
                      Type of Inquiry
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.id }))}
                          className={`p-4 rounded-[var(--radius-lg)] border text-left transition-all ${
                            formData.inquiryType === type.id
                              ? 'bg-[var(--accent-subtle)] border-[var(--accent-primary)] text-[var(--text-primary)]'
                              : 'bg-[var(--bg-tertiary)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          <div className={`mb-2 ${formData.inquiryType === type.id ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>
                            {type.icon}
                          </div>
                          <div className="font-medium text-sm">{type.label}</div>
                          <div className="text-xs text-[var(--text-muted)] mt-1">{type.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  {/* Phone and Company Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                    />
                    <Input
                      label="Company / Organization"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                    />
                  </div>

                  {/* Subject */}
                  <Input
                    label="Subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is your inquiry about?"
                    required
                  />

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your inquiry in detail..."
                      rows={6}
                      required
                      className="w-full px-4 py-3 rounded-[var(--radius-lg)] bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-subtle)] transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-[var(--text-muted)]">
                      We respect your privacy. See our{' '}
                      <Link href="/privacy" className="text-[var(--accent-primary)] hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                    >
                      Send Message
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
