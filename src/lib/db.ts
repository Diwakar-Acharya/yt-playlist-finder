export interface Review {
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
}

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  timestamp?: string;
}

export interface ScoreBreakdown {
  userReviews: number;      // 35%
  completionRate: number;   // 25%
  playlistStructure: number;// 20%
  recentActivity: number;   // 10%
  creatorAuthority: number; // 10%
}

export interface Playlist {
  slug: string;
  title: string;
  description: string;
  channel: string;
  channelSubscriberCount: string;
  thumbnail: string;
  youtubeUrl?: string;  // Direct link to the YouTube playlist
  score: number;
  scoreBreakdown: ScoreBreakdown;
  durationHours: number;
  videoCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  communityRating: number;
  savedCount: number;
  completionPercent: number;
  freshness: string;
  topics: string[];
  missingTopics: string[];
  reviews: Review[];
  videos: VideoItem[];
  alternatives: string[]; // slugs
  roadmaps: string[];     // roadmap IDs
  isFallback?: boolean;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: {
    title: string;
    description: string;
    recommendedPlaylistSlug: string;
  }[];
}

export const PLAYLISTS: Playlist[] = [
  {
    slug: 'andrew-ng-machine-learning',
    title: 'Machine Learning Specialization Deep Dive',
    description: 'The absolute gold standard for learning Machine Learning from scratch. Master fundamental AI concepts and practical skills under the guidance of Andrew Ng.',
    channel: 'DeepLearning.AI',
    channelSubscriberCount: '1.2M subscribers',
    thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI',
    score: 96,
    scoreBreakdown: {
      userReviews: 98,
      completionRate: 88,
      playlistStructure: 98,
      recentActivity: 90,
      creatorAuthority: 100
    },
    durationHours: 48,
    videoCount: 36,
    difficulty: 'Beginner',
    language: 'English',
    communityRating: 4.9,
    savedCount: 2840,
    completionPercent: 82,
    freshness: 'Updated 1 month ago',
    topics: [
      'Supervised Learning',
      'Linear Regression',
      'Logistic Regression',
      'Regularization & Cost Functions',
      'Neural Networks Basics',
      'Unsupervised Learning',
      'Recommender Systems',
      'Anomaly Detection'
    ],
    missingTopics: [
      'Transformer Architectures',
      'Generative AI Agent Workflows'
    ],
    reviews: [
      {
        name: 'Sarah Chen',
        role: 'Data Scientist at Stripe',
        rating: 5,
        comment: 'Andrew Ng makes the math feel so intuitive. The linear regression explanations are unmatched.',
        date: '2026-05-12'
      },
      {
        name: 'Marcus Brody',
        role: 'CS Undergrad',
        rating: 5,
        comment: 'Outstanding organization. The grading is weighted heavily on structure for a reason—it flows logically.',
        date: '2026-06-02'
      }
    ],
    videos: [
      { id: 'jGwO_thI7yM', title: 'Introduction to Machine Learning & Core Concepts', duration: '12:45' },
      { id: 'PPLop4L2eGk', title: 'Linear Regression with One Variable', duration: '18:22' },
      { id: 'yuH4iRcggMw', title: 'Cost Function Intuition', duration: '22:15' },
      { id: 'F6y-oMcLS6E', title: 'Gradient Descent for Linear Regression', duration: '19:40' },
      { id: 'IHZwWFHWa-w', title: 'Matrices and Vectors in ML', duration: '14:10' },
      { id: 'qeHZOdmJvFU', title: 'Classification with Logistic Regression', duration: '25:30' },
      { id: 'VHZdqGPUMTI', title: 'Overfitting and Regularization', duration: '21:05' }
    ],
    alternatives: ['statquest-machine-learning', 'fast-ai-deep-learning'],
    roadmaps: ['machine-learning-engineer']
  },
  {
    slug: 'statquest-machine-learning',
    title: 'Machine Learning Fundamentals & Statistics',
    description: 'Josh Starmer breaks down complex machine learning algorithms into bite-sized, visual steps. No jargon, just clear intuitions.',
    channel: 'StatQuest with Josh Starmer',
    channelSubscriberCount: '1.1M subscribers',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF500JJRTJk',
    score: 92,
    scoreBreakdown: {
      userReviews: 96,
      completionRate: 92,
      playlistStructure: 90,
      recentActivity: 75,
      creatorAuthority: 95
    },
    durationHours: 32,
    videoCount: 84,
    difficulty: 'Beginner',
    language: 'English',
    communityRating: 4.8,
    savedCount: 1945,
    completionPercent: 88,
    freshness: 'Updated 6 months ago',
    topics: [
      'Bias & Variance',
      'Decision Trees',
      'Random Forests',
      'Support Vector Machines (SVM)',
      'Principal Component Analysis (PCA)',
      't-SNE Visualizations',
      'Gradient Boost & XGBoost'
    ],
    missingTopics: [
      'Deep Learning Intro',
      'PyTorch Framework Hands-on'
    ],
    reviews: [
      {
        name: 'David K.',
        role: 'Self-Taught Dev',
        rating: 5,
        comment: 'BAM! Josh Starmer is a genius. He explains Random Forests better than any textbook.',
        date: '2026-04-20'
      }
    ],
    videos: [
      { id: 'Gv9_4yMHFhI', title: 'StatQuest: A gentle introduction to machine learning', duration: '08:45' },
      { id: 'aircAruvnKk', title: 'Neural Networks: But what is a neural network?', duration: '15:12' },
      { id: 'IHZwWFHWa-w', title: 'Decision Trees Explained Clearly', duration: '12:55' },
      { id: 'J4Wdy0Wc_xQ', title: 'Random Forests Part 1 - Building & Voting', duration: '14:20' }
    ],
    alternatives: ['andrew-ng-machine-learning'],
    roadmaps: ['machine-learning-engineer']
  },
  {
    slug: 'abdul-bari-dsa',
    title: 'Algorithms and Data Structures Masterclass',
    description: 'Master time and space complexity, recursion, trees, graphs, and dynamic programming with Abdul Bari\'s legendary blackboard lectures.',
    channel: 'Abdul Bari',
    channelSubscriberCount: '980K subscribers',
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLIY8eNdw5tW_zX3OCzX7NJ8bL1p6pWfgG',
    score: 95,
    scoreBreakdown: {
      userReviews: 99,
      completionRate: 85,
      playlistStructure: 98,
      recentActivity: 65,
      creatorAuthority: 99
    },
    durationHours: 54,
    videoCount: 78,
    difficulty: 'Advanced',
    language: 'English',
    communityRating: 4.9,
    savedCount: 3410,
    completionPercent: 74,
    freshness: 'Last updated 2025',
    topics: [
      'Asymptotic Notation (O, Omega, Theta)',
      'Divide and Conquer Algorithms',
      'Greedy Methods (Dijkstra, Prim)',
      'Dynamic Programming (LCS, Knapsack)',
      'Graph Traversals (DFS, BFS)',
      'NP-Completeness Concepts'
    ],
    missingTopics: [
      'LeetCode Problem Practice Sheets',
      'Modern C++20 standard syntax implementation'
    ],
    reviews: [
      {
        name: 'Rajesh Kumar',
        role: 'SDE-2 at Amazon',
        rating: 5,
        comment: 'His dynamic programming videos saved my tech interviews. Pure mathematical logic with no fluff.',
        date: '2026-02-18'
      }
    ],
    videos: [
      { id: '0IAPZzGSbME', title: 'Introduction to Algorithms & Complexity Analysis', duration: '28:10' },
      { id: 'A03oI0aR54M', title: 'Time Complexity Analysis', duration: '32:45' },
      { id: '31v327-0y1A', title: 'Asymptotic Notations Deep Dive', duration: '26:15' },
      { id: 'T88NfS-Y5mE', title: 'Merge Sort Algorithm', duration: '35:20' }
    ],
    alternatives: ['striver-dsa-sheet'],
    roadmaps: ['software-engineer']
  },
  {
    slug: 'striver-dsa-sheet',
    title: 'A2Z DSA Course and Coding Interview Prep',
    description: 'A complete step-by-step roadmap to cracking top product companies. Structured practice problems from basic arrays to complex segment trees.',
    channel: 'takeUforward',
    channelSubscriberCount: '750K subscribers',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz',
    score: 94,
    scoreBreakdown: {
      userReviews: 96,
      completionRate: 90,
      playlistStructure: 95,
      recentActivity: 98,
      creatorAuthority: 92
    },
    durationHours: 120,
    videoCount: 154,
    difficulty: 'Intermediate',
    language: 'Hindi / English',
    communityRating: 4.8,
    savedCount: 4210,
    completionPercent: 80,
    freshness: 'Updated 2 weeks ago',
    topics: [
      'STL & Collections',
      'Arrays & Sorting Hacks',
      'Linked List Core Implementations',
      'Binary Trees & Traversals',
      'Recursion and Backtracking',
      'Sliding Window & Two Pointer'
    ],
    missingTopics: [
      'Rigorous mathematical proofs of time complexity'
    ],
    reviews: [
      {
        name: 'Aman Verma',
        role: 'SDE at Razorpay',
        rating: 5,
        comment: 'The sheet combined with these videos is highly structured. Recommended for anyone prepped for placements.',
        date: '2026-06-25'
      }
    ],
    videos: [
      { id: 'EAR7CYh3QLo', title: 'A2Z DSA Sheet Roadmap and Execution Guide', duration: '14:20' },
      { id: 'u-SgTfT6d-8', title: 'Time and Space Complexity Analysis for Interviews', duration: '22:15' },
      { id: '37WkpRxlGiU', title: 'Arrays - Easy to Hard Interview Questions', duration: '45:10' }
    ],
    alternatives: ['abdul-bari-dsa'],
    roadmaps: ['software-engineer']
  },
  {
    slug: 'corey-schafer-python',
    title: 'Python Programming Full Course for Beginners',
    description: 'The most thorough and clearly explained Python playlist on YouTube. Learn basic syntax, OOP, decorators, generator, and web scraping.',
    channel: 'Corey Schafer',
    channelSubscriberCount: '1.2M subscribers',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
    score: 93,
    scoreBreakdown: {
      userReviews: 98,
      completionRate: 85,
      playlistStructure: 96,
      recentActivity: 50,
      creatorAuthority: 98
    },
    durationHours: 38,
    videoCount: 42,
    difficulty: 'Beginner',
    language: 'English',
    communityRating: 4.9,
    savedCount: 2280,
    completionPercent: 79,
    freshness: 'Last updated 2024',
    topics: [
      'Python Setup & Installation',
      'Data Types & Control Flow',
      'Functions & Variable Scope',
      'Object-Oriented Programming (OOP)',
      'Decorators and Context Managers',
      'File I/O and OS Module'
    ],
    missingTopics: [
      'Python 3.12 Type Hinting updates',
      'Asynchronous Programming (asyncio)'
    ],
    reviews: [
      {
        name: 'Lina Perez',
        role: 'Bioinformatician',
        rating: 5,
        comment: 'I went from zero programming experience to writing custom automation scripts. Corey is incredibly clear.',
        date: '2026-03-10'
      }
    ],
    videos: [
      { id: '_uQrJ0TkZlc', title: 'Python Tutorial for Beginners (with mini-projects)', duration: '18:50' },
      { id: 'k9TUPpljBRs', title: 'Integers, Floats, Strings in Python', duration: '12:30' },
      { id: 'hnxIRR6vH-4', title: 'Loops and Iterations - For/While Explained', duration: '20:10' },
      { id: 'FsAPt_9Bf2E', title: 'Python Decorators - Dynamically Alter The Functionality', duration: '28:45' }
    ],
    alternatives: ['programming-with-mosh-python'],
    roadmaps: ['software-engineer', 'machine-learning-engineer']
  },
  {
    slug: 'organic-chemistry-tutor',
    title: 'Organic Chemistry I & II Crash Course',
    description: 'Learn mechanisms, nomenclature, stereochemistry, reactions, and spectroscopy with detailed, clear step-by-step drawing examples.',
    channel: 'The Organic Chemistry Tutor',
    channelSubscriberCount: '3.4M subscribers',
    thumbnail: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PL0o_zxa4K1BXP7TUO7656wg0uF1xYnwgm',
    score: 95,
    scoreBreakdown: {
      userReviews: 98,
      completionRate: 91,
      playlistStructure: 94,
      recentActivity: 92,
      creatorAuthority: 98
    },
    durationHours: 64,
    videoCount: 112,
    difficulty: 'Intermediate',
    language: 'English',
    communityRating: 4.9,
    savedCount: 1540,
    completionPercent: 86,
    freshness: 'Updated 2 months ago',
    topics: [
      'Nomenclature of Alkanes & Alkenes',
      'Stereochemistry & Enantiomers',
      'SN1, SN2, E1, E2 Mechanisms',
      'Electrophilic Addition Reactions',
      'Spectroscopy (NMR, IR, UV-Vis)',
      'Aromatic Substitution Reactions'
    ],
    missingTopics: [
      'Advanced Biochemistry pathways linkages'
    ],
    reviews: [
      {
        name: 'Emily Davis',
        role: 'Pre-Med Student',
        rating: 5,
        comment: 'Organic Chemistry is notoriously hard, but this channel single-handedly got me an A. Best teacher ever.',
        date: '2026-05-30'
      }
    ],
    videos: [
      { id: 'bU_S3A702YQ', title: 'Organic Chemistry Nomenclature Basics', duration: '25:10' },
      { id: 'T-0vT-N1448', title: 'SN1 SN2 E1 E2 Reaction Mechanisms Explained', duration: '45:30' },
      { id: '9UqL9Q908U4', title: 'How to Draw Enantiomers and Diastereomers', duration: '18:45' }
    ],
    alternatives: ['khan-academy-chemistry'],
    roadmaps: ['pre-med-science']
  }
];

export const ROADMAPS: Roadmap[] = [
  {
    id: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    description: 'A structured pathway to transition from programming to designing and deploying predictive models.',
    icon: 'Brain',
    steps: [
      {
        title: 'Python Programming Basics',
        description: 'Understand data structures, logic, loops, and OOP concepts in Python.',
        recommendedPlaylistSlug: 'corey-schafer-python'
      },
      {
        title: 'Machine Learning Core Theory',
        description: 'Learn the underlying math, loss functions, and algorithmic details.',
        recommendedPlaylistSlug: 'andrew-ng-machine-learning'
      },
      {
        title: 'Algorithm Optimization & Practice',
        description: 'Dive deep into structural breakdowns and visual step logic for non-deep learning algorithms.',
        recommendedPlaylistSlug: 'statquest-machine-learning'
      }
    ]
  },
  {
    id: 'software-engineer',
    title: 'Backend Software Engineer',
    description: 'Master programming syntax, performance complexity, and interview-level data structures.',
    icon: 'Code2',
    steps: [
      {
        title: 'Master Programming Syntax',
        description: 'Beginner-friendly python masterclass to build engineering foundations.',
        recommendedPlaylistSlug: 'corey-schafer-python'
      },
      {
        title: 'Data Structures Foundations',
        description: 'Learn step-by-step problem solving, recursive strategies, and collections.',
        recommendedPlaylistSlug: 'striver-dsa-sheet'
      },
      {
        title: 'Algorithms Deep Dive',
        description: 'Complex algorithms, asymptotic complexity, Greedy logic, and Dynamic Programming.',
        recommendedPlaylistSlug: 'abdul-bari-dsa'
      }
    ]
  }
];
