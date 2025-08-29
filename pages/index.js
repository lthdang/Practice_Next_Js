import Link from "next/link";
import Date from "../components/date";
import Layout, { siteTitle } from "../components/layout";
export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20 px-6 rounded-2xl mb-12 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to Our Learning Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Discover amazing content, learn new skills, and join our community
            of learners
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
            >
              Get Started - Login
            </Link>
            <Link
              href="#blog"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              Explore Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">50+ Courses</h3>
          <p className="text-gray-600">High-quality learning content</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            1000+ Students
          </h3>
          <p className="text-gray-600">Active learning community</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            4.9/5 Rating
          </h3>
          <p className="text-gray-600">Excellent student satisfaction</p>
        </div>
      </section>

      {/* Blog Section */}
      <section
        id="blog"
        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
      >
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-gray-600 text-lg">
            Stay updated with our latest insights and tutorials
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-6 rounded-2xl mt-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Learning?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of students who are already transforming their careers
          with our courses
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-all duration-300 hover:transform hover:scale-105 shadow-lg"
          >
            Login Now
          </Link>
          <Link
            href="/signup"
            className="border-2 border-gray-400 text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-white hover:text-white transition-all duration-300"
          >
            Create Account
          </Link>
        </div>
      </section>
    </Layout>
  );
}
