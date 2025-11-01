export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
            <p className="text-indigo-100">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="p-8 prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">1. What Are Cookies?</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies allow websites to recognize your device and remember your preferences and actions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">2. How We Use Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Authenticate you and maintain your login session</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use the Service to improve performance</li>
                <li>Provide security features to protect your account</li>
                <li>Measure the effectiveness of our features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">3.1 Strictly Necessary Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                These cookies are essential for the Service to function properly. They include:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>Session authentication cookies</li>
                <li>Security tokens for login</li>
                <li>CSRF protection tokens</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">3.2 Functionality Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                These cookies allow the Service to remember choices you make:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>Language preferences</li>
                <li>Dark mode settings</li>
                <li>User interface preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">3.3 Analytics Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                These cookies help us understand how visitors interact with the Service:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Page views and navigation patterns</li>
                <li>Feature usage statistics</li>
                <li>Error tracking and debugging information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">4. Third-Party Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We may use third-party services that set cookies on your device:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">OAuth Providers</h4>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                  <li>Google OAuth (for Google sign-in)</li>
                  <li>WeChat OAuth (for WeChat sign-in)</li>
                </ul>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  These providers may set cookies to manage authentication sessions. Please review their privacy policies.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Analytics Services</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  We may use analytics services to understand usage patterns and improve our Service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">5. Managing Cookies</h2>
              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">5.1 Browser Settings</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>See what cookies you have and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block all cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">5.2 Impact of Disabling Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Please note that blocking or deleting cookies may impact your experience with the Service. You may not be able to log in or use certain features if essential cookies are disabled.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">6. Do Not Track</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals are interpreted. We may continue to collect and use information as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">7. Updates to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please review this Cookie Policy periodically to stay informed about our use of cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">8. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> privacy@languagelearningapp.com
                </p>
              </div>
            </section>

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/footer/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  ← Privacy Policy
                </a>
                <a href="/footer/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
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






