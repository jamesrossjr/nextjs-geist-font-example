"use client";

import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import MomentumScorecard from '@/components/MomentumScorecard';

const MomentumPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <MomentumScorecard role="manager" />
      </div>
    </DashboardLayout>
  );
};

export default MomentumPage;
