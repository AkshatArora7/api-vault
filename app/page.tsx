'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  HiShieldCheck, 
  HiChartBar, 
  HiLockClosed,
  HiGlobe,
  HiUsers,
  HiArrowRight,
  HiSparkles,
  HiCheck,
  HiEye,
  HiKey,
  HiCloud,
  HiDocumentText,
  HiStar,
  HiArrowDown
} from 'react-icons/hi';
import { HiBolt } from 'react-icons/hi2';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // All hooks must be at the top level
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const yReverse = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']); // Fixed: moved here
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading' || !mounted) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="loading loading-spinner loading-lg text-primary"
        />
      </div>
    );
  }

  const features = [
    {
      icon: HiShieldCheck,
      title: 'Enterprise Security',
      description: 'Military-grade AES-256 encryption protects your keys with zero-knowledge architecture and end-to-end security.',
      stats: '256-bit encryption',
      color: 'text-success'
    },
    {
      icon: HiBolt,
      title: 'Lightning Performance',
      description: 'Instant key access with smart caching, CDN distribution, and optimized performance for global teams.',
      stats: '<100ms response',
      color: 'text-warning'
    },
    {
      icon: HiChartBar,
      title: 'Advanced Analytics',
      description: 'Comprehensive usage tracking, security insights, audit logs, and real-time monitoring dashboards.',
      stats: '24/7 monitoring',
      color: 'text-info'
    }
  ];

  const stats = [
    { value: '99.99%', label: 'Uptime SLA', icon: HiGlobe, color: 'text-success' },
    { value: '150K+', label: 'Developers', icon: HiUsers, color: 'text-primary' },
    { value: '5M+', label: 'Keys Secured', icon: HiLockClosed, color: 'text-secondary' }
  ];

  const benefits = [
    'Zero-knowledge encryption with client-side key generation',
    'Automated key rotation with configurable expiration policies',
    'Team collaboration with role-based access control',
    'SOC 2 Type II compliant with annual security audits',
    'Multi-environment isolation (dev, staging, production)',
    'Real-time security alerts and anomaly detection',
    'API usage analytics with detailed reporting',
    'One-click key sharing with temporary access links'
  ];

  const testimonials = [
    {
      quote: "API Vault transformed how we manage credentials. The security features are enterprise-grade.",
      author: "Sarah Chen",
      role: "CTO at TechFlow",
      rating: 5
    },
    {
      quote: "Finally, a key management solution that doesn't compromise on usability or security.",
      author: "Marcus Rodriguez", 
      role: "Lead Developer at DataSync",
      rating: 5
    },
    {
      quote: "The analytics dashboard gives us insights we never had before. Game changer.",
      author: "Emily Watson",
      role: "DevOps Engineer at CloudNine",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-base-100 via-base-200 to-base-300 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20"
              >
                <HiSparkles className="w-4 h-4 mr-2" />
                Trusted by 150,000+ developers globally
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl lg:text-7xl font-bold text-base-content leading-tight mb-8"
              >
                Secure API Key
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                  Management
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-base-content/80 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Enterprise-grade security meets intuitive design. Protect, organize, and manage your API credentials with zero-knowledge encryption and advanced analytics.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link 
                    href="/auth/signup" 
                    className="btn btn-primary btn-lg shadow-2xl group-hover:shadow-primary/25 transition-all duration-300"
                  >
                    <HiShieldCheck className="w-5 h-5" />
                    Start Free Trial
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/auth/signin" 
                    className="btn btn-outline btn-lg transition-all duration-300"
                  >
                    <HiKey className="w-5 h-5" />
                    Sign In
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-base-content/60"
              >
                <div className="flex items-center">
                  <HiCheck className="w-4 h-4 text-success mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <HiCheck className="w-4 h-4 text-success mr-2" />
                  14-day free trial
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="relative perspective-1000"
            >
              <div className="relative bg-base-100 rounded-3xl shadow-2xl border border-base-300 p-8 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl"></div>
                
                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg"
                      >
                        <HiShieldCheck className="w-5 h-5 text-primary-content" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-base-content">API Vault</h3>
                        <p className="text-sm text-base-content/60">Production Environment</p>
                      </div>
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 bg-success rounded-full"
                    />
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    {['24 Keys', '99.9% Uptime', '5 Services'].map((stat, index) => (
                      <motion.div
                        key={stat}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="text-center p-3 bg-base-200 rounded-xl"
                      >
                        <div className="font-bold text-base-content">{stat.split(' ')[0]}</div>
                        <div className="text-xs text-base-content/60">{stat.split(' ')[1]}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* API Keys Preview */}
                  {[
                    { service: 'OpenAI GPT-4', env: 'production', status: 'active' },
                    { service: 'Stripe Payments', env: 'production', status: 'active' },
                    { service: 'AWS S3 Storage', env: 'staging', status: 'inactive' }
                  ].map((service, index) => (
                    <motion.div
                      key={service.service}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.15, duration: 0.6 }}
                      className="flex items-center justify-between p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          service.status === 'active' ? 'bg-success/20' : 'bg-base-300'
                        }`}>
                          <HiKey className={`w-4 h-4 ${service.status === 'active' ? 'text-success' : 'text-base-content/40'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-base-content text-sm">{service.service}</p>
                          <div className="flex items-center space-x-2">
                            <span className={`badge badge-xs ${service.env === 'production' ? 'badge-error' : 'badge-warning'}`}>
                              {service.env}
                            </span>
                            <span className={`text-xs ${service.status === 'active' ? 'text-success' : 'text-base-content/40'}`}>
                              {service.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                      >
                        <HiEye className="w-4 h-4 text-base-content/60" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <HiLockClosed className="w-6 h-6 text-accent-content" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated Background Elements - Fixed: using pre-defined transforms */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ y }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
          />
          <motion.div
            style={{ y: yReverse }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/20 to-info/20 rounded-full blur-3xl"
          />
          
          {/* Floating icons */}
          {[HiShieldCheck, HiKey, HiLockClosed, HiCloud].map((Icon, index) => (
            <motion.div
              key={index}
              animate={{ 
                y: [-20, 20, -20],
                rotate: [0, 10, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 4 + index * 0.5,
                repeat: Infinity,
                delay: index * 0.5
              }}
              className={`absolute w-16 h-16 bg-base-content/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-base-content/10`}
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 20}%`
              }}
            >
              <Icon className="w-8 h-8 text-base-content/30" />
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <HiArrowDown className="w-6 h-6 text-base-content/60" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-base-content mb-6">
              Built for Modern Development Teams
            </h2>
            <p className="text-xl text-base-content/70 max-w-4xl mx-auto leading-relaxed">
              Everything you need to secure, organize, and manage your API credentials with enterprise-grade features and developer-first experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-base-100 rounded-3xl p-8 h-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10 border border-base-300 group-hover:border-primary/20">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-base-content mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-base-content/70 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <div className="flex items-center">
                      <span className={`badge badge-lg ${feature.color} bg-opacity-10`}>
                        {feature.stats}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-base-content mb-4">
              Trusted by Industry Leaders
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-6 shadow-lg shadow-primary/25 group-hover:shadow-2xl group-hover:shadow-primary/40 transition-all duration-300">
                    <Icon className="w-10 h-10 text-primary-content" />
                  </div>
                  <div className="text-5xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-base-content/60 font-semibold text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-base-content mb-4">
              What Developers Say
            </h2>
            <p className="text-xl text-base-content/70">
              Join thousands of satisfied developers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-base-200 p-8 rounded-2xl"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <HiStar key={i} className="w-5 h-5 text-warning" />
                  ))}
                </div>
                <p className="text-base-content/80 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-base-content">{testimonial.author}</div>
                  <div className="text-base-content/60 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-base-content mb-8">
                Why Choose API Vault?
              </h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.6 }}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-xl flex items-center justify-center group-hover:bg-success/20 transition-colors">
                      <HiCheck className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-base-content/80 group-hover:text-base-content transition-colors">
                      {benefit}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="space-y-6">
                  {[
                    { label: 'Security Score', value: '99.8%', color: 'text-success' },
                    { label: 'Response Time', value: '<50ms', color: 'text-warning' },
                    { label: 'Keys Protected', value: '5.2M+', color: 'text-primary' },
                    { label: 'Global Coverage', value: '99 Regions', color: 'text-info' }
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      className="flex items-center justify-between p-6 bg-base-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow group cursor-pointer"
                    >
                      <span className="font-semibold text-base-content group-hover:text-primary transition-colors">
                        {metric.label}
                      </span>
                      <span className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-base-content/10 backdrop-blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Secure Your APIs?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join over 150,000 developers who trust API Vault with their most sensitive credentials. Start your free trial today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/signup"
                  className="btn btn-lg bg-white text-primary hover:bg-base-100 border-none shadow-2xl min-w-48"
                >
                  <HiShieldCheck className="w-5 h-5" />
                  Start Free Trial
                  <HiArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <div className="flex items-center space-x-4 text-white/80">
                <HiCheck className="w-5 h-5" />
                <span>14-day free trial</span>
                <HiCheck className="w-5 h-5" />
                <span>No credit card</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"
        />
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <HiShieldCheck className="w-6 h-6 text-primary-content" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-base-content">API Vault</h3>
                  <p className="text-base-content/60">Secure key management</p>
                </div>
              </div>
              <p className="text-base-content/70 mb-6 max-w-md">
                The most trusted platform for API key management, serving developers and enterprises worldwide with enterprise-grade security.
              </p>
              <div className="flex space-x-4">
                {['SOC 2', 'GDPR', 'ISO 27001'].map((cert) => (
                  <div key={cert} className="badge badge-outline">{cert}</div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-base-content mb-4">Product</h4>
              <div className="space-y-2">
                {['Features', 'Security', 'Pricing', 'API Documentation'].map((item) => (
                  <div key={item} className="text-base-content/60 hover:text-base-content cursor-pointer transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-base-content mb-4">Company</h4>
              <div className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <div key={item} className="text-base-content/60 hover:text-base-content cursor-pointer transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-base-content/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-base-content/60 text-sm mb-4 md:mb-0">
              © 2025 API Vault. Built with security and privacy in mind.
            </div>
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <div key={item} className="text-base-content/60 hover:text-base-content text-sm cursor-pointer transition-colors">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
