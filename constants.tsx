import { Role, StartupStage, DealStage, Startup, Deal, Profile, Document, Thread, InvestorDirectoryItem } from './types';
import { 
  PieChart, TrendingUp, FolderOpen, 
  MessageSquare, LayoutGrid, List, Search
} from 'lucide-react';

// Navigation Config
export const NAV_ITEMS = {
  [Role.INVESTOR]: [
    { label: 'Dealflow', path: '/investor/dealflow', icon: <LayoutGrid size={20} /> },
    { label: 'Tracker', path: '/investor/tracker', icon: <TrendingUp size={20} /> },
    { label: 'Directory', path: '/investor/directory', icon: <List size={20} /> },
    { label: 'Portfolio', path: '/investor/portfolio', icon: <PieChart size={20} /> },
  ],
  [Role.FOUNDER]: [
    { label: 'Find Investors', path: '/founder/investors', icon: <Search size={20} /> },
    { label: 'Deal Room', path: '/founder/dealroom', icon: <FolderOpen size={20} /> },
  ],
  COMMON: [
    { label: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
  ]
};

// Valid UUIDs for Mock Data
const IDS = {
  INVESTOR: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  FOUNDER_1: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  FOUNDER_2: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23',
  FOUNDER_3: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24',
  FOUNDER_4: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a25',
  STARTUP_1: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
  STARTUP_2: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
  STARTUP_3: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
  STARTUP_4: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
  DEAL_1: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a81',
  DEAL_2: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a82',
  DEAL_3: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a83',
  DEAL_4: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a84',
  THREAD_1: '11eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
  THREAD_2: '11eebc99-9c0b-4ef8-bb6d-6bb9bd380b12',
  MSG_1: '22eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
  MSG_2: '22eebc99-9c0b-4ef8-bb6d-6bb9bd380c02',
};

// Mock Data
export const MOCK_INVESTOR: Profile = {
  id: IDS.INVESTOR,
  role: Role.INVESTOR,
  name: 'Warren Buffett (AI)',
  email: 'ekerichmond@gmail.com',
  firm_name: 'Berkshire Next',
  title: 'Managing Partner',
  avatar_url: 'https://picsum.photos/200/200?random=1'
};

export const MOCK_FOUNDER: Profile = {
  id: IDS.FOUNDER_1,
  role: Role.FOUNDER,
  name: 'Elon Musk (AI)',
  email: 'ekerichmond@gmail.com',
  firm_name: 'Mars Express',
  title: 'CEO',
  avatar_url: 'https://picsum.photos/200/200?random=2'
};

export const MOCK_STARTUPS: Startup[] = [
  {
    id: IDS.STARTUP_1,
    founder_id: IDS.FOUNDER_1,
    name: 'Nebula AI',
    description: 'Generative AI for autonomous supply chain optimization.',
    sector: 'Artificial Intelligence',
    stage: StartupStage.SERIES_A,
    ask: 5000000,
    valuation: 25000000,
    location: 'San Francisco, CA',
    match_score: 98,
    stats: { mrr: 120000, growth: 15 },
    logo_url: 'https://picsum.photos/100/100?random=10'
  },
  {
    id: IDS.STARTUP_2,
    founder_id: IDS.FOUNDER_2,
    name: 'GreenSynthetics',
    description: 'Carbon-negative synthetic biology manufacturing platform.',
    sector: 'Biotech',
    stage: StartupStage.SEED,
    ask: 2000000,
    valuation: 12000000,
    location: 'Boston, MA',
    match_score: 85,
    stats: { mrr: 25000, growth: 8 },
    logo_url: 'https://picsum.photos/100/100?random=11'
  },
  {
    id: IDS.STARTUP_3,
    founder_id: IDS.FOUNDER_3,
    name: 'QuantumLeap',
    description: 'Quantum computing hardware for financial modeling.',
    sector: 'Deep Tech',
    stage: StartupStage.SERIES_B,
    ask: 15000000,
    valuation: 80000000,
    location: 'Toronto, ON',
    match_score: 92,
    stats: { mrr: 450000, growth: 5 },
    logo_url: 'https://picsum.photos/100/100?random=12'
  },
  {
    id: IDS.STARTUP_4,
    founder_id: IDS.FOUNDER_4,
    name: 'UrbanFarms',
    description: 'Vertical farming solutions for dense urban centers.',
    sector: 'AgriTech',
    stage: StartupStage.SEED,
    ask: 1500000,
    valuation: 8000000,
    location: 'New York, NY',
    match_score: 74,
    stats: { mrr: 15000, growth: 12 },
    logo_url: 'https://picsum.photos/100/100?random=13'
  },
];

export const MOCK_DEALS: Deal[] = [
  {
    id: IDS.DEAL_1,
    investor_id: IDS.INVESTOR,
    startup_id: IDS.STARTUP_1,
    startup: MOCK_STARTUPS[0],
    stage: DealStage.REVIEWING,
    is_shortlisted: true,
    updated_at: new Date().toISOString()
  },
  {
    id: IDS.DEAL_2,
    investor_id: IDS.INVESTOR,
    startup_id: IDS.STARTUP_2,
    startup: MOCK_STARTUPS[1],
    stage: DealStage.SOURCED,
    is_shortlisted: false,
    updated_at: new Date().toISOString()
  },
  {
    id: IDS.DEAL_3,
    investor_id: IDS.INVESTOR,
    startup_id: IDS.STARTUP_3,
    startup: MOCK_STARTUPS[2],
    stage: DealStage.DUE_DILIGENCE,
    is_shortlisted: true,
    updated_at: new Date().toISOString()
  },
   {
    id: IDS.DEAL_4,
    investor_id: IDS.INVESTOR,
    startup_id: IDS.STARTUP_4,
    startup: MOCK_STARTUPS[3],
    stage: DealStage.SOURCED,
    is_shortlisted: false,
    updated_at: new Date().toISOString()
  }
];

export const MOCK_DOCS: Document[] = [
  { id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a91', startup_id: IDS.STARTUP_1, name: 'Pitch Deck Q3', type: 'Deck', size: '12 MB', uploaded_at: '2023-10-15', status: 'Ready' },
  { id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a92', startup_id: IDS.STARTUP_1, name: 'Financial Model', type: 'Excel', size: '4.5 MB', uploaded_at: '2023-10-16', status: 'Ready' },
  { id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a93', startup_id: IDS.STARTUP_1, name: 'Incorporation Docs', type: 'Legal', size: '2 MB', uploaded_at: '2023-10-10', status: 'Processing' },
];

export const MOCK_THREADS: Thread[] = [
  {
    id: IDS.THREAD_1,
    participants: [MOCK_INVESTOR, { ...MOCK_FOUNDER, name: 'Sarah Connor' }],
    unread_count: 2,
    last_message: {
      id: IDS.MSG_1, thread_id: IDS.THREAD_1, sender_id: IDS.FOUNDER_1, content: 'Here is the updated deck you asked for.', created_at: new Date().toISOString()
    }
  },
  {
    id: IDS.THREAD_2,
    participants: [MOCK_INVESTOR, { ...MOCK_FOUNDER, id: IDS.FOUNDER_2, name: 'Tony Stark' }],
    unread_count: 0,
    last_message: {
      id: IDS.MSG_2, thread_id: IDS.THREAD_2, sender_id: IDS.INVESTOR, content: 'Lets schedule a call next Tuesday.', created_at: new Date(Date.now() - 86400000).toISOString()
    }
  }
];

export const MOCK_INVESTOR_DIRECTORY: InvestorDirectoryItem[] = [
  {
    id: 'inv_dir_1', // These aren't used in DB relation checks, so they can remain simple strings if needed, but UUIDs are safer.
    name: '[sīc] Ventures',
    website: 'https://www.sicstudio.org/ventures/ventures',
    hq: 'San Francisco, CA',
    stages: ['Idea', 'Prototype', 'Early Revenue', 'Growth'],
    thesis: 'We invest in emerging markets startups.',
    type: 'VC',
    cheque_range: '$10k - $200k',
    match_score: 95
  },
  // ... (Keeping rest of directory items as they are for brevity, assuming they are just display data or use text IDs in DB if created that way. But based on error context, only relational keys were failing)
  {
    id: 'inv_dir_2',
    name: '1 4 All Group',
    website: 'https://1-4-all.group/',
    hq: 'Dubai, UAE',
    stages: ['Early Revenue', 'Scaling', 'Growth'],
    thesis: 'Financial, Consumer, Healthcare, Energy/Mining/Industrials, IT/Media, and Infrastructure sectors. Value investors seeking realistic valuations.',
    type: 'Angel network',
    cheque_range: '$50k - $14M',
    match_score: 88
  },
  {
    id: 'inv_dir_3',
    name: '01 Ventures',
    website: 'https://www.01ventures.com/',
    hq: 'Amsterdam, NL',
    stages: ['Prototype', 'Early Revenue'],
    thesis: 'We invest in deep tech innovations including software and hardware solutions to the world\'s biggest challenges.',
    type: 'VC',
    cheque_range: '$250k - $2M',
    match_score: 91
  }
];