'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    
    setStatus('success');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setStatus('idle');
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-indigo-100">We'd love to hear from you!</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">📧</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Email Support</h3>
                      <p className="text-indigo-600 dark:text-indigo-400">support@languagelearningapp.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">🛡️</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Privacy & Security</h3>
                      <p className="text-indigo-600 dark:text-indigo-400">privacy@languagelearningapp.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">⚖️</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Legal Inquiries</h3>
                      <p className="text-indigo-600 dark:text-indigo-400">legal@languagelearningapp.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">🌐</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Business Inquiries</h3>
                      <p className="text-indigo-600 dark:text-indigo-400">business@languagelearningapp.com</p>
                    </div>
                  </div>
                </div>

                {/* Response Time Notice */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>⚡ Response Time:</strong> We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>

              {/* FAQ Links */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Quick Links</h2>
                <div className="space-y-3">
                  <a
                    href="/footer/help"
                    className="block p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">❓</span>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Help & FAQ</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Common questions and solutions</p>
                      </div>
                    </div>
                  </a>
                  <a
                    href="/footer/about"
                    className="block p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">ℹ️</span>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">About Us</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Learn about our mission</p>
                      </div>
                    </div>
                  </a>
                  <a
                    href="/footer/privacy"
                    className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🔒</span>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Privacy Policy</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">How we protect your data</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="What is your message about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {status === 'sending' ? (
                    <span className="flex items-center justify-center">
                      <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                      Sending...
                    </span>
                  ) : status === 'success' ? (
                    '✓ Message Sent!'
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">Home</a>
                <span className="text-gray-400">•</span>
                <a href="/footer/about" className="text-indigo-600 dark:text-indigo-400 hover:underline">About</a>
                <span className="text-gray-400">•</span>
                <a href="/footer/help" className="text-indigo-600 dark:text-indigo-400 hover:underline">Help</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






