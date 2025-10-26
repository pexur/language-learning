export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-indigo-100">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="p-8 prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">1. Introduction</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Welcome to our Language Learning App ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our language learning application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">2.1 Personal Information</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Name and email address (for account creation)</li>
                <li>Authentication credentials (through OAuth providers like Google or WeChat)</li>
                <li>Target language preferences</li>
                <li>User-generated content (words and phrases you add for learning)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">2.2 Usage Data</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Device information (type, operating system)</li>
                <li>IP address and location data</li>
                <li>Application usage patterns and features accessed</li>
                <li>Performance metrics and error logs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">3. How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>To provide and maintain our language learning services</li>
                <li>To process translations and generate learning content</li>
                <li>To personalize your learning experience</li>
                <li>To send important updates and notifications about the service</li>
                <li>To ensure the security and prevent fraud</li>
                <li>To analyze usage patterns and improve our services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">4. Data Storage and Security</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Your data is stored securely in our cloud infrastructure. We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure data backups</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We do not sell your personal information. We may share your data only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>With third-party AI services (e.g., AWS Bedrock, Google Gemini) for translation and content generation</li>
                <li>To comply with legal requirements or respond to lawful requests</li>
                <li>To protect our rights, property, or safety, or that of our users</li>
                <li>In connection with a business transfer or merger (with prior notice)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">6. Your Rights and Choices</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent for data processing</li>
                <li>Object to or restrict certain data processing activities</li>
                <li>Data portability (receive your data in a structured format)</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided in the Contact section.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">7. International Data Transfers</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Your information may be transferred to and processed in countries outside your country of residence, including the United States and other regions where our service providers operate. These countries may have different data protection laws. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">8. Children's Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our service is not intended for children under the age of 13 (or the applicable age of majority in your jurisdiction). We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are encouraged to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">10. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Email:</strong> privacy@languagelearningapp.com
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Data Protection Officer:</strong> dpo@languagelearningapp.com
                </p>
              </div>
            </section>

            {/* Note for Chinese users */}
            <section className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border-l-4 border-yellow-500">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Special Notice for Users in China</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                If you are accessing our service from China, please note that this Privacy Policy is governed by applicable Chinese laws and regulations, including but not limited to the Personal Information Protection Law. We comply with all applicable data protection requirements in China.
              </p>
            </section>

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  ← Back to Home
                </a>
                <a href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Terms of Service →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

