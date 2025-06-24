"use client"

import React, { useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePipelineStore, type Deal } from '@/store/pipelineStore';

const DashboardPage = () => {
  const { deals, fetchDeals, loading } = usePipelineStore();

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Calculate pipeline metrics
  const totalPipeline = deals.reduce((sum: number, deal: Deal) => sum + deal.value, 0);
  const activeDeals = deals.filter((deal: Deal) => !['Won', 'Lost'].includes(deal.stage)).length;
  const wonDeals = deals.filter((deal: Deal) => deal.stage === 'Won').length;
  const totalClosedDeals = deals.filter((deal: Deal) => ['Won', 'Lost'].includes(deal.stage)).length;
  const winRate = totalClosedDeals ? Math.round((wonDeals / totalClosedDeals) * 100) : 0;

  // Sort deals by lastActivity for recent activity
  const recentActivities = [...deals]
    .sort((a: Deal, b: Deal) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Pipeline Dashboard</h1>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">${totalPipeline.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {deals.length} total deals
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{activeDeals}</div>
                  <p className="text-xs text-muted-foreground">
                    In progress deals
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{winRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {wonDeals} won out of {totalClosedDeals} closed
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 border-b pb-4 last:border-0">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((deal) => (
                  <div key={deal.id} className="flex items-center space-x-4 border-b pb-4 last:border-0">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{deal.name}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          deal.urgency === 'Hot' ? 'bg-red-100 text-red-800' :
                          deal.urgency === 'Watch' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {deal.urgency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Stage: {deal.stage} • ${deal.value.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(deal.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
