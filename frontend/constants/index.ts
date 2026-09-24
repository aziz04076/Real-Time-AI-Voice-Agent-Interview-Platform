import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence & Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem-Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural & Role Fit"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const COMPANIES_BY_BRANCH: Record<string, string[]> = {
  "B.Tech": [
    "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Adobe", "Intel", 
    "IBM", "Cisco", "Oracle", "Nvidia", "TCS", "Infosys", "Wipro", "Accenture", 
    "HCL Technologies", "Cognizant", "Flipkart", "Paytm", "Swiggy", "Zomato", "Uber"
  ],
  "Pharmacy": [
    "Pfizer", "GSK (GlaxoSmithKline)", "Novartis", "AstraZeneca", "Johnson & Johnson", 
    "Roche", "Sun Pharmaceutical", "Cipla", "Dr. Reddy's Laboratories", "Lupin", 
    "MSN Laboratories", "Hetero Drugs", "Aurobindo Pharma", "Zydus Lifesciences", 
    "Glenmark", "Divi's Laboratories", "Torrent Pharmaceuticals", "Biocon"
  ],
  "Commerce": [
    "Deloitte", "PwC", "EY (Ernst & Young)", "KPMG", "JP Morgan Chase", 
    "Goldman Sachs", "Morgan Stanley", "Bank of America", "Citi", "HSBC", 
    "American Express", "Barclays", "UBS", "Wells Fargo", "HDFC Bank", "ICICI Bank"
  ],
  "Arts": [
    "Adobe", "Figma", "Canva", "Pentagram", "Wolff Olins", "MetaDesign", 
    "Happy Cog", "Vogue", "Netflix (Creative)", "Disney", "Sony Pictures", 
    "Ogilvy", "Publicis Groupe", "WPP", "TikTok", "Pinterest"
  ],
  "Medical": [
    "Mayo Clinic", "Cleveland Clinic", "Mass General Hospital", "Johns Hopkins Medicine", 
    "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "Pfizer (Medical)", 
    "Roche Diagnostics", "Abbott Laboratories", "NYU Langone Health", "Emory Healthcare"
  ],
  "Management": [
    "McKinsey & Company", "Boston Consulting Group (BCG)", "Bain & Company", 
    "Accenture Strategy", "Deloitte Consulting", "Unilever", "Procter & Gamble (P&G)", 
    "Nestlé", "PepsiCo", "Coca-Cola", "ITC Limited", "L'Oréal", "Amazon (Operations)"
  ]
};

export const COMPANIES = Object.values(COMPANIES_BY_BRANCH).flat().filter((v, i, a) => a.indexOf(v) === i);

export const BRANCHES = [
  "B.Tech",
  "Pharmacy",
  "Commerce",
  "Arts",
  "Medical",
  "Management"
];

export const ROLES_BY_BRANCH: Record<string, string[]> = {
  "B.Tech": [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "AI/ML Engineer",
    "Data Scientist",
    "Mechanical Engineer",
    "Civil Engineer",
    "Electrical Engineer",
    "DevOps Engineer",
    "Embedded Systems Engineer"
  ],
  "Pharmacy": [
    "Pharmacist",
    "Clinical Research Associate",
    "Quality Assurance (QA) Specialist",
    "Pharmaceutical Sales Representative",
    "Pharmacovigilance Officer",
    "R&D Scientist"
  ],
  "Commerce": [
    "Accountant",
    "Financial Analyst",
    "Investment Banker",
    "Audit Associate",
    "Tax Consultant",
    "HR Specialist",
    "Marketing Manager"
  ],
  "Arts": [
    "Content Writer",
    "Graphic Designer",
    "Social Media Manager",
    "UX/UI Designer",
    "Public Relations Officer"
  ],
  "Medical": [
    "Resident Doctor",
    "Surgeon",
    "Hospital Administrator",
    "Public Health Specialist"
  ],
  "Management": [
    "Product Manager",
    "Business Analyst",
    "Operations Manager",
    "Project Coordinator"
  ]
};

export const BRANCH_LOGOS: Record<string, string[]> = {
  "B.Tech": ["/amazon.png", "/facebook.png", "/quora.png", "/reddit.png", "/skype.png", "/spotify.png"],
  "Pharmacy": ["/medical.png"],
  "Medical": ["/medical.png"],
  "Commerce": ["/finance.png"],
  "Arts": ["/adobe.png", "/tiktok.png", "/pinterest.png"],
  "Management": ["/amazon.png", "/skype.png", "/yahoo.png"]
};

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
  "/medical.png",
  "/finance.png"
];
