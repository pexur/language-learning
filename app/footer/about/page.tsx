export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">About Language Learning App</h1>
            <p className="text-xl text-indigo-100">Learn languages smarter with AI-powered translation</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <span className="mr-3 text-3xl">🎯</span>
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We believe that learning a new language should be intuitive, efficient, and personalized. Our mission is to empower language learners worldwide by providing an AI-powered platform that makes vocabulary building and phrase learning seamless and enjoyable. Whether you're learning English, Chinese, Spanish, or any other language, we're here to support your journey.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <span className="mr-3 text-3xl">✨</span>
                What Makes Us Different
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-indigo-800 dark:text-indigo-300">🤖 AI-Powered Translation</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Advanced AI technology provides accurate, context-aware translations for words and phrases using cutting-edge language models.
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-300">📚 Personalized Learning</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Build your own vocabulary library tailored to your learning goals and review progress at your own pace.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-300">🌍 Multi-Language Support</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Learn any language with comprehensive support for multiple target languages and learning styles.
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-300">🔒 Privacy First</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your data is your own. We prioritize your privacy and security with encrypted storage and transparent data practices.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <span className="mr-3 text-3xl">🎓</span>
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Add Words & Phrases</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Simply type or paste words and phrases you want to learn. Our system immediately processes them.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">AI Translation & Definitions</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our AI instantly provides accurate translations and detailed definitions to help you understand context and meaning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Review & Practice</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Use our built-in review system to practice vocabulary and track your learning progress over time.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <span className="mr-3 text-3xl">🚀</span>
                Technology Stack
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We leverage cutting-edge technologies to deliver a smooth learning experience:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <ul className="grid md:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300">
                  <li>✨ Next.js for modern web interface</li>
                  <li>🤖 AWS Bedrock for AI translations</li>
                  <li>🎯 Google Gemini AI integration</li>
                  <li>🔐 Secure OAuth authentication</li>
                  <li>📊 DynamoDB for data storage</li>
                  <li>🎨 Tailwind CSS for beautiful UI</li>
                </ul>
              </div>
            </section>

            <section className="mb-8 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-xl">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <span className="mr-3 text-3xl">❤️</span>
                For Everyone, Everywhere
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Whether you're a student learning a new language for school, a professional expanding your business communication skills, or someone exploring new cultures, our app is designed to help learners from around the world. We support multiple languages and are committed to making language learning accessible to Chinese users, international learners, and everyone in between.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <span className="mr-3 text-3xl">📢</span>
                Stay Connected
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We're always working to improve your learning experience. Have feedback or suggestions? We'd love to hear from you!
              </p>
              <div className="flex gap-4">
                <a
                  href="/footer/contact"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Get in Touch
                </a>
                <a
                  href="/footer/help"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Help & Support
                </a>
              </div>
            </section>

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 justify-center text-sm">
                <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">Home</a>
                <span className="text-gray-400">•</span>
                <a href="/footer/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact</a>
                <span className="text-gray-400">•</span>
                <a href="/footer/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy</a>
                <span className="text-gray-400">•</span>
                <a href="/footer/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






