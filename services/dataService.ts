import { supabase } from '../supabaseClient';
import { MOCK_DEALS, MOCK_STARTUPS, MOCK_DOCS, MOCK_THREADS } from '../constants';
import { Startup, Deal, Document, Thread } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dataService = {
  getDeals: async (): Promise<Deal[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('dealflow_pipeline').select(`
        *,
        startup:startups(*)
      `);
      if (!error && data) return data as unknown as Deal[];
    }
    await delay(600);
    return MOCK_DEALS;
  },

  getStartups: async (): Promise<Startup[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('startups').select('*');
      if (!error && data) return data;
    }
    await delay(500);
    return MOCK_STARTUPS;
  },

  getDocuments: async (startupId: string): Promise<Document[]> => {
    if (supabase) {
        const { data, error } = await supabase.from('documents').select('*').eq('startup_id', startupId);
        if (!error && data) return data;
    }
    await delay(400);
    return MOCK_DOCS; // In real app filter by startupId
  },

  toggleShortlist: async (dealId: string, currentState: boolean): Promise<void> => {
     if (supabase) {
        await supabase.from('dealflow_pipeline').update({ is_shortlisted: !currentState }).eq('id', dealId);
        return;
     }
     console.log(`[Mock] Toggled shortlist for ${dealId} to ${!currentState}`);
  },

  uploadDocument: async (doc: Partial<Document>): Promise<Document> => {
      // Mock upload
      await delay(1000);
      return {
          id: Math.random().toString(36),
          startup_id: doc.startup_id || '',
          name: doc.name || 'Untitled',
          type: doc.type || 'PDF',
          size: doc.size || '1 MB',
          status: 'Ready',
          uploaded_at: new Date().toISOString()
      } as Document;
  },

  getThreads: async (): Promise<Thread[]> => {
      await delay(300);
      return MOCK_THREADS;
  }
};