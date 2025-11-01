export default function Help() {
  const faqs = [
    {
      category: 'Getting Started',
      icon: '🚀',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Register" or use one of our OAuth providers (Google or WeChat) to quickly sign up. You can also register with your email address.',
        },
        {
          q: 'What languages does the app support?',
          a: 'Our app supports learning any target language. You set your target language during registration, and our AI will help you learn vocabulary and phrases in that language.',
        },
        {
          q: 'How do I add words to learn?',
          a: 'Simply type the word or phrase in the input field on your homepage and press Enter or click "Add". The AI will automatically translate and provide definitions.',
        },
      ],
    },
    {
      category: 'Features',
      icon: '✨',
      questions: [
        {
          q: 'How does the translation work?',
          a: 'We use advanced AI models (AWS Bedrock and Google Gemini) to provide accurate, context-aware translations and definitions for your words and phrases.',
        },
        {
          q: 'Can I organize my words into categories?',
          a: 'Currently, words and phrases are displayed in separate tables. We are continuously working on additional organization features.',
        },
        {
          q: 'What is the Review feature?',
          a: 'The Review page helps you practice and memorize your saved words and phrases through active recall exercises.',
        },
      ],
    },
    {
      category: 'Account & Settings',
      icon: '⚙️',
      questions: [
        {
          q: 'How do I change my target language?',
          a: 'You can update your target language preferences in your account settings.',
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes, you can delete your account at any time. Please contact us at privacy@languagelearningapp.com for assistance.',
        },
        {
          q: 'How do I delete words or phrases?',
          a: 'Click the delete (🗑️) button next to any word or phrase in your vocabulary table to remove it.',
        },
      ],
    },
    {
      category: 'Privacy & Security',
      icon: '🔒',
      questions: [
        {
          q: 'How is my data stored and protected?',
          a: 'Your data is encrypted and stored securely in AWS cloud infrastructure. We follow industry-standard security practices to protect your information.',
        },
        {
          q: 'Do you share my data with third parties?',
          a: 'We only share data with AI service providers for translation purposes. We never sell your personal information. See our Privacy Policy for details.',
        },
        {
          q: 'Can I export my vocabulary?',
          a: 'You can export your vocabulary data at any time. Contact support if you need assistance with data export.',
        },
      ],
    },
    {
      category: 'Troubleshooting',
      icon: '🔧',
      questions: [
        {
          q: 'Translation is taking too long or failing. What should I do?',
          a: 'Check your internet connection. If the issue persists, please refresh the page or contact support.',
        },
        {
          q: 'I cannot log in with Google/WeChat OAuth.',
          a: 'Make sure you allow pop-ups for our site and that your browser is up to date. If the problem continues, try using email registration instead.',
        },
        {
          q: 'Where can I report a bug?',
          a: 'Use the Contact page to report bugs or issues. We appreciate your feedback!',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Help & FAQ</h1>
            <p className="text-indigo-100">Common questions and solutions</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Search Box */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="🔍 Search for answers..."
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors text-lg"
              />
            </div>

            {/* FAQ Sections */}
            {faqs.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                  <span className="text-3xl mr-3">{section.icon}</span>
                  {section.category}
                </h2>
                <div className="space-y-4">
                  {section.questions.map((item, qidx) => (
                    <div key={qidx} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                        {item.q}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact CTA */}
            <div className="mt-12 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                <span className="text-2xl mr-3">💬</span>
                Still have questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <a
                href="/footer/contact"
                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Contact Support →
              </a>
            </div>

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">Home</a>
                <span className="text-gray-400">•</span>
                <a href="/footer/about" className="text-indigo-600 dark:text-indigo-400 hover:underline">About</a>
                <span className="text-gray-400">•</span>
                <a href="/footer/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






