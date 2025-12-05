import { supabase } from '../supabaseClient';
import { Startup, Deal, Document, Thread, InvestorDirectoryItem, Profile, Role, Message } from '../types';

export const dataService = {
  getDeals: async (): Promise<Deal[]> => {
    if (!supabase) return [];
    
    // Using standard join if relation exists, otherwise detailed error log
    const { data, error } = await supabase.from('dealflow_pipeline').select(`
      *,
      startup:startups(*)
    `);
    
    if (error) {
      console.error('Error fetching deals:', JSON.stringify(error, null, 2));
      return [];
    }
    
    return data as unknown as Deal[];
  },

  getStartups: async (): Promise<Startup[]> => {
    if (!supabase) return [];
    
    const { data, error } = await supabase.from('startups').select('*');
    
    if (error) {
      console.error('Error fetching startups:', JSON.stringify(error, null, 2));
      return [];
    }
    return data;
  },

  getDocuments: async (startupId: string): Promise<Document[]> => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('startup_id', startupId);

    if (error) {
       console.error('Error fetching docs:', JSON.stringify(error, null, 2));
       return [];
    }
    return data;
  },

  toggleShortlist: async (dealId: string, currentState: boolean): Promise<void> => {
     if (!supabase) return;

     await supabase
      .from('dealflow_pipeline')
      .update({ is_shortlisted: !currentState })
      .eq('id', dealId);
  },

  uploadDocument: async (doc: Partial<Document>): Promise<Document> => {
      if (!supabase) throw new Error("No database connection");

      const newDoc = {
          id: Math.random().toString(36).substring(7), 
          startup_id: doc.startup_id || 's_1', 
          name: doc.name || 'Untitled',
          type: doc.type || 'PDF',
          size: doc.size || '1 MB',
          status: 'Ready',
          uploaded_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('documents')
        .insert(newDoc)
        .select()
        .single();
      
      if (error) {
          console.error("Upload error:", JSON.stringify(error, null, 2));
          throw error;
      }
      return data as Document;
  },

  getInvestorDirectory: async (): Promise<InvestorDirectoryItem[]> => {
    if (!supabase) return [];
    
    const { data, error } = await supabase.from('investor_directory').select('*');
    if (error) {
        console.error("Error fetching directory:", JSON.stringify(error, null, 2));
        return [];
    }
    return data;
  },

  // --- Messaging & Profiles ---

  getAllProfiles: async (): Promise<Profile[]> => {
    if (!supabase) return [];

    const profiles: Profile[] = [];

    // 1. Fetch Investors
    const { data: investors } = await supabase.from('investor_directory').select('*');
    if (investors) {
        investors.forEach(inv => {
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

    // 2. Fetch Founders (via Startups)
    const { data: startups } = await supabase.from('startups').select('*');
    if (startups) {
        startups.forEach(s => {
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
  },

  getThreads: async (userId: string): Promise<Thread[]> => {
    if (!supabase) return [];

    // 1. Get thread IDs where user is a participant
    const { data: userThreads, error: utError } = await supabase
        .from('thread_participants')
        .select('thread_id')
        .eq('user_id', userId);

    if (utError) {
        console.error("Error fetching threads for user:", JSON.stringify(utError, null, 2));
        return [];
    }
    if (!userThreads || userThreads.length === 0) return [];

    const threadIds = userThreads.map(ut => ut.thread_id);

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
    
    uniqueThreadIds.forEach(tid => {
        const threadParts = allParticipants?.filter(p => p.thread_id === tid) || [];
        const threadMsgs = messages?.filter(m => m.thread_id === tid) || [];
        const lastMsg = threadMsgs.length > 0 ? threadMsgs[0] : undefined;
        
        const participants: Profile[] = threadParts.map(p => ({
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
  },

  getMessages: async (threadId: string): Promise<Message[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });
        
      if (error) {
          console.error("Error fetching messages:", JSON.stringify(error, null, 2));
          return [];
      }
      return data as Message[];
  }
};