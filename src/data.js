
/**
 * Portfolio content for laksh-portfolio.onrender.com
 * Images are Picsum placeholders until real screenshots are available.
 * Personality: technically competent, mildly unhinged, allergic to fluff.
 */

import { avatar } from './anime';

const pic = (seed, w = 960, h = 540) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const me = {
  name: 'Lakshya Bhawsar',
  logo: 'LAKSH',
  role: 'GenAI Engineer & Agentic AI Developer',

  tagline:
    'I build AI systems that do more than autocomplete confidently and hope for the best.',

  now: 'GenAI/ML Engineer at bluCursor Infotech',
  location: 'Indore, India',

  heroImg: pic('laksh-hero-desk', 1920, 1080),

  email: 'lakshybhawsar1722@gmail.com',

  links: {
    github: 'https://github.com/Laksh-Devloper',
    linkedin: 'https://www.linkedin.com/in/lakshya-bhawsar',
    instagram: 'https://www.instagram.com/lakshh._.22/',
    resume:
      'https://drive.google.com/file/d/11gXlXevNjW98kkfaxbJ0evX7kJVaBE_r/view?usp=sharing',
  },
};

export const about = {
  text:
    "I'm a GenAI engineer focused on agentic AI, LLM applications, and retrieval systems. I work across the entire pipeline, from making models useful to building the APIs and interfaces that let actual humans use them. I enjoy automating repetitive work, debugging things that were supposedly working five minutes ago, and making complicated systems a little less complicated. Basically, if a task involves copying data between tabs for three hours, I probably think we can do better.",

  facts: [
    ['Specialty', 'Agentic AI, RAG & LLM Applications'],
    ['Currently', 'GenAI/ML Engineer at bluCursor Infotech'],
    ['Education', 'B.Tech in Computer Science, 2023–2026'],
    ['Based in', 'Indore, India'],
  ],

  highlights: [
    {
      value: 40,
      suffix: '%',
      label: 'less manual effort through agentic form handling',
    },
    {
      value: 32,
      suffix: '%',
      label: 'improvement in answer accuracy through retrieval',
    },
    {
      value: 90,
      suffix: '%+',
      label: 'accuracy achieved by disease prediction models',
    },
  ],
};

const project = (
  id,
  title,
  kind,
  status,
  blurb,
  detail,
  stack,
  repo
) => ({
  id,
  title,
  kind,
  status,
  blurb,
  detail,
  stack,
  repo,

  // GitHub's social preview card for the repo, saved in public/projects.
  img: `/projects/${id}.png`,
  hover: `/projects/${id}.png`,
  wide: `/projects/${id}.png`,
});

export const projects = [
  project(
    'zero',
    'Zero Analyst',
    'Agentic AI',
    'Completed',

    'Ask questions about a dataset in plain English. Let the AI handle the spreadsheet archaeology.',

    'An AI-powered data analyst built to turn natural-language questions into actionable analysis. The agent works with tabular data, performs analysis, and presents results through answers, tables, and visualizations. Because manually wrestling with CSV files should not be a personality trait.',

    ['Python', 'React', 'FastAPI', 'Gemini', 'LangChain', 'Supabase'],

    'https://github.com/Laksh-Devloper/ZeroAnalyst---Agentic-AI-Data-Analyst'
  ),

  project(
    'curaid',
    'Curaid',
    'Healthcare AI',
    'Completed',

    'A healthcare companion that explores disease-risk prediction without pretending to replace a doctor.',

    'A health-focused application combining machine learning models with a Django web interface to estimate disease risk from patient parameters. Built to explore how predictive models can support healthcare workflows. Predictions are useful; treating a model like an all-knowing physician is not.',

    [
      'Python',
      'Django',
      'Machine Learning',
      'scikit-learn',
      'Pandas',
      'NumPy',
    ],

    'https://github.com/Laksh-Devloper/Curaid'
  ),

  project(
    'holo',
    'Holo Room 3D',
    'Creative Development',
    'Completed',

    'An interactive 3D room, because apparently a normal portfolio was too peaceful.',

    'A browser-based 3D room experience built with Three.js and custom 3D assets. Bundled with Vite for a modern development workflow. A reminder that not everything needs an LLM, a vector database, and a meeting about the LLM.',

    ['JavaScript', 'Three.js', 'Vite', '3D Assets'],

    'https://github.com/Laksh-Devloper/Cute-3d-Room-Portfolio-using-Three.JS'
  ),

  project(
    'insight',
    'InsightFlow',
    'Data Analytics',
    'Completed',

    'Raw data in. Useful insights out. Fewer spreadsheets being passed around like classified documents.',

    'A data analytics application designed to transform raw datasets into interpretable findings using Python-based analysis and machine learning. Built around the idea that data should help people make decisions, not just make dashboards look impressively busy.',

    ['Python', 'React', 'Flask', 'scikit-learn'],

    'https://github.com/Laksh-Devloper/InsightFlow---Data-to-Actionable-Insights'
  ),
];

export const seasons = [
  {
    year: 2004,
    type: 'Life',
    title: 'Character Created',
    org: 'Earth Server, Asia Region',
    period: '2004',

    points: [
      'Successfully spawned into production.',
      'Initial stats: curiosity maxed out, documentation not found.',
      'Patch notes unavailable. Bugs considered features until further notice.',
    ],
  },

  {
    year: '2004 - 2020',
    type: 'Education',
    title: 'Tutorial Arc',
    org: 'School & Various Side Quests',
    period: '2004–2020',

    points: [
      'Completed the mandatory education tutorial.',
      'Developed a suspicious interest in computers.',
      'Learned that deadlines are real, even when your brain says tomorrow.',
      'Social side quests unlocked. Main storyline still loading.',
    ],
  },

  {
    year: 2020,
    type: 'Education',
    title: 'Diploma in Computer Science',
    org: 'Shri Vaishnav Polytechnic College',
    period: '2020–2023',

    points: [
      'Studied Computer Science and Engineering in Indore.',
      'Started building a foundation in programming, databases, and software development.',
      'Discovered that fixing one bug can introduce three new and deeply personal bugs.',
    ],
  },

  {
    year: 2023,
    type: 'Education',
    title: 'B.Tech in Computer Science',
    org: 'Acropolis Institute of Technology & Research (RGPV)',
    period: '2023–2026',

    points: [
      'Pursued Computer Science and Engineering at Acropolis Institute.',
      'Served as Technical Lead at Spectra and contributed to other campus initiatives.',
      'Explored AI, software development, and projects beyond the classroom.',
      'Learned that the hardest part of group projects is occasionally the group.',
    ],
  },
  {
    year: 'March 2026',
    type: 'Experience',
    title: 'GenAI / ML Intern',
    org: 'bluCursor Infotech',
    period: 'March 2026 – Sept 2026',

    points: [
      'Building agentic AI systems, LLM applications, and RAG pipelines using Python, LangChain, and LangGraph.',
      'Developed AI-powered form automation and API testing workflows, reducing repetitive tasks from hours to minutes.',
      'Built semantic retrieval systems to match similar forms across large datasets using embeddings and vector search.',
      'Worked on FastAPI services, MongoDB integrations, AWS S3, and automated testing workflows.',
      'Exploring MCP integrations, AI gateway architectures, and reliable deployment of LLM-powered applications.',
    ],
  },
  {
    year: 'Sept 2026',
    type: 'Experience',
    title: 'GenAI / ML Engineer',
    org: 'bluCursor Infotech',
    period: 'Sept 2026–Present',

    points: [
      'Building AI applications, retrieval pipelines, and LLM-powered workflows.',
      'Developing agentic automation for form handling and repetitive business processes.',
      'Working with Python, FastAPI, LangChain, LangGraph, and related AI tooling.',
      'Built automation workflows that reduced certain manual tasks from hours to minutes.',
      'Exploring API optimization, observability, and reliable AI application design.',
      'Currently teaching software to do repetitive work. The irony of me doing the debugging is not lost on me.',
    ],
  },
];

export const skills = [
  [
    'Generative & Agentic AI',
    [
      'Agentic AI',
      'LLM Applications',
      'RAG',
      'LangChain',
      'LangGraph',
      'MCP',
      'Prompt Engineering',
    ],
  ],

  [
    'Programming',
    [
      'Python',
      'JavaScript',
      'SQL',
    ],
  ],

  [
    'Machine Learning',
    [
      'Supervised Learning',
      'Feature Engineering',
      'Model Evaluation',
      'Neural Networks',
      'Predictive Modeling',
    ],
  ],

  [
    'Frameworks',
    [
      'FastAPI',
      'Django',
      'React',
    ],
  ],

  [
    'Libraries',
    [
      'Pandas',
      'NumPy',
      'Matplotlib',
      'scikit-learn',
      'YOLO',
    ],
  ],

  [
    'Cloud & Data',
    [
      'AWS S3',
      'AWS EC2',
      'MongoDB',
      'PostgreSQL',
      'Supabase',
      'Vector Databases',
    ],
  ],

  [
    'Developer Tools',
    [
      'Git',
      'GitHub',
      'Jupyter',
      'Postman',
      'Playwright',
      'Claude Code',
    ],
  ],
];

export const profiles = [
  {
    id: 'recruiter',
    label: 'Recruiter',
  },
  {
    id: 'engineer',
    label: 'Engineer',
  },
  {
    id: 'founder',
    label: 'Founder',
  },
  {
    id: 'guest',
    label: 'Just Browsing',
  },
].map((profile) => ({
  ...profile,
  avatar: avatar(profile.id),
}));

export const leadership = [
  {
    org: 'Spectra',
    role: 'Technical Lead',
    period: 'Jun 2025–Feb 2026',
    status: 'Completed',
  },

  {
    org: 'Spectra',
    role: 'Technical Team Member',
    period: 'May 2024–Jun 2025',
    status: 'Completed',
  },

  {
    org: 'EDC',
    role: 'Clix Team Member, Video Editing',
    period: 'Feb 2024–Feb 2025',
    status: 'Completed',
  },
];

export const philosophy = {
  title: 'Less hype. More engineering.',

  text:
    'I like building systems that solve actual problems. That means understanding the data, choosing the right tools, making the architecture work, and checking whether the thing actually delivers. AI is powerful. It is also capable of being confidently wrong at spectacular speed. Good engineering is what makes the difference.',

  principles: [
    {
      title: 'Automate the boring stuff',
      description:
        'If a human has to repeat the same task hundreds of times, there is probably a better way.',
    },
    {
      title: 'Build beyond the demo',
      description:
        'A convincing demo is nice. A system that handles real inputs, errors, and edge cases is nicer.',
    },
    {
      title: 'Stay curious',
      description:
        'Learn new tools, question old assumptions, and never confuse using a framework with understanding the problem.',
    },
    {
      title: 'Keep the ego debuggable',
      description:
        'Code can be wrong. Ideas can be wrong. Being able to admit either one is a useful feature.',
    },
  ],
};

export const funFacts = [
  'My preferred love language is apparently a well-designed automation pipeline.',
  'I like AI agents. I also like knowing exactly what they are doing.',
  'I believe most repetitive workflows deserve a better ending.',
  'I can spend hours debugging a system and still get personally offended by a missing semicolon.',
  'I build things because curiosity is cheaper than a lifetime of wondering how they work.',
];

export const contact = {
  title: 'Have a problem worth solving?',

  text:
    'I am interested in useful AI products, agentic systems, interesting engineering challenges, and collaborations where the technical work actually matters. Skip the buzzword bingo. Tell me what you are building.',

  cta: 'Let’s Build Something Useful',

  email: 'lakshybhawsar1722@gmail.com',
};

export const footer = {
  text:
    'Designed with curiosity, built with code, and debugged with an unreasonable amount of persistence.',

  copyright: '© Lakshya Bhawsar. All rights reserved.',

  note:
    'No AI agents were emotionally harmed during the writing of this portfolio. Their API bills, however, are another story.',
};
