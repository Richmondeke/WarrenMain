import { supabase } from '../supabaseClient';
import { Startup, Deal, Document, Thread, InvestorDirectoryItem, Profile, Role, Message, DealStage } from '../types';
import { MOCK_STARTUPS, MOCK_DEALS, MOCK_DOCS, MOCK_THREADS, MOCK_INVESTOR_DIRECTORY } from '../constants';

export const dataService = {
  getDeals: async (): Promise<Deal[]> => {
    if (!supabase) return MOCK_DEALS;
    
    try {
      const { data, error } = await supabase.from('dealflow_pipeline').select(`
        *,
        startup:startups(*)
      `);
      
      if (error) throw error;
      return data as unknown as Deal[];
    } catch (error) {
      console.warn('Supabase fetch failed (deals), using mocks:', error instanceof Error ? error.message : JSON.stringify(error));
      return MOCK_DEALS;
    }
  },

  getStartups: async (): Promise<Startup[]> => {
    if (!supabase) return MOCK_STARTUPS;
    
    try {
      const { data, error } = await supabase.from('startups').select('*');
      if (error) throw error;
      return data as unknown as Startup[];
    } catch (error) {
      console.warn('Supabase fetch failed (startups), using mocks:', error instanceof Error ? error.message : JSON.stringify(error));
      return MOCK_STARTUPS;
    }
  },

  getDocuments: async (startupId: string): Promise<Document[]> => {
    if (!supabase) return MOCK_DOCS;

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('startup_id', startupId);

      if (error) throw error;
      return data as unknown as Document[];
    } catch (error) {
       console.warn('Supabase fetch failed (docs), using mocks:', error instanceof Error ? error.message : JSON.stringify(error));
       return MOCK_DOCS;
    }
  },

  toggleShortlist: async (dealId: string, currentState: boolean): Promise<void> => {
     if (!supabase) return;

     try {
       await supabase
        .from('dealflow_pipeline')
        .update({ is_shortlisted: !currentState })
        .eq('id', dealId);
     } catch (error) {
       console.warn('Supabase update failed (simulating success):', error instanceof Error ? error.message : JSON.stringify(error));
     }
  },

  updateDealStage: async (dealId: string, newStage: DealStage): Promise<void> => {
     if (!supabase) return;

     try {
       const { error } = await supabase
        .from('dealflow_pipeline')
        .update({ stage: newStage })
        .eq('id', dealId);

       if (error) throw error;
     } catch (error) {
         console.warn("Error updating deal stage (simulating success):", error instanceof Error ? error.message : JSON.stringify(error));
         // Swallow error to allow optimistic UI update to persist
     }
  },

  uploadDocument: async (doc: Partial<Document>): Promise<Document> => {
      const newDoc: Document = {
          id: crypto.randomUUID(), 
          startup_id: doc.startup_id || MOCK_STARTUPS[0].id, 
          name: doc.name || 'Untitled',
          type: (doc.type as any) || 'PDF',
          size: doc.size || '1 MB',
          status: 'Ready',
          uploaded_at: new Date().toISOString()
      };

      if (!supabase) return newDoc;

      try {
        const { data, error } = await supabase
          .from('documents')
          .insert(newDoc)
          .select()
          .single();
        
        if (error) throw error;
        return data as Document;
      } catch (error) {
          console.warn("Upload error (simulating success):", error instanceof Error ? error.message : JSON.stringify(error));
          return newDoc;
      }
  },

  getInvestorDirectory: async (): Promise<InvestorDirectoryItem[]> => {
    if (!supabase) return MOCK_INVESTOR_DIRECTORY;
    
    try {
      const { data, error } = await supabase.from('investor_directory').select('*');
      if (error) throw error;
      return data as unknown as InvestorDirectoryItem[];
    } catch (error) {
        console.warn("Error fetching directory (using mocks):", error instanceof Error ? error.message : JSON.stringify(error));
        return MOCK_INVESTOR_DIRECTORY;
    }
  },

  // --- Messaging & Profiles ---

  getAllProfiles: async (): Promise<Profile[]> => {
    if (!supabase) return [];

    try {
      const profiles: Profile[] = [];
      const { data: investors } = await supabase.from('investor_directory').select('*');
      if (investors) {
          (investors as any[]).forEach(inv => {
              profiles.push({
                  id: inv.id, 
                  role: Role.INVESTOR,
                  name: inv.name,
                  firm_name: inv.name,
                  title: 'Investor',
                  avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(inv.name)}&background=0D8ABC&color=fff`
              });
          });
      }

      const { data: startups } = await supabase.from('startups').select('*');
      if (startups) {
          (startups as any[]).forEach(s => {
              profiles.push({
                  id: s.founder_id || s.id,
                  role: Role.FOUNDER,
                  name: `${s.name} Founder`,
                  firm_name: s.name,
                  title: 'Founder',
                  avatar_url: s.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`
              });
          });
      }
      return profiles;
    } catch (error) {
      console.warn('Error fetching profiles', error instanceof Error ? error.message : JSON.stringify(error));
      return [];
    }
  },

  getThreads: async (userId: string): Promise<Thread[]> => {
    if (!supabase) return MOCK_THREADS;

    try {
      // 1. Get thread IDs where user is a participant
      const { data: userThreads, error: utError } = await supabase
          .from('thread_participants')
          .select('thread_id')
          .eq('user_id', userId);

      if (utError) throw utError;
      if (!userThreads || userThreads.length === 0) return [];

      const threadIds = (userThreads as any[]).map(ut => ut.thread_id as string);

      // 2. Get Thread Details, Messages, and All Participants for those threads
      const { data: allParticipants } = await supabase
          .from('thread_participants')
          .select('*')
          .in('thread_id', threadIds);

      // Fetch last message for these threads
      const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .in('thread_id', threadIds)
          .order('created_at', { ascending: false });

      const threads: Thread[] = [];
      const uniqueThreadIds = Array.from(new Set(threadIds));
      
      const safeParticipants = (allParticipants as any[]) || [];
      const safeMessages = (messages as any[]) || [];

      uniqueThreadIds.forEach(tid => {
          const threadParts = safeParticipants.filter((p: any) => p.thread_id === tid);
          const threadMsgs = safeMessages.filter((m: any) => m.thread_id === tid);
          const lastMsg = threadMsgs.length > 0 ? threadMsgs[0] : undefined;
          
          const participants: Profile[] = threadParts.map((p: any) => ({
              id: p.user_id as string,
              name: (p.user_name as string) || 'Unknown',
              avatar_url: p.user_avatar as string,
              role: Role.INVESTOR 
          }));

          threads.push({
              id: tid,
              participants: participants,
              last_message: lastMsg as Message,
              unread_count: 0
          });
      });

      return threads;
    } catch (error) {
        console.warn("Error fetching threads for user (using mocks):", error instanceof Error ? error.message : JSON.stringify(error));
        return MOCK_THREADS;
    }
  },

  getMessages: async (threadId: string): Promise<Message[]> => {
      const mockMessages: Message[] = MOCK_THREADS
        .filter(t => t.id === threadId && t.last_message)
        .map(t => t.last_message!);

      if (!supabase) return mockMessages;

      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('thread_id', threadId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        return data as unknown as Message[];
      } catch (error) {
          console.warn("Error fetching messages (using mocks):", error instanceof Error ? error.message : JSON.stringify(error));
          return mockMessages;
      }
  }
};