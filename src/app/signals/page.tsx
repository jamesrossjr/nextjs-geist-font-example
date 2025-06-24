"use client";

import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import SignalTracker from '@/components/SignalTracker';
import { Card } from '@/components/ui/card';

const SignalsPage = () => {
  // In a real app, these would come from an auth context
  const userRole = "manager";
  const userId = "rep1";

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Signals</h1>
            <p className="text-gray-500 mt-2">
              Monitor AI-detected signals across your pipeline for early risk detection and opportunity identification.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Signals</h3>
            <div className="mt-2 flex items-baseline">
              <div className="text-2xl font-semibold">24</div>
              <div className="ml-2 text-sm text-green-600">+12 new</div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">High Priority</h3>
            <div className="mt-2 flex items-baseline">
              <div className="text-2xl font-semibold">8</div>
              <div className="ml-2 text-sm text-red-600">Needs attention</div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
            <div className="mt-2 flex items-baseline">
              <div className="text-2xl font-semibold">92%</div>
              <div className="ml-2 text-sm text-green-600">Above target</div>
            </div>
          </Card>
        </div>

        <SignalTracker role={userRole} userId={userId} />
      </div>
    </DashboardLayout>
  );
};

export default SignalsPage;
