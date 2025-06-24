import { create } from 'zustand';

export interface Signal {
  id: string;
  name: string;
  summary: string;
  type: 'Engagement' | 'Risk' | 'Momentum Shift' | 'Buying Intent' | 'Inactivity';
  urgency: 'Hot' | 'Watch' | 'Cold' | 'Stalled';
  confidenceScore: number;
  timeDecay: string;
  nextBestAction: string;
  dealStage?: string;
  createdAt: number;
  repId?: string;
  repName?: string;
}

interface SignalState {
  signals: Signal[];
  loading: boolean;
  error: string | null;
  fetchSignals: (role: string, userId?: string) => Promise<void>;
}

const mockGeminiSignals = (role: string, userId?: string): Signal[] => {
  const now = Date.now();
  return [
    {
      id: '1',
      name: 'Acme Corp',
      summary: "Client asked about pricing in last call",
      type: 'Buying Intent' as const,
      urgency: 'Hot' as const,
      confidenceScore: 92,
      timeDecay: '4h ago',
      nextBestAction: 'Send Follow-up',
      dealStage: 'Negotiation',
      createdAt: now - 2 * 60 * 60 * 1000,
      repId: 'rep1',
      repName: 'John Doe'
    },
    {
      id: '2',
      name: 'Beta Inc',
      summary: "Proposal link opened three times",
      type: 'Engagement' as const,
      urgency: 'Watch' as const,
      confidenceScore: 85,
      timeDecay: '1h ago',
      nextBestAction: 'Start Call',
      dealStage: 'Proposal',
      createdAt: now - 50 * 60 * 60 * 1000,
      repId: 'rep2',
      repName: 'Jane Smith'
    },
    {
      id: '3',
      name: 'Tech Solutions Ltd',
      summary: "No response to last 3 emails",
      type: 'Risk' as const,
      urgency: 'Cold' as const,
      confidenceScore: 78,
      timeDecay: '2d ago',
      nextBestAction: 'Escalate',
      dealStage: 'Qualification',
      createdAt: now - 30 * 60 * 60 * 1000,
      repId: 'rep1',
      repName: 'John Doe'
    },
    {
      id: '4',
      name: 'Global Industries',
      summary: "Positive sentiment in call transcript",
      type: 'Momentum Shift' as const,
      urgency: 'Hot' as const,
      confidenceScore: 95,
      timeDecay: '30m ago',
      nextBestAction: 'Schedule Demo',
      dealStage: 'Proposal',
      createdAt: now - 0.5 * 60 * 60 * 1000,
      repId: 'rep3',
      repName: 'Mike Johnson'
    }
  ].filter(signal => role === 'manager' || signal.repId === userId);
};

export const useSignalStore = create<SignalState>((set) => ({
  signals: [],
  loading: false,
  error: null,
  fetchSignals: async (role: string, userId?: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = mockGeminiSignals(role, userId);
      set({ signals: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch signals', loading: false });
    }
  }
}));
