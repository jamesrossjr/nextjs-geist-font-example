"use client"

import { useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import PipelineBoard from '@/components/Pipeline/PipelineBoard';
import { usePipelineStore } from '@/store/pipelineStore';
import { Card } from '@/components/ui/card';

export default function PipelinePage() {
  const { fetchDeals } = usePipelineStore();

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Pipeline</h1>
        </div>
        
        <Card className="p-6">
          <PipelineBoard />
        </Card>
      </div>
    </DashboardLayout>
  );
}
