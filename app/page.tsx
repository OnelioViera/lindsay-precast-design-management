'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, FolderKanban, Clock, BarChart3, Users } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if authenticated and status is confirmed
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-200 shadow-sm border-b border-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lindsay Precast
              </h1>
              <p className="text-sm text-gray-700">Design Management System</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-2 text-gray-900 hover:text-gray-700 font-medium transition border border-gray-400 hover:border-gray-600 hover:bg-gray-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-gray-700 text-white border border-gray-900 hover:bg-gray-800 transition-all duration-200"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Streamline Your Precast Design Management
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Professional design management system built for Lindsay Precast. Manage projects, track time, oversee production, and collaborate seamlessly.
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-gray-700 text-white border border-gray-900 font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-gray-600 text-gray-900 font-semibold hover:bg-gray-300 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Features */}
          <div className="space-y-4">
            <FeatureCard
              icon={FolderKanban}
              title="Project Management"
              description="Create, track, and manage all your precast design projects with ease."
            />
            <FeatureCard
              icon={Clock}
              title="Time Tracking"
              description="Real-time time tracking for accurate project costing and resource management."
            />
            <FeatureCard
              icon={Users}
              title="Team Collaboration"
              description="Role-based access control for designers, engineers, and project managers."
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics & Reports"
              description="Comprehensive reporting and analytics to track project performance."
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 border-t border-gray-400 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h3>
            <p className="text-xl text-gray-700">
              Powerful tools designed for modern precast design management
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-8 bg-gray-200 border border-gray-400">
              <FolderKanban className="w-12 h-12 text-gray-700 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Projects</h4>
              <p className="text-gray-700">Organize and manage multiple design projects with custom fields and templates.</p>
            </div>
            <div className="p-8 bg-gray-200 border border-gray-400">
              <Clock className="w-12 h-12 text-gray-700 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Time Tracking</h4>
              <p className="text-gray-700">Track design hours with start/stop controls and automatic duration calculation.</p>
            </div>
            <div className="p-8 bg-gray-200 border border-gray-400">
              <Users className="w-12 h-12 text-gray-700 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Customers</h4>
              <p className="text-gray-700">Maintain detailed customer information and manage all client interactions.</p>
            </div>
            <div className="p-8 bg-gray-200 border border-gray-400">
              <BarChart3 className="w-12 h-12 text-gray-700 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Library</h4>
              <p className="text-gray-700">Create and manage reusable design templates and product specifications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-800 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-lg mb-8 text-gray-300">
            Join Lindsay Precast's design management system today and streamline your workflow.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-200 border border-gray-400"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="flex gap-4 p-4 bg-white border border-gray-400 hover:border-gray-600 hover:shadow-md transition">
      <Icon className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
    </div>
  );
}


