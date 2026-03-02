'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, FeatureCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Footer } from '@/components/layout/Footer';
import { HeroBuilding } from '@/components/3d/HeroBuilding';
import {
  Building2,
  FileCheck,
  Zap,
  Shield,
  BarChart3,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MapPin,
  Ruler,
  Calculator,
  FileText,
  Users,
  Star,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push('/dashboard');
    });
  }, [router]);

  if (!mounted) {
    return null;
  }

  const features = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Automated Compliance',
      description:
        'Extract plot data from drawings and calculate GDCR 2017 regulations automatically with AI precision.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Reports',
      description:
        'Generate comprehensive PDF reports with calculations, formulas, and regulatory clause references.',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Complete Analysis',
      description:
        'FSI, building height, setbacks, parking requirements, fire safety, and accessibility - all covered.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Bulk Processing',
      description:
        'Analyze multiple sites simultaneously and compare regulatory constraints across projects.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Transparent Logic',
      description:
        'See all formulas and methodology with direct GDCR clause references for every calculation.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Time Efficient',
      description:
        'Reduce manual calculation time from hours to minutes. Focus on design, not paperwork.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Input Site Data',
      description: 'Upload drawings or manually enter plot dimensions using our interactive map interface.',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      number: '02',
      title: 'Configure Parameters',
      description: 'Select authority, zone, intended use, and special conditions for accurate calculations.',
      icon: <Ruler className="w-5 h-5" />,
    },
    {
      number: '03',
      title: 'Review Calculations',
      description: 'Verify FSI, setbacks, height limits, and all regulatory parameters with 3D preview.',
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      number: '04',
      title: 'Export Report',
      description: 'Download professional PDF documentation with all calculations and clause references.',
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const testimonials = [
    {
      quote: "LIMIT has transformed how we handle GDCR compliance. What used to take hours now takes minutes.",
      author: 'Priya Sharma',
      role: 'Principal Architect, Sharma & Associates',
      avatar: 'PS',
    },
    {
      quote: 'The transparent calculation methodology gives us confidence when presenting to clients and authorities.',
      author: 'Rajesh Patel',
      role: 'Senior Developer, Urban Spaces Ltd.',
      avatar: 'RP',
    },
    {
      quote: 'Bulk analysis feature is a game-changer for site comparison and feasibility studies.',
      author: 'Ankit Mehta',
      role: 'Investment Analyst, Gujarat Realty',
      avatar: 'AM',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />

      {/* Navigation */}
      <header className="relative z-50 border-b border-[var(--border-subtle)]">
        <nav className="container-wide py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <Building2 className="w-5 h-5 text-[var(--bg-primary)]" />
              </div>
              <span className="text-xl font-bold tracking-tight">LIMIT</span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Testimonials
              </a>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/register')}>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative section-spacing overflow-hidden">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Text content */}
            <div className="stagger-children text-center lg:text-left">
              {/* Badge */}
              <Badge variant="accent" size="md" className="mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                GDCR 2017 Compliance Platform
              </Badge>

              {/* Headline */}
              <h1 className="heading-display text-[var(--text-primary)] mb-6">
                Building Regulation{' '}
                <span className="text-gradient font-normal">Made Simple</span>
              </h1>

              {/* Subheadline */}
              <p className="body-large max-w-xl mb-10 text-balance mx-auto lg:mx-0">
                Professional SaaS platform for instant GDCR 2017 compliance analysis in Gujarat.
                Get comprehensive regulatory reports in minutes, not hours.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12">
                <Button variant="primary" size="lg" onClick={() => router.push('/register')}>
                  Start Free Analysis
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => router.push('/login')}>
                  View Demo Project
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-gradient mb-1">5 min</div>
                  <div className="text-xs text-[var(--text-tertiary)] font-mono uppercase tracking-wider">
                    Avg. Report
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-gradient mb-1">100%</div>
                  <div className="text-xs text-[var(--text-tertiary)] font-mono uppercase tracking-wider">
                    GDCR Compliant
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-gradient mb-1">500+</div>
                  <div className="text-xs text-[var(--text-tertiary)] font-mono uppercase tracking-wider">
                    Sites Analyzed
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3D Building Animation */}
            <div className="hidden lg:flex items-center justify-center relative">
              <HeroBuilding />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-[var(--accent-glow)] rounded-full blur-[100px] -translate-y-1/2 opacity-40" />
        <div className="absolute top-1/4 right-[10%] w-80 h-80 bg-[var(--blueprint-subtle)] rounded-full blur-[100px] opacity-30" />
      </section>

      {/* Features Section */}
      <section id="features" className="relative section-spacing border-t border-[var(--border-subtle)]">
        <div className="container-wide">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="blueprint" className="mb-4">Features</Badge>
            <h2 className="heading-2 mb-4">
              Everything You Need for{' '}
              <span className="text-gradient">Compliance</span>
            </h2>
            <p className="body-large max-w-2xl mx-auto">
              Comprehensive GDCR 2017 analysis with transparent calculations and professional reporting.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative section-spacing border-t border-[var(--border-subtle)]">
        <div className="container-wide">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="accent" className="mb-4">Process</Badge>
            <h2 className="heading-2 mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="body-large max-w-2xl mx-auto">
              Simple four-step process from site data to professional compliance report.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[var(--border-strong)] to-transparent" />
                )}
                <Card variant="default" padding="lg" className="relative">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] flex items-center justify-center font-mono text-xs font-bold">
                    {step.number}
                  </div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--bg-hover)] flex items-center justify-center mb-4 text-[var(--text-secondary)]">
                    {step.icon}
                  </div>
                  {/* Content */}
                  <h3 className="heading-4 mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative section-spacing border-t border-[var(--border-subtle)]">
        <div className="container-wide">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4">
              <Star className="w-3.5 h-3.5" />
              Testimonials
            </Badge>
            <h2 className="heading-2 mb-4">
              Trusted by <span className="text-gradient">Professionals</span>
            </h2>
            <p className="body-large max-w-2xl mx-auto">
              See what architects and developers are saying about LIMIT.
            </p>
          </div>

          {/* Testimonials grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="elevated" padding="lg" className="flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--accent-primary)] text-[var(--accent-primary)]" />
                  ))}
                </div>
                {/* Quote */}
                <blockquote className="text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">
                  "{testimonial.quote}"
                </blockquote>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[var(--bg-primary)] font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{testimonial.author}</div>
                    <div className="text-xs text-[var(--text-muted)]">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-spacing border-t border-[var(--border-subtle)]">
        <div className="container-base">
          <Card
            variant="gradient-border"
            padding="none"
            className="relative overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-[var(--blueprint)]/10" />

            <div className="relative p-12 md:p-16 text-center">
              <Badge variant="accent" className="mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Get Started Today
              </Badge>

              <h2 className="heading-2 mb-4">
                Ready to Streamline Your{' '}
                <span className="text-gradient">Compliance Workflow?</span>
              </h2>

              <p className="body-large max-w-xl mx-auto mb-8">
                Join architects and developers already using LIMIT for faster, more accurate GDCR compliance analysis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button variant="primary" size="lg" onClick={() => router.push('/register')}>
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-tertiary)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                  5 free analyses
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
