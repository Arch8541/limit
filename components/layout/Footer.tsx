'use client';

import Link from 'next/link';
import { Building2, Mail, MapPin, Phone, Linkedin, Twitter } from 'lucide-react';

interface FooterProps {
  variant?: 'default' | 'minimal';
}

export function Footer({ variant = 'default' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <footer className="border-t border-[var(--border-subtle)] py-6">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Building2 className="w-4 h-4" />
              <span>&copy; {currentYear} LIMIT. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative border-t border-[var(--border-subtle)]">
      {/* Main Footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-[var(--bg-primary)]" />
              </div>
              <span className="text-xl font-bold tracking-tight">LIMIT</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 max-w-xs">
              Professional GDCR 2017 compliance analysis platform for architects and developers in Gujarat.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/limitplatform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/limitplatform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/bulk-analysis" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Bulk Analysis
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-mono text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@limitplatform.com"
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                  support@limitplatform.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <MapPin className="w-4 h-4 text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
                  <span>
                    Ahmedabad, Gujarat<br />
                    India 380015
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border-subtle)]">
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-muted)]">
              &copy; {currentYear} LIMIT Platform. All rights reserved.
            </p>
            <p className="text-xs text-[var(--text-muted)] text-center md:text-right max-w-xl">
              <strong className="text-[var(--text-tertiary)]">Disclaimer:</strong> LIMIT is an advisory tool only.
              All calculations should be verified with local authorities and licensed professionals.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
