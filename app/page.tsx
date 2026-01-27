'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { isAuthenticated } from '@/lib/auth';
import { Building2, FileCheck, Zap, Shield, BarChart3, Clock, Sparkles, TrendingUp, Users } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect to dashboard if already logged in
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  const features = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Automated Compliance',
      description: 'Extract plot data from drawings and calculate GDCR 2017 regulations automatically',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Reports',
      description: 'Generate comprehensive PDF reports with calculations, formulas, and regulatory clauses',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'All Parameters',
      description: 'FSI, height, setbacks, parking, fire safety, and accessibility requirements',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Bulk Analysis',
      description: 'Process multiple sites simultaneously and compare regulatory constraints',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Transparent Calculations',
      description: 'See all formulas and methodology with GDCR clause references',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Save Time',
      description: 'Reduce manual calculation time from hours to minutes',
    },
  ];

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="border-b border-slate-200/60 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-extrabold gradient-text tracking-tight">LIMIT</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button variant="gradient" onClick={() => router.push('/register')}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 overflow-hidden">
        {/* Floating decoration - More subtle and elegant */}
        <div className="absolute top-32 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/15 to-indigo-300/15 rounded-full blur-3xl float-animation" />
        <div className="absolute bottom-32 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-violet-400/10 to-amber-300/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }} />

        <div className="relative text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2.5 glass-card rounded-full px-6 py-3 mb-10 hover-scale">
            <Sparkles className="w-5 h-5 text-cyan-600" />
            <span className="text-sm font-bold text-slate-700 tracking-wide">AI-Powered GDCR 2017 Compliance</span>
          </div>

          <h1 className="heading-xl text-slate-900 mb-8 text-balance">
            Building Regulation
            <span className="block gradient-text mt-3">Made Simple</span>
          </h1>

          <p className="body-lg text-slate-600 mb-12 max-w-3xl mx-auto text-balance">
            Professional SaaS platform for instant GDCR 2017 compliance analysis in Gujarat/Ahmedabad.
            Get comprehensive regulatory reports in minutes, not hours.
          </p>

          <div className="flex items-center justify-center gap-5 flex-wrap mb-16">
            <Button size="lg" variant="gradient" onClick={() => router.push('/register')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="ghost" onClick={() => router.push('/login')}>
              View Demo
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-12 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="text-5xl font-extrabold gradient-text mb-2 group-hover:scale-110 transition-transform">5 min</div>
              <div className="text-sm font-medium text-slate-600 tracking-wide">Average Report Time</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-extrabold gradient-text mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-sm font-medium text-slate-600 tracking-wide">GDCR Compliant</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-extrabold gradient-text mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm font-medium text-slate-600 tracking-wide">Sites Analyzed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-spacing">
        <div className="text-center mb-20">
          <h2 className="heading-md text-slate-900 mb-6">
            Everything You Need for <span className="gradient-text">Compliance</span>
          </h2>
          <p className="body-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive GDCR 2017 analysis with transparent calculations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-10 rounded-2xl hover-lift border border-white/60 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg hover:shadow-xl group-hover:shadow-cyan-500/40 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-spacing relative">
        <div className="text-center mb-20">
          <h2 className="heading-md text-slate-900 mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="body-lg text-slate-600 max-w-2xl mx-auto">Simple 3-step process to compliance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connection lines for desktop - More subtle */}
          <div className="hidden md:block absolute top-28 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" style={{ top: '88px' }} />

          <div className="relative text-center group">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-8 shadow-lg hover:shadow-xl group-hover:shadow-cyan-500/40 group-hover:scale-110 transition-all duration-300">
              1
            </div>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                Upload Site Data
              </h3>
              <p className="text-slate-600 leading-relaxed text-base">
                Upload survey drawings or enter plot details manually with our interactive map
              </p>
            </div>
          </div>

          <div className="relative text-center group">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-8 shadow-lg hover:shadow-xl group-hover:shadow-indigo-500/40 group-hover:scale-110 transition-all duration-300">
              2
            </div>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                Review Calculations
              </h3>
              <p className="text-slate-600 leading-relaxed text-base">
                Verify extracted data and see transparent regulation calculations with 3D preview
              </p>
            </div>
          </div>

          <div className="relative text-center group">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-600 via-violet-500 to-violet-600 rounded-3xl flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-8 shadow-lg hover:shadow-xl group-hover:shadow-violet-500/40 group-hover:scale-110 transition-all duration-300">
              3
            </div>
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                Download Report
              </h3>
              <p className="text-slate-600 leading-relaxed text-base">
                Get comprehensive PDF report with all compliance details and calculations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-spacing">
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-indigo-600 to-violet-600 rounded-3xl p-16 md:p-20 text-center text-white shadow-2xl">
          {/* Decorative elements - More refined */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-amber-500/15 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wide">Limited Time Offer</span>
            </div>

            <h2 className="heading-md text-white mb-6">
              Ready to Streamline Your Compliance?
            </h2>
            <p className="body-lg text-white/95 mb-12 max-w-2xl mx-auto">
              Join 500+ architects and developers already using LIMIT
            </p>

            <div className="flex items-center justify-center gap-5 flex-wrap mb-12">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push('/register')}
                className="bg-white text-cyan-600 hover:bg-slate-50 shadow-xl hover:shadow-2xl"
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => router.push('/login')}
                className="border-2 border-white/80 hover:bg-white/10 text-white"
              >
                Sign In
              </Button>
            </div>

            <div className="flex items-center justify-center gap-10 text-base font-medium">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5" />
                <span>500+ users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 glass mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-extrabold gradient-text">LIMIT</span>
            </div>
            <p className="text-slate-700 mb-2 font-semibold text-lg">
              Building Regulation Compliance Platform
            </p>
            <p className="text-sm text-slate-600 mb-8 font-medium">
              GDCR 2017 Compliance for Gujarat/Ahmedabad
            </p>
            <div className="glass-card rounded-2xl p-6 max-w-3xl mx-auto border border-slate-200/60">
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Disclaimer:</strong> This is an advisory tool only. All calculations and reports should be verified with local authorities and licensed professionals before proceeding with construction. LIMIT does not replace professional architectural or engineering services.
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-8 font-medium">
              © 2026 LIMIT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
