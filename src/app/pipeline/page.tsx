"use client"

import PipelineBoard from '@/components/Pipeline/PipelineBoard'

export default function PipelinePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your deals and track their progress through the pipeline.
        </p>
      </div>
      
      <PipelineBoard />
    </div>
  )
}
