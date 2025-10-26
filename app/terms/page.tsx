export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-indigo-100">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="p-8 prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                By accessing or using our Language Learning App ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service. These Terms constitute a legally binding agreement between you and us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">2. Description of Service</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Our language learning application provides:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>AI-powered translation services for words and phrases</li>
                <li>Personal vocabulary management and organization</li>
                <li>Learning review features and progress tracking</li>
                <li>Multi-language support for various target languages</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">3. User Accounts</h2>
              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">3.1 Account Creation</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300 mt-6">3.2 Account Termination</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">4. Acceptable Use</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction while using the Service</li>
                <li>Transmit any harmful or malicious code, viruses, or malware</li>
                <li>Attempt to gain unauthorized access to the Service or its related systems</li>
                <li>Use the Service to infringe upon intellectual property rights</li>
                <li>Spam, harass, or abuse other users</li>
                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                <li>Use automated systems to access the Service without authorization</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">5. User Content</h2>
              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">5.1 Ownership</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                You retain ownership of any words, phrases, and other content ("User Content") you submit to the Service. By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your User Content solely for the purpose of providing and improving the Service.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">5.2 Responsibility</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You are solely responsible for your User Content. You represent and warrant that your User Content does not violate any third-party rights, including intellectual property rights and privacy rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">6. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You acknowledge that the Service may use third-party AI services (such as AWS Bedrock, Google Gemini) to provide translation functionality. The output and translations generated by these services are provided "as is" and we do not claim ownership of the AI-generated translations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">7. Service Availability</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We strive to provide continuous, reliable service but do not guarantee that the Service will be available at all times. We may experience downtime for maintenance, updates, or technical issues. We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">8. Disclaimer of Warranties</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ACCURACY OF TRANSLATIONS OR AI-GENERATED CONTENT.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">9. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Some jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, so the above limitations may not apply to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">10. Indemnification</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You agree to defend, indemnify, and hold us harmless from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or relating to your use of the Service, your User Content, or your violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">11. Modifications to Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by updating the "Last Updated" date and posting the modified Terms on this page. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">12. Governing Law and Jurisdiction</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of [YOUR JURISDICTION], without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of [YOUR JURISDICTION].
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">13. Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Email:</strong> legal@languagelearningapp.com
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Support:</strong> support@languagelearningapp.com
                </p>
              </div>
            </section>

            <section className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Special Note for Chinese Users</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Users accessing the Service from mainland China are subject to additional terms and regulations as required by Chinese law. We comply with the Cybersecurity Law of the People's Republic of China and other applicable regulations. Please ensure you have the proper authorization to access services operating outside mainland China.
              </p>
            </section>

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  ← Back to Home
                </a>
                <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Privacy Policy →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

