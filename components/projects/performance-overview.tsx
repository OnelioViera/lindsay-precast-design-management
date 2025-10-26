'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types';
import { formatDate } from '@/lib/utils';
import { TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function PerformanceOverview({ project }: { project: Project }) {
  // Calculate project duration
  const startDate = new Date(project.createdAt!);
  const endDate = project.completedAt ? new Date(project.completedAt) : new Date();
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate days to production
  const productionDate = project.productionHandoff.handoffDate 
    ? new Date(project.productionHandoff.handoffDate)
    : null;
  const daysToProduction = productionDate 
    ? Math.floor((productionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Time tracking metrics
  const totalHours = project.timeTracking.totalHours || 0;
  const displayHours = Math.floor(totalHours);
  const displayMinutes = Math.round((totalHours - displayHours) * 60);

  // Calculate checklist completion percentage
  const checklistItems = Object.values(project.productionHandoff.checklist);
  const completedItems = checklistItems.filter(item => item).length;
  const checklistPercentage = Math.round((completedItems / checklistItems.length) * 100);

  // Status progression
  const statusOrder = ['requested', 'inprogress', 'review', 'approved', 'production'];
  const currentStatusIndex = statusOrder.indexOf(project.status);

  return (
    <div className="space-y-6">
      {/* Performance Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Project Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Duration */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 font-semibold">Total Duration</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{totalDays}</p>
              <p className="text-xs text-gray-500 mt-1">days</p>
            </div>

            {/* Days to Production */}
            {daysToProduction !== null ? (
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 font-semibold">Time to Production</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{daysToProduction}</p>
                <p className="text-xs text-gray-500 mt-1">days</p>
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600 font-semibold">Pending Production</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">—</p>
                <p className="text-xs text-gray-500 mt-1">not sent yet</p>
              </div>
            )}

            {/* Total Hours Logged */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 font-semibold">Hours Logged</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{displayHours}h {displayMinutes}m</p>
              <p className="text-xs text-gray-500 mt-1">Total time</p>
            </div>

            {/* Revisions Count */}
            <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600 font-semibold">Revisions</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{project.revisions?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">iterations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Visual timeline */}
            <div className="flex items-stretch gap-0 h-24 mb-4">
              {statusOrder.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={status} className="flex-1 flex items-center gap-0">
                    {/* Status box */}
                    <div className={`flex-1 h-full flex flex-col items-center justify-center rounded-lg text-xs font-semibold transition-all relative overflow-hidden ${
                      isCurrent
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg'
                        : isCompleted
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className="capitalize text-center px-2">
                        {status === 'inprogress' ? 'In Prog.' : status.length > 7 ? status.substring(0, 7) + '.' : status}
                      </span>
                      {isCurrent && (
                        <div className="absolute top-1 right-1">
                          <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Status Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 capitalize">
                    Current Status: {project.status === 'inprogress' ? 'In Progress' : project.status}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Created:</span> {formatDate(project.createdAt!)}
                  </p>
                  {project.completedAt && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Completed:</span> {formatDate(project.completedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-indigo-600" />
            Quality & Handoff Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Revisions */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
              <div>
                <span className="text-sm font-semibold text-gray-700">Design Revisions</span>
                <p className="text-xs text-gray-500 mt-1">Total iterations requested</p>
              </div>
              <span className="text-2xl font-bold text-orange-600">{project.revisions?.length || 0}</span>
            </div>

            {/* RFIs */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div>
                <span className="text-sm font-semibold text-gray-700">RFIs (Requests for Info)</span>
                <p className="text-xs text-gray-500 mt-1">Questions requiring clarification</p>
              </div>
              <span className="text-2xl font-bold text-indigo-600">{project.productionHandoff.rfis?.length || 0}</span>
            </div>

            {/* Handoff Checklist Progress */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Production Handoff Checklist</p>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  checklistPercentage === 100
                    ? 'bg-green-100 text-green-700'
                    : checklistPercentage >= 60
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {checklistPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    checklistPercentage === 100
                      ? 'bg-green-500'
                      : checklistPercentage >= 60
                      ? 'bg-indigo-500'
                      : 'bg-orange-500'
                  }`}
                  style={{ width: `${checklistPercentage}%` }}
                />
              </div>

              {/* Checklist Items */}
              <div className="space-y-2">
                {Object.entries(project.productionHandoff.checklist).map(([key, completed]) => (
                  <div key={key} className="flex items-center justify-between text-sm p-2 rounded hover:bg-gray-50">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`font-semibold flex items-center gap-1 ${completed ? 'text-green-600' : 'text-gray-400'}`}>
                      {completed ? (
                        <>
                          <span>✓</span>
                          <span className="text-xs">Complete</span>
                        </>
                      ) : (
                        <>
                          <span>◯</span>
                          <span className="text-xs">Pending</span>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Handoff Status */}
            {project.productionHandoff.sentToProduction && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Sent to Production</p>
                  {project.productionHandoff.handoffDate && (
                    <p className="text-sm text-green-700 mt-1">
                      {formatDate(project.productionHandoff.handoffDate)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
