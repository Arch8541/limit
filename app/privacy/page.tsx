'use client';

import Link from 'next/link';
import { Building2, ArrowLeft, Shield, Lock, Eye, Database, Mail, Clock } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'February 23, 2026';

  const sections = [
    {
      id: 'information-collection',
      icon: <Database className="w-5 h-5" />,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Account Information',
          text: 'When you create an account, we collect your name, email address, and password (encrypted). This information is necessary to provide you with access to our platform.'
        },
        {
          subtitle: 'Project Data',
          text: 'We collect project-related information you provide, including plot dimensions, boundary coordinates, location data, zoning information, and other parameters required for GDCR compliance analysis.'
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our platform, including pages visited, features used, and time spent on the platform. This helps us improve our services.'
        },
        {
          subtitle: 'Device Information',
          text: 'We collect basic device information such as browser type, operating system, and IP address for security and optimization purposes.'
        }
      ]
    },
    {
      id: 'data-usage',
      icon: <Eye className="w-5 h-5" />,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'We use your information to provide GDCR compliance analysis, generate reports, and deliver the core functionality of our platform.'
        },
        {
          subtitle: 'Communication',
          text: 'We may send you service-related emails, including account verification, password resets, project updates, and important platform announcements.'
        },
        {
          subtitle: 'Platform Improvement',
          text: 'We analyze usage patterns to improve our algorithms, enhance user experience, and develop new features that better serve your needs.'
        },
        {
          subtitle: 'Legal Compliance',
          text: 'We may use your information to comply with legal obligations, resolve disputes, and enforce our agreements.'
        }
      ]
    },
    {
      id: 'data-protection',
      icon: <Lock className="w-5 h-5" />,
      title: 'Data Protection & Security',
      content: [
        {
          subtitle: 'Encryption',
          text: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your passwords are hashed using bcrypt with industry-standard salt rounds.'
        },
        {
          subtitle: 'Access Controls',
          text: 'We implement strict access controls and authentication mechanisms. Only authorized personnel have access to user data, and all access is logged and audited.'
        },
        {
          subtitle: 'Infrastructure Security',
          text: 'Our platform is hosted on secure cloud infrastructure with regular security assessments, automated threat detection, and compliance with industry security standards.'
        },
        {
          subtitle: 'Data Backup',
          text: 'We maintain regular backups of your data to ensure recovery in case of technical issues. Backups are encrypted and stored securely.'
        }
      ]
    },
    {
      id: 'data-sharing',
      icon: <Shield className="w-5 h-5" />,
      title: 'Data Sharing & Third Parties',
      content: [
        {
          subtitle: 'No Sale of Data',
          text: 'We do not sell, rent, or trade your personal information to third parties for marketing purposes. Your data is not a product we monetize.'
        },
        {
          subtitle: 'Service Providers',
          text: 'We may share data with trusted service providers who assist in platform operations (hosting, email delivery, analytics). These providers are bound by confidentiality agreements.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information if required by law, court order, or governmental authority, or to protect our rights and the safety of our users.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, user data may be transferred. We will notify users of any such change in ownership.'
        }
      ]
    },
    {
      id: 'your-rights',
      icon: <Eye className="w-5 h-5" />,
      title: 'Your Rights & Choices',
      content: [
        {
          subtitle: 'Access & Portability',
          text: 'You have the right to access your personal data and request a copy in a portable format. Contact us to exercise this right.'
        },
        {
          subtitle: 'Correction',
          text: 'You can update or correct your account information at any time through your dashboard settings.'
        },
        {
          subtitle: 'Deletion',
          text: 'You may request deletion of your account and associated data. Some data may be retained for legal or legitimate business purposes.'
        },
        {
          subtitle: 'Opt-Out',
          text: 'You can opt out of non-essential communications at any time. Essential service-related communications cannot be opted out of while maintaining an active account.'
        }
      ]
    },
    {
      id: 'cookies',
      icon: <Database className="w-5 h-5" />,
      title: 'Cookies & Tracking',
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use essential cookies required for authentication, security, and basic platform functionality. These cannot be disabled.'
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'We may use analytics cookies to understand how users interact with our platform. You can disable these in your browser settings.'
        },
        {
          subtitle: 'No Third-Party Tracking',
          text: 'We do not use third-party advertising trackers or share your browsing behavior with advertisers.'
        }
      ]
    },
    {
      id: 'data-retention',
      icon: <Clock className="w-5 h-5" />,
      title: 'Data Retention',
      content: [
        {
          subtitle: 'Active Accounts',
          text: 'We retain your data for as long as your account is active and as needed to provide you with our services.'
        },
        {
          subtitle: 'Account Deletion',
          text: 'Upon account deletion, we remove your personal data within 30 days, except where retention is required for legal or legitimate business purposes.'
        },
        {
          subtitle: 'Project Data',
          text: 'Project data and generated reports are retained for your reference. You can delete individual projects at any time.'
        }
      ]
    },
    {
      id: 'contact',
      icon: <Mail className="w-5 h-5" />,
      title: 'Contact Us',
      content: [
        {
          subtitle: 'Privacy Inquiries',
          text: 'For any privacy-related questions, concerns, or requests, please contact our privacy team at privacy@limitplatform.com.'
        },
        {
          subtitle: 'Response Time',
          text: 'We aim to respond to all privacy inquiries within 48 business hours. Complex requests may take longer to fulfill.'
        }
      ]
    }
  ];

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
      <section className="relative py-16 md:py-24 border-b border-[var(--border-subtle)]">
        <div className="container-base text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] mb-6">
            <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-sm font-mono text-[var(--text-secondary)]">Your Privacy Matters</span>
          </div>
          <h1 className="heading-1 mb-4">Privacy Policy</h1>
          <p className="body-large max-w-2xl mx-auto mb-6">
            We are committed to protecting your privacy and ensuring the security of your personal information.
            This policy explains how we collect, use, and safeguard your data.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="relative py-12 border-b border-[var(--border-subtle)]">
        <div className="container-base">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-6">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 p-3 rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-tertiary)] transition-all text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <span className="text-[var(--text-muted)]">{section.icon}</span>
                <span className="truncate">{section.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative py-16">
        <div className="container-base">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent-primary)]">
                    {section.icon}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      Section {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="heading-3">{section.title}</h2>
                  </div>
                </div>
                <div className="pl-0 md:pl-[52px] space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="relative">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
                {index < sections.length - 1 && (
                  <div className="divider mt-16" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
