import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Language Learning</h3>
            <p className="text-sm leading-relaxed mb-4">
              Learn languages smarter with AI-powered translation and personalized vocabulary building.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/footer/about" className="hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/footer/help" className="hover:text-indigo-400 transition-colors">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <Link href="/footer/contact" className="hover:text-indigo-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/footer/privacy" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/footer/terms" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/footer/cookies" className="hover:text-indigo-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@languagelearningapp.com" className="hover:text-indigo-400 transition-colors">
                  support@example.com
                </a>
              </li>
              <li>
                <a href="/footer/help" className="hover:text-indigo-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <Link href="/footer/contact" className="hover:text-indigo-400 transition-colors">
                  Report a Bug
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Language Learning App. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="/footer/privacy" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="/footer/terms" className="hover:text-indigo-400 transition-colors">Terms</a>
            <a href="/footer/cookies" className="hover:text-indigo-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}






