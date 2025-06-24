"use client"

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { usePipelineStore, type Deal, type DealStage } from '@/store/pipelineStore';
import { Card } from '@/components/ui/card';
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ClientForm from './ClientForm';

const STAGES: DealStage[] = [
  'First Contact',
  'Discovery',
  'Validation',
  'Commitment',
  'Conversion',
  'Won',
  'Lost'
];

interface DealCardProps {
  deal: Deal;
  index: number;
  onEdit: (deal: Deal) => void;
}

const DealCard = ({ deal, index, onEdit }: DealCardProps) => (
  <Draggable draggableId={deal.id} index={index}>
    {(provided: DraggableProvided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`mb-3 transition-transform transform hover:scale-[1.02] ${
          snapshot.isDragging ? 'scale-[1.02] rotate-1' : ''
        }`}
        onClick={() => onEdit(deal)}
      >
        <Card className={`group p-4 transition-all bg-white dark:bg-gray-800 border border-transparent
          ${snapshot.isDragging 
            ? 'shadow-xl border-blue-300 dark:border-blue-700' 
            : 'hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800'
          }`}>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Drag to move • Click to edit
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm">{deal.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                deal.urgency === 'Hot' ? 'bg-red-100 text-red-800' :
                deal.urgency === 'Watch' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {deal.urgency}
              </span>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{deal.company}</span>
              {deal.signals.length > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 cursor-help" title={deal.signals.map(s => `${s.type}: ${s.summary}`).join('\n')}>
                  {deal.signals.length} signals
                </span>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">${deal.value.toLocaleString()}</span>
              <span className="text-gray-500">{new Date(deal.closeDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    deal.momentum >= 80 ? 'bg-green-500' :
                    deal.momentum >= 60 ? 'bg-blue-500' :
                    deal.momentum >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${deal.momentum}%` }}
                />
              </div>
              <span className="text-xs text-gray-500" title="Deal Momentum Score">
                {deal.momentum}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    )}
  </Draggable>
);

const StageColumn = ({
  stage,
  deals,
  onSort,
  onEdit
}: {
  stage: DealStage;
  deals: Deal[];
  onSort: (value: 'momentum' | 'closeDate' | 'value') => void;
  onEdit: (deal: Deal) => void;
}) => (
  <div className="flex-1 min-w-[300px] max-w-[350px] transition-transform hover:translate-y-[-2px]">
    <div className="mb-4 flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-700 dark:text-gray-300">{stage}</h2>
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {deals.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}</span>
          <span>•</span>
          <span>{Math.round(deals.reduce((sum, deal) => sum + deal.momentum, 0) / (deals.length || 1))}% avg</span>
        </div>
      </div>
      <SelectPrimitive onValueChange={onSort} defaultValue="momentum">
        <SelectTrigger className="w-[120px] h-8">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="momentum">Momentum</SelectItem>
          <SelectItem value="closeDate">Close Date</SelectItem>
          <SelectItem value="value">Deal Value</SelectItem>
        </SelectContent>
      </SelectPrimitive>
    </div>
    <Droppable droppableId={stage}>
      {(provided: DroppableProvided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-gray-50 dark:bg-gray-900 p-4 rounded-lg min-h-[500px] transition-colors
            ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        >
          {deals.map((deal, index) => (
            <DealCard 
              key={deal.id} 
              deal={deal} 
              index={index}
              onEdit={onEdit}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

const PipelineFilters = () => {
  const { setFilter } = usePipelineStore();
  
  return (
    <div className="flex gap-4 mb-6">
      <SelectPrimitive onValueChange={(value) => setFilter('rep', value)} defaultValue="all">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Rep" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Reps</SelectItem>
          <SelectItem value="rep1">John Doe</SelectItem>
          <SelectItem value="rep2">Jane Smith</SelectItem>
        </SelectContent>
      </SelectPrimitive>

      <SelectPrimitive onValueChange={(value) => setFilter('urgency', value)} defaultValue="all">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Urgency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Urgency</SelectItem>
          <SelectItem value="hot">Hot</SelectItem>
          <SelectItem value="watch">Watch</SelectItem>
          <SelectItem value="cold">Cold</SelectItem>
          <SelectItem value="stalled">Stalled</SelectItem>
        </SelectContent>
      </SelectPrimitive>

      <SelectPrimitive onValueChange={(value) => setFilter('signalType', value)} defaultValue="all">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Signal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Signals</SelectItem>
          <SelectItem value="engagement">Engagement</SelectItem>
          <SelectItem value="risk">Risk</SelectItem>
          <SelectItem value="momentum_shift">Momentum Shift</SelectItem>
          <SelectItem value="buying_intent">Buying Intent</SelectItem>
          <SelectItem value="inactivity">Inactivity</SelectItem>
        </SelectContent>
      </SelectPrimitive>
    </div>
  );
};

const PipelineTotals = ({ deals }: { deals: Deal[] }) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedForecast = deals.reduce((sum, deal) => sum + (deal.value * (deal.momentum / 100)), 0);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="text-sm text-gray-500">Total Deals</div>
        <div className="text-2xl font-semibold">{deals.length}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-gray-500">Pipeline Value</div>
        <div className="text-2xl font-semibold">${totalValue.toLocaleString()}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-gray-500">Weighted Forecast</div>
        <div className="text-2xl font-semibold">${Math.round(weightedForecast).toLocaleString()}</div>
      </Card>
    </div>
  );
};

const LoadingCard = () => (
  <div className="mb-3 animate-pulse">
    <Card className="p-4 bg-white dark:bg-gray-800">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </Card>
  </div>
);

const LoadingStage = () => (
  <div className="flex-1 min-w-[300px] max-w-[350px]">
    <div className="mb-4 flex justify-between items-center">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-[120px]"></div>
    </div>
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg min-h-[500px]">
      {[1, 2, 3].map((i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  </div>
);

export default function PipelineBoard() {
  const { deals, loading, updateDealStage, setSortBy, fetchDeals } = usePipelineStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Deal | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('PipelineBoard mounted');
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    console.log('Dialog state changed:', { isOpen: isDialogOpen, clientToEdit });
  }, [isDialogOpen, clientToEdit]);
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const dealId = result.draggableId;
    const newStage = result.destination.droppableId as DealStage;
    
    updateDealStage(dealId, newStage);
  };

  const getDealsForStage = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const handleAddClient = async (client: Deal) => {
    setError(null);
    try {
      await usePipelineStore.getState().addDeal(client);
      setIsDialogOpen(false);
      setClientToEdit(undefined);
    } catch (error) {
      setError('Failed to add client. Please try again.');
      console.error('Error adding client:', error);
    }
  };

  const handleEditClient = async (client: Deal) => {
    setError(null);
    try {
      await usePipelineStore.getState().updateDeal(client);
      setIsDialogOpen(false);
      setClientToEdit(undefined);
    } catch (error) {
      setError('Failed to update client. Please try again.');
      console.error('Error updating client:', error);
    }
  };

  const handleOpenEditClient = (deal: Deal) => {
    console.log('Opening edit client form', deal);
    setClientToEdit(deal);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
        <div className="flex gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[200px] h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 px-2 -mx-2">
          {STAGES.map((stage) => (
            <LoadingStage key={stage} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center">
          <PipelineTotals deals={deals} />
          <Button 
            variant="default"
            onClick={() => {
              console.log('Opening add client form - Before state update:', { isDialogOpen, clientToEdit });
              setIsDialogOpen(true);
              console.log('Opening add client form - After setIsDialogOpen');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Client
          </Button>
        </div>
      </div>
      
      <PipelineFilters />

      <ClientForm
        open={isDialogOpen}
        onClose={() => {
          console.log('Closing form - Before state update:', { isDialogOpen, clientToEdit });
          setIsDialogOpen(false);
          setClientToEdit(undefined);
          console.log('Closing form - After state update');
        }}
        onSubmit={clientToEdit ? handleEditClient : handleAddClient}
        initialData={clientToEdit}
      />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
        <div className="flex gap-6 overflow-x-auto pb-6 px-2 -mx-2">
          {STAGES.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              deals={getDealsForStage(stage)}
              onSort={(value: 'momentum' | 'closeDate' | 'value') => setSortBy(stage, value)}
              onEdit={handleOpenEditClient}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
