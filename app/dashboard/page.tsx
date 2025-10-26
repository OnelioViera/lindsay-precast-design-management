'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Users, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalCustomers: 0,
    completedThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch when session is loaded
    if (status === 'loading') {
      return;
    }

    if (!session) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const [projectsRes, customersRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/customers'),
        ]);

        const projectsData = await projectsRes.json();
        const customersData = await customersRes.json();

        if (projectsData.success && customersData.success) {
          const projects = projectsData.data.projects;
          const activeProjects = projects.filter((p: any) => p.status !== 'production').length;
          
          setStats({
            totalProjects: projectsData.data.pagination.total,
            activeProjects,
            totalCustomers: customersData.data.pagination.total,
            completedThisMonth: projects.filter((p: any) => p.status === 'production').length,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session, status]);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      bgColor: 'bg-gray-300',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: Clock,
      bgColor: 'bg-gray-400',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      bgColor: 'bg-gray-500',
    },
    {
      title: 'Completed This Month',
      value: stats.completedThisMonth,
      icon: CheckCircle,
      bgColor: 'bg-gray-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700 mt-1">Overview of your design management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className={`p-3 border border-gray-700 ${stat.bgColor}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="/dashboard/projects/new"
              className="p-6 bg-gray-700 text-white hover:bg-gray-800 transition-all duration-300 border border-gray-900"
            >
              <h3 className="text-lg font-semibold mb-2">New Project</h3>
              <p className="text-sm text-gray-300">Create a new design project</p>
            </a>
            <a
              href="/dashboard/projects"
              className="p-6 bg-gray-600 text-white hover:bg-gray-700 transition-all duration-300 border border-gray-800"
            >
              <h3 className="text-lg font-semibold mb-2">Manage Projects</h3>
              <p className="text-sm text-gray-300">View all active projects</p>
            </a>
            <a
              href="/dashboard/customers"
              className="p-6 bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-2">Manage Customers</h3>
              <p className="text-sm text-gray-300">View and edit customer information</p>
            </a>
            <a
              href="/dashboard/library"
              className="p-6 bg-gray-400 text-gray-900 hover:bg-gray-500 transition-all duration-300 border border-gray-600"
            >
              <h3 className="text-lg font-semibold mb-2">Product Library</h3>
              <p className="text-sm text-gray-700">Browse design templates</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


