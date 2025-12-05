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

// Mock Data
export const MOCK_INVESTOR: Profile = {
  id: 'inv_1',
  role: Role.INVESTOR,
  name: 'Warren Buffett (AI)',
  email: 'ekerichmond@gmail.com',
  firm_name: 'Berkshire Next',
  title: 'Managing Partner',
  avatar_url: 'https://picsum.photos/200/200?random=1'
};

export const MOCK_FOUNDER: Profile = {
  id: 'fnd_1',
  role: Role.FOUNDER,
  name: 'Elon Musk (AI)',
  email: 'ekerichmond@gmail.com',
  firm_name: 'Mars Express',
  title: 'CEO',
  avatar_url: 'https://picsum.photos/200/200?random=2'
};

export const MOCK_STARTUPS: Startup[] = [
  {
    id: 's_1',
    founder_id: 'fnd_1',
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
    id: 's_2',
    founder_id: 'fnd_2',
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
    id: 's_3',
    founder_id: 'fnd_3',
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
    id: 's_4',
    founder_id: 'fnd_4',
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
    id: 'd_1',
    investor_id: 'inv_1',
    startup_id: 's_1',
    startup: MOCK_STARTUPS[0],
    stage: DealStage.REVIEWING,
    is_shortlisted: true,
    updated_at: new Date().toISOString()
  },
  {
    id: 'd_2',
    investor_id: 'inv_1',
    startup_id: 's_2',
    startup: MOCK_STARTUPS[1],
    stage: DealStage.SOURCED,
    is_shortlisted: false,
    updated_at: new Date().toISOString()
  },
  {
    id: 'd_3',
    investor_id: 'inv_1',
    startup_id: 's_3',
    startup: MOCK_STARTUPS[2],
    stage: DealStage.DUE_DILIGENCE,
    is_shortlisted: true,
    updated_at: new Date().toISOString()
  },
   {
    id: 'd_4',
    investor_id: 'inv_1',
    startup_id: 's_4',
    startup: MOCK_STARTUPS[3],
    stage: DealStage.SOURCED,
    is_shortlisted: false,
    updated_at: new Date().toISOString()
  }
];

export const MOCK_DOCS: Document[] = [
  { id: 'doc_1', startup_id: 's_1', name: 'Pitch Deck Q3', type: 'Deck', size: '12 MB', uploaded_at: '2023-10-15', status: 'Ready' },
  { id: 'doc_2', startup_id: 's_1', name: 'Financial Model', type: 'Excel', size: '4.5 MB', uploaded_at: '2023-10-16', status: 'Ready' },
  { id: 'doc_3', startup_id: 's_1', name: 'Incorporation Docs', type: 'Legal', size: '2 MB', uploaded_at: '2023-10-10', status: 'Processing' },
];

export const MOCK_THREADS: Thread[] = [
  {
    id: 't_1',
    participants: [MOCK_INVESTOR, { ...MOCK_FOUNDER, name: 'Sarah Connor' }],
    unread_count: 2,
    last_message: {
      id: 'm_1', thread_id: 't_1', sender_id: 'fnd_1', content: 'Here is the updated deck you asked for.', created_at: new Date().toISOString()
    }
  },
  {
    id: 't_2',
    participants: [MOCK_INVESTOR, { ...MOCK_FOUNDER, name: 'Tony Stark' }],
    unread_count: 0,
    last_message: {
      id: 'm_2', thread_id: 't_2', sender_id: 'inv_1', content: 'Lets schedule a call next Tuesday.', created_at: new Date(Date.now() - 86400000).toISOString()
    }
  }
];

export const MOCK_INVESTOR_DIRECTORY: InvestorDirectoryItem[] = [
  {
    id: 'inv_dir_1',
    name: '[sīc] Ventures',
    website: 'https://www.sicstudio.org/ventures/ventures',
    hq: 'San Francisco, CA',
    stages: ['Idea', 'Prototype', 'Early Revenue', 'Growth'],
    thesis: 'We invest in emerging markets startups.',
    type: 'VC',
    cheque_range: '$10k - $200k',
    match_score: 95
  },
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
  },
  {
    id: 'inv_dir_4',
    name: '1Sharpe Ventures',
    website: 'https://www.1sharpe.ventures/',
    hq: 'Oakland, CA',
    stages: ['Prototype', 'Early Revenue', 'Idea/Patent'],
    thesis: 'We invest in Fintech, Real Estate Tech, Proptech, Architecture, Engineering, Construction, Supply Chain, Logistics, Climate.',
    type: 'VC',
    cheque_range: '$500k - $2M',
    match_score: 87
  },
  {
    id: 'inv_dir_5',
    name: '1st Course Capital',
    website: 'https://www.1cc.vc/',
    hq: 'Redwood City, CA',
    stages: ['Prototype', 'Early Revenue', 'Scaling'],
    thesis: 'We invest in business model and technology innovations across the food supply chain.',
    type: 'VC',
    cheque_range: '$25k - $200k',
    match_score: 82
  },
  {
    id: 'inv_dir_6',
    name: '2|Twelve',
    website: 'https://212angels.com',
    hq: 'Tiburon, CA',
    stages: ['Prototype', 'Early Revenue'],
    thesis: 'We invest in B2B, Enterprise, SaaS, B2B Fintech at seed stage.',
    type: 'VC',
    cheque_range: '$100k - $300k',
    match_score: 89
  },
  {
    id: 'inv_dir_7',
    name: '3CC Third Culture Capital',
    website: 'https://3cc.io',
    hq: 'Boston, MA',
    stages: ['Early Revenue', 'Scaling', 'Prototype', 'Idea/Patent'],
    thesis: 'We invest in diverse founders who innovate at the intersection of culture and healthcare delivery.',
    type: 'VC',
    cheque_range: '$250k - $2M',
    match_score: 94
  },
  {
    id: 'inv_dir_8',
    name: '3cubed VC',
    website: 'https://3cubed.vc',
    hq: 'San Francisco, CA',
    stages: ['Idea/Patent', 'Prototype', 'Early Revenue', 'Growth'],
    thesis: 'We invest in AI, Fintech, Blockchain Tech, Enterprise Software, Consumer Internet, Health Tech.',
    type: 'VC',
    cheque_range: '$50k - $1M',
    match_score: 85
  },
  {
    id: 'inv_dir_9',
    name: '3one4 Capital',
    website: 'https://www.3one4capital.com',
    hq: 'Bengaluru, India',
    stages: ['Prototype', 'Early Revenue', 'Scaling'],
    thesis: 'We invest in SaaS, Enterprise & SMB Automation, Fintech, Consumer Internet, and Digital Health.',
    type: 'VC',
    cheque_range: '$100k - $5M',
    match_score: 90
  },
  {
    id: 'inv_dir_10',
    name: '3VC',
    website: 'https://www.three.vc/',
    hq: 'Vienna, Austria',
    stages: ['Early Revenue', 'Scaling'],
    thesis: 'We invest in AI, dev tools, deep tech, security, AR/VR, data analytics, digital health.',
    type: 'VC',
    cheque_range: '$1M - $5M',
    match_score: 86
  },
  {
    id: 'inv_dir_11',
    name: '4F Ventures',
    website: 'https://4fventures.com/',
    hq: 'Orange County, CA',
    stages: ['Prototype', 'Early Revenue', 'Scaling'],
    thesis: 'We invest in traditionally overlooked founders building seed-stage eCommerce and FinTech companies.',
    type: 'VC',
    cheque_range: '$50k - $250k',
    match_score: 93
  },
  {
    id: 'inv_dir_12',
    name: '4impact',
    website: 'https://www.4impact.vc/',
    hq: 'The Hague, Netherlands',
    stages: ['Prototype', 'Early Revenue'],
    thesis: 'We invest in European software startups that achieve tangible positive impact in environment, health, or inclusion.',
    type: 'VC',
    cheque_range: '$500k - $3M',
    match_score: 88
  },
  {
    id: 'inv_dir_13',
    name: '7percent Ventures',
    website: 'http://www.7percent.vc',
    hq: 'London, UK',
    stages: ['Idea/Patent', 'Prototype', 'Early Revenue'],
    thesis: 'We invest in frontier (i.e. deeptech) and transformative technologies.',
    type: 'VC',
    cheque_range: '$100k - $2M',
    match_score: 91
  },
  {
    id: 'inv_dir_14',
    name: '9Unicorns',
    website: 'https://www.9unicorns.in/',
    hq: 'Mumbai, India',
    stages: ['Early Revenue', 'Scaling', 'Prototype', 'Idea/Patent'],
    thesis: 'We invest in early stage startups across all sectors. The fund will operate uniquely as an accelerator.',
    type: 'VC',
    cheque_range: '$100k - $2M',
    match_score: 84
  },
  {
    id: 'inv_dir_15',
    name: '10D',
    website: 'https://www.10d.vc/',
    hq: 'Tel Aviv, Israel',
    stages: ['Idea/Patent', 'Prototype', 'Early Revenue'],
    thesis: 'We invest in Israeli exceptional entrepreneurs, from early-stage to Seed and Series A rounds.',
    type: 'VC',
    cheque_range: '$500k - $5M',
    match_score: 89
  },
  {
    id: 'inv_dir_16',
    name: '10K Ventures',
    website: 'https://www.10kventures.co/',
    hq: 'Berlin, Germany',
    stages: ['Idea/Patent', 'Prototype', 'Early Revenue'],
    thesis: 'We invest in early stage startups and funds globally.',
    type: 'Family office',
    cheque_range: '$100k - $200k',
    match_score: 79
  },
  {
    id: 'inv_dir_17',
    name: '10x Founders',
    website: 'https://www.10xfounders.com/',
    hq: 'Munich, Germany',
    stages: ['Idea/Patent', 'Prototype', 'Early Revenue'],
    thesis: 'We invest in the most ambitious tech founders in pre/seed across Europe and the US.',
    type: 'VC',
    cheque_range: '$100k - $3M',
    match_score: 92
  },
  {
    id: 'inv_dir_18',
    name: '10X Venture Partners',
    website: 'https://10xvp.com',
    hq: 'Manchester, NH',
    stages: ['Prototype', 'Early Revenue', 'Scaling'],
    thesis: 'We invest in SaaS, AI, Artificial Intelligence, CV, Computer Vision SportsTech, CyberSecurity.',
    type: 'Angel network',
    cheque_range: '$20k - $200k',
    match_score: 81
  },
  {
    id: 'inv_dir_19',
    name: '11 Tribes Ventures',
    website: 'https://11tribes.vc/',
    hq: 'Chicago, IL',
    stages: ['Prototype', 'Early Revenue', 'Scaling'],
    thesis: 'We invest in purpose driven entrepreneurs that are creating category defining technologies.',
    type: 'VC',
    cheque_range: '$100k - $300k',
    match_score: 87
  },
  {
    id: 'inv_dir_20',
    name: '13o3',
    website: 'https://13o3.com',
    hq: 'London, UK',
    stages: ['Pre-IPO', 'Growth', 'Scaling', 'Early Revenue'],
    thesis: 'We invest in IoT, Blockchain, Real Estate, Media, B2B Saas, Clean Energy, Supply Chain and Logistics, Insure-tech, Fintech, and Web3.',
    type: 'PE fund',
    cheque_range: '$200k - $1M',
    match_score: 75
  },
  {
    id: 'inv_dir_21',
    name: '14Peaks Capital',
    website: 'https://www.14peaks.capital/',
    hq: 'Zug, Switzerland',
    stages: ['Prototype', 'Early Revenue', 'Scaling'],
    thesis: 'We invest in B2B SaaS, Fintech, Future of Work. Stage: Pre-Seed, Seed and Series A.',
    type: 'VC',
    cheque_range: '$300k - $1M',
    match_score: 90
  },
  {
    id: 'inv_dir_22',
    name: '20 Ventures',
    website: 'http://20v.it/',
    hq: 'Rome, Italy',
    stages: ['Idea/Patent', 'Prototype', 'Early Revenue'],
    thesis: 'We invest in disruptive ideas and talented people. We are a Venture Builder focused on pre-seed stage.',
    type: 'Startup studio',
    cheque_range: '$60k - $120k',
    match_score: 83
  },
  {
    id: 'inv_dir_23',
    name: '27V (Twenty Seven Ventures)',
    website: 'https://twentyseven.ventures/',
    hq: 'Cayman Islands',
    stages: ['Prototype', 'Idea/Patent', 'Early Revenue'],
    thesis: 'We invest in global EdTech and Future of Work startups at the Pre-Seed/Seed stages.',
    type: 'VC',
    cheque_range: '$25k - $250k',
    match_score: 86
  },
  {
    id: 'inv_dir_24',
    name: '30N Ventures',
    website: 'https://30n.vc',
    hq: 'Santiago, Chile',
    stages: ['Early Revenue', 'Scaling', 'Growth'],
    thesis: 'We invest in Fintech, Foodtech, and Retail transforming the landscape.',
    type: 'VC',
    cheque_range: '$300k - $5M',
    match_score: 88
  },
  {
    id: 'inv_dir_25',
    name: '35 North Ventures',
    website: 'https://www.35northventures.com/',
    hq: 'Mumbai, India',
    stages: ['Growth', 'Pre-IPO'],
    thesis: 'We invest in early growth-stage companies, Pre-Series A and above.',
    type: 'VC',
    cheque_range: '$1M - $5M',
    match_score: 78
  },
  {
    id: 'inv_dir_26',
    name: '42CAP',
    website: 'https://www.42cap.com/',
    hq: 'Munich, Germany',
    stages: ['Early Revenue', 'Prototype'],
    thesis: 'We invest in seed-stage tech- and data-driven B2B software companies across Europe.',
    type: 'VC',
    cheque_range: '$500k - $2M',
    match_score: 93
  },
  {
    id: 'inv_dir_27',
    name: '43North',
    website: 'https://www.43north.org/',
    hq: 'Buffalo, NY',
    stages: ['Early Revenue', 'Scaling'],
    thesis: 'We invest in startups that have a full-time founding team, are generating revenue, and have raised outside capital.',
    type: 'Incubator, Accelerator',
    cheque_range: '$1M',
    match_score: 85
  },
  {
    id: 'inv_dir_28',
    name: '44 Capital Management',
    website: 'https://www.44.capital/',
    hq: 'New York, NY',
    stages: ['Idea/Patent', 'Prototype', 'Early Revenue', 'Scaling'],
    thesis: 'We invest in companies at the intersection of Blockchain + real estate / emerging proptech.',
    type: 'VC',
    cheque_range: '$50k - $500k',
    match_score: 80
  },
  {
    id: 'inv_dir_29',
    name: '50 Partners Capital',
    website: 'http://www.50partners.fr/',
    hq: 'Paris, France',
    stages: ['Idea/Patent', 'Prototype', 'Early Revenue'],
    thesis: 'We only invest in the companies accelerated by 50 Partners.',
    type: 'Angel network',
    cheque_range: '$20k - $500k',
    match_score: 82
  },
  {
    id: 'inv_dir_30',
    name: '500 Global',
    website: 'https://500.co/',
    hq: 'San Francisco, CA',
    stages: ['Idea/Patent', 'Prototype', 'Early Revenue', 'Scaling', 'Growth'],
    thesis: 'We invest in companies in markets where technology, innovation, and capital can unlock long-term value.',
    type: 'VC',
    cheque_range: '$150k - $2.5M',
    match_score: 97
  }
];