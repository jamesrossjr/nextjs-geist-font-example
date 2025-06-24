import { create } from 'zustand';

export type DealStage = 'First Contact' | 'Discovery' | 'Validation' | 'Commitment' | 'Conversion' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: DealStage;
  closeDate: string;
  momentum: number;
  repId: string;
  repName: string;
  company: string;
  urgency: 'Hot' | 'Watch' | 'Cold' | 'Stalled';
  signals: {
    type: 'Engagement' | 'Risk' | 'Momentum Shift' | 'Buying Intent' | 'Inactivity';
    summary: string;
  }[];
  lastActivity: string;
}

interface PipelineState {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  filters: {
    rep: string | null;
    urgency: string | null;
    signalType: string | null;
  };
  sortBy: {
    [key in DealStage]: 'momentum' | 'closeDate' | 'value';
  };
  fetchDeals: () => Promise<void>;
  updateDealStage: (dealId: string, newStage: DealStage) => Promise<void>;
  setFilter: (key: 'rep' | 'urgency' | 'signalType', value: string | null) => void;
  setSortBy: (stage: DealStage, sortBy: 'momentum' | 'closeDate' | 'value') => void;
  addDeal: (deal: Deal) => Promise<void>;
  updateDeal: (deal: Deal) => Promise<void>;
}

const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'Enterprise SaaS Deal',
    value: 150000,
    stage: 'Discovery',
    closeDate: '2024-03-15',
    momentum: 85,
    repId: 'rep1',
    repName: 'John Doe',
    company: 'Acme Corp',
    urgency: 'Hot',
    signals: [
      { type: 'Buying Intent', summary: 'Multiple stakeholders engaged' },
      { type: 'Momentum Shift', summary: 'Positive sentiment in last call' }
    ],
    lastActivity: '2024-01-20'
  },
  {
    id: '2',
    name: 'Mid-Market Solution',
    value: 75000,
    stage: 'Validation',
    closeDate: '2024-02-28',
    momentum: 72,
    repId: 'rep2',
    repName: 'Jane Smith',
    company: 'Beta Inc',
    urgency: 'Watch',
    signals: [
      { type: 'Engagement', summary: 'Proposal viewed multiple times' }
    ],
    lastActivity: '2024-01-19'
  }
];

export const usePipelineStore = create<PipelineState>((set, get) => {
  // Subscribe to store changes for debugging
  const subscribeToChanges = (fn: () => void) => {
    const unsubscribe = usePipelineStore.subscribe(fn);
    return unsubscribe;
  };

  return {
    deals: [],
    loading: false,
    error: null,
    lastUpdated: Date.now(),
    filters: {
      rep: null,
      urgency: null,
      signalType: null
    },
    sortBy: {
      'First Contact': 'momentum',
      'Discovery': 'momentum',
      'Validation': 'momentum',
      'Commitment': 'momentum',
      'Conversion': 'momentum',
      'Won': 'momentum',
      'Lost': 'momentum'
    },

    fetchDeals: async () => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ 
          deals: mockDeals, 
          loading: false,
          lastUpdated: Date.now(),
          error: null
        });
        subscribeToChanges(() => console.log('Pipeline data refreshed'));
      } catch (error: any) {
        set({ error: error.message, loading: false });
        console.error('Error fetching deals:', error);
      }
    },

    updateDealStage: async (dealId: string, newStage: DealStage) => {
      const currentDeals = get().deals;
      const dealIndex = currentDeals.findIndex(d => d.id === dealId);
      
      if (dealIndex === -1) {
        console.error('Deal not found:', dealId);
        return;
      }

      const updatedDeals = [...currentDeals];
      updatedDeals[dealIndex] = { 
        ...updatedDeals[dealIndex], 
        stage: newStage,
        lastActivity: new Date().toISOString()
      };
      
      set({ 
        deals: updatedDeals,
        lastUpdated: Date.now(),
        error: null
      });

      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        subscribeToChanges(() => console.log('Deal stage updated:', dealId));
      } catch (error: any) {
        set({ 
          deals: currentDeals, 
          error: error.message,
          lastUpdated: Date.now()
        });
        console.error('Error updating deal stage:', error);
      }
    },

    addDeal: async (deal: Deal) => {
      try {
        set(state => ({
          ...state,
          deals: [...state.deals, deal],
          lastUpdated: Date.now(),
          error: null
        }));

        await new Promise(resolve => setTimeout(resolve, 500));
        subscribeToChanges(() => console.log('New deal added:', deal.id));
      } catch (error: any) {
        set(state => ({
          ...state,
          deals: state.deals.filter(d => d.id !== deal.id),
          error: error.message,
          lastUpdated: Date.now()
        }));
        console.error('Error adding deal:', error);
        throw error;
      }
    },

    updateDeal: async (updatedDeal: Deal) => {
      const currentDeals = get().deals;
      const oldDeal = currentDeals.find(d => d.id === updatedDeal.id);
      
      if (!oldDeal) {
        console.error('Deal not found for update:', updatedDeal.id);
        return;
      }

      try {
        set(state => ({
          ...state,
          deals: state.deals.map(deal => 
            deal.id === updatedDeal.id ? {
              ...updatedDeal,
              lastActivity: new Date().toISOString()
            } : deal
          ),
          lastUpdated: Date.now(),
          error: null
        }));

        await new Promise(resolve => setTimeout(resolve, 500));
        subscribeToChanges(() => console.log('Deal updated:', updatedDeal.id));
      } catch (error: any) {
        set(state => ({
          ...state,
          deals: state.deals.map(deal => 
            deal.id === updatedDeal.id ? oldDeal : deal
          ),
          error: error.message,
          lastUpdated: Date.now()
        }));
        console.error('Error updating deal:', error);
        throw error;
      }
    },

    setFilter: (key: 'rep' | 'urgency' | 'signalType', value: string | null) => {
      set(state => ({
        ...state,
        filters: {
          ...state.filters,
          [key]: value
        }
      }));
    },

    setSortBy: (stage: DealStage, sortBy: 'momentum' | 'closeDate' | 'value') => {
      set(state => ({
        ...state,
        sortBy: {
          ...state.sortBy,
          [stage]: sortBy
        }
      }));
    }
  };
});
