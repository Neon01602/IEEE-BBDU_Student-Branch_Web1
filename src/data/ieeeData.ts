import { EventItem, TeamMember, GalleryItem, BranchStat } from '../types';

export const BRANCH_INFO = {
  name: 'IEEE BBDU Student Branch',
  university: 'Babu Banarasi Das University, Lucknow',
  section: 'IEEE Uttar Pradesh Section (Region 10)',
  code: 'STB99214',
  tagline: 'Advancing Technology for Humanity & Fostering Global Engineering Leaders',
  description: 'The IEEE Student Branch at Babu Banarasi Das University is a vibrant student-run technical community dedicated to nurturing technological innovation, academic excellence, leadership skills, and professional development among aspiring engineers.',
  mission: 'To foster technological innovation and excellence for the benefit of humanity by inspiring students, organizing world-class workshops, hackathons, and technical symposiums, and cultivating future-ready engineers with ethical integrity.',
  vision: 'To be recognized as a premier IEEE student community in Region 10 that empowers every student with practical research exposure, hands-on technological prowess, industry networking, and collaborative innovation.',
  address: 'Block E, School of Engineering, Babu Banarasi Das University, Faizabad Road, Lucknow, Uttar Pradesh 226028',
  email: 'ieeebbdu@gmail.com',
  phone: '+91 (522) 6196222',
  hours: 'Mon - Sat: 9:00 AM - 5:00 PM IST',
};

export const BRANCH_STATS: BranchStat[] = [
  {
    label: 'Active Student Members from UG',
    value: '30+',
    iconName: 'Users',
    description: 'Undergraduate student innovators & technical volunteers',
  },
  {
    label: 'Tech & Non-Tech Events',
    value: '15+',
    iconName: 'CalendarCheck',
    description: 'Workshops, hackathons, and tech talks conducted',
  },
];

export const CORE_VALUES = [
  {
    title: 'Technological Excellence',
    desc: 'Empowering students with hands-on exposure to cutting-edge frontiers in AI, Robotics, Cyber-Physical Systems, and IoT.',
    icon: 'Cpu',
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    title: 'Collaborative Innovation',
    desc: 'Encouraging interdisciplinary hackathons and collaborative research that bridges university academia with real-world industry demands.',
    icon: 'Sparkles',
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    title: 'Leadership & Professionalism',
    desc: 'Equipping members with executive management, public communication, IEEE professional ethics, and global project coordination skills.',
    icon: 'Award',
    gradient: 'from-purple-600 to-violet-600',
  },
  {
    title: 'Diversity & Inclusion (WIE)',
    desc: 'Dedicated Women in Engineering (WIE) affinity group fostering gender balance, STEM outreach in local schools, and women tech mentorship.',
    icon: 'HeartHandshake',
    gradient: 'from-blue-600 to-purple-600',
  },
];

export const EVENTS_DATA: EventItem[] = [];


// IEEE BBDU Student Branch Leadership Team
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Dr. Mrinalini Srivastava',
    role: 'Branch Counsellor',
    wing: 'Faculty Counsellor',
    avatar: '/api/linkedin-avatar?slug=dr-mrinalini-srivastava-392529285',
    linkedinSlug: 'dr-mrinalini-srivastava-392529285',
    bio: 'Branch Counsellor of IEEE BBDU Student Branch. Guiding student leadership, academic excellence, research initiatives, and professional development in engineering.',
    email: 'mrinalini.prep@bbdu.ac.in',
    linkedin: 'https://www.linkedin.com/in/dr-mrinalini-srivastava-392529285/',
    department: 'School of Engineering, BBDU',
    ieeeNumber: 'IEEE Senior Member',
    responsibilities: [
      'Branch strategic governance and mentoring',
      'IEEE UP Section liaison and compliance',
      'Academic research guidance and publication support',
      'Faculty advisory across technical student chapters'
    ],
  },
  {
    id: 'tm-2',
    name: 'Yash Kumar Kanojiya',
    role: 'Chairperson',
    wing: 'Office Bearers',
    avatar: '/api/linkedin-avatar?slug=yash-kumar-kanojiya-1174872a0',
    linkedinSlug: 'yash-kumar-kanojiya-1174872a0',
    bio: 'Chairperson of IEEE BBDU Student Branch. Heading executive strategy, branch operations, inter-university technical collaborations, and student chapters.',
    email: 'yash.kanojiya@ieee.org',
    linkedin: 'https://www.linkedin.com/in/yash-kumar-kanojiya-1174872a0/',
    department: 'Computer Science & Engineering',
    ieeeNumber: 'IEEE Student Member #994821',
    responsibilities: [
      'Overall student branch executive leadership',
      'Strategic planning and annual activity calendar',
      'Cross-branch partnerships and industry relations',
      'Flagship hackathon and tech symposium stewardship'
    ],
  },
  {
    id: 'tm-3',
    name: 'Kamakhya Singh Yadav',
    role: 'Secretary (WIE)',
    wing: 'Office Bearers',
    avatar: '/api/linkedin-avatar?slug=kamakhya-singh-yadav-7a5319343',
    linkedinSlug: 'kamakhya-singh-yadav-7a5319343',
    bio: 'Secretary for IEEE Women in Engineering (WIE) Affinity Group. Fostering female representation in deep-tech, organizing STEM workshops, and community mentorship.',
    email: 'kamakhya.wie@ieee.org',
    linkedin: 'https://www.linkedin.com/in/kamakhya-singh-yadav-7a5319343/',
    department: 'Computer Science & Engineering',
    ieeeNumber: 'IEEE Student Member #995204',
    responsibilities: [
      'IEEE WIE Affinity Group executive operations',
      'Women in Tech conferences and leadership talks',
      'STEM outreach in colleges and schools',
      'WIE Star project mentoring and reporting'
    ],
  },
  {
    id: 'tm-4',
    name: 'Aditya Chauhan',
    role: 'Secretary',
    wing: 'Office Bearers',
    avatar: '/api/linkedin-avatar?slug=aditya-c-8102263b1',
    linkedinSlug: 'aditya-c-8102263b1',
    bio: 'Secretary of IEEE BBDU Student Branch. Managing official branch communications, IEEE vTools event reporting, documentation, and compliance.',
    email: 'aditya.chauhan@ieee.org',
    linkedin: 'https://www.linkedin.com/in/aditya-c-8102263b1/',
    department: 'Computer Science & Engineering',
    ieeeNumber: 'IEEE Student Member #995183',
    responsibilities: [
      'Official documentation and meeting minutes',
      'IEEE vTools event submission and approvals',
      'Section correspondence and member verification',
      'Administrative records and branch compliance'
    ],
  },
  {
    id: 'tm-5',
    name: 'Ahmad Abdullah',
    role: 'Event Coordinator',
    wing: 'Event Coordinators',
    avatar: '/api/linkedin-avatar?slug=ahmad-abdullah-77818738b',
    linkedinSlug: 'ahmad-abdullah-77818738b',
    bio: 'Event Coordinator spearheading technical hackathons, guest keynote symposiums, speaker logistics, and end-to-end venue execution.',
    email: 'ahmad.events@ieee.org',
    linkedin: 'https://www.linkedin.com/in/ahmad-abdullah-77818738b/',
    department: 'Information Technology',
    responsibilities: [
      'Technical hackathon structure and rules design',
      'Speaker hospitality, itinerary and guest coordination',
      'Real-time venue and tech setup oversight',
      'Auditorium sound, projection, and staging logistics'
    ],
  },
  {
    id: 'tm-6',
    name: 'Arnav Vidyarthi',
    role: 'Event Coordinator',
    wing: 'Event Coordinators',
    avatar: '/api/linkedin-avatar?slug=arnav-vidyarthi-620421389',
    linkedinSlug: 'arnav-vidyarthi-620421389',
    bio: 'Event Coordinator orchestrating technical workshops, hands-on bootcamps, stage management, and on-ground team operations.',
    email: 'arnav.events@ieee.org',
    linkedin: 'https://www.linkedin.com/in/arnav-vidyarthi-620421389/',
    department: 'Computer Science & Engineering',
    responsibilities: [
      'Workshop scheduling and hands-on lab prep',
      'On-ground event volunteer supervision',
      'Hardware and sensor lab equipment management',
      'Competition judging coordination'
    ],
  },
  {
    id: 'tm-7',
    name: 'Harshita Nirmal',
    role: 'Event Coordinator',
    wing: 'Event Coordinators',
    avatar: '/api/linkedin-avatar?slug=harshita-nirmal-85820037a',
    linkedinSlug: 'harshita-nirmal-85820037a',
    bio: 'Event Coordinator managing technical symposiums, registration desks, schedule planning, and attendee engagement workflows.',
    email: 'harshita.events@ieee.org',
    linkedin: 'https://www.linkedin.com/in/harshita-nirmal-85820037a/',
    department: 'Electronics & Communication Engineering',
    responsibilities: [
      'Event registration desks and attendee passes',
      'Participant queries, helpdesk and check-in flows',
      'Event certifications and reward distribution',
      'Cultural and technical stage program scheduling'
    ],
  },
  {
    id: 'tm-8',
    name: 'Kulsum Zehra',
    role: 'Event Coordinator',
    wing: 'Event Coordinators',
    avatar: '/api/linkedin-avatar?slug=kulsoom-zehra-7311a8381',
    linkedinSlug: 'kulsoom-zehra-7311a8381',
    bio: 'Event Coordinator driving student outreach, inter-departmental tech competitions, webinar setups, and smooth event delivery.',
    email: 'kulsum.events@ieee.org',
    linkedin: 'https://www.linkedin.com/in/kulsoom-zehra-7311a8381/',
    department: 'Computer Science & Engineering',
    responsibilities: [
      'Inter-departmental competition outreach',
      'Webinar and live streaming operations',
      'Host and anchor team coordination',
      'Post-event feedback and survey analysis'
    ],
  },
  {
    id: 'tm-9',
    name: 'Umang Shukla',
    role: 'Membership Chair',
    wing: 'Publicity & Membership',
    avatar: '/api/linkedin-avatar?slug=umang-shukla10001',
    linkedinSlug: 'umang-shukla10001',
    bio: 'Membership Chair driving student onboarding, IEEE global membership drive campaigns, and member retention benefits.',
    email: 'umang.membership@ieee.org',
    linkedin: 'https://www.linkedin.com/in/umang-shukla10001/',
    department: 'Computer Science & Engineering',
    responsibilities: [
      'Annual student membership campaigns',
      'Onboarding orientation for new members',
      'IEEE global membership benefit workshops',
      'Membership database tracking and renewal drives'
    ],
  },
  {
    id: 'tm-10',
    name: 'Shreyansh Raghuvanshi',
    role: 'Publicity Chair',
    wing: 'Publicity & Membership',
    avatar: '/api/linkedin-avatar?slug=shreyansh-raghuvanshi-a75b79385',
    linkedinSlug: 'shreyansh-raghuvanshi-a75b79385',
    bio: 'Publicity Chair managing public relations, social media outreach, creative promotional campaigns, and brand visibility for IEEE BBDU.',
    email: 'shreyansh.publicity@ieee.org',
    linkedin: 'https://www.linkedin.com/in/shreyansh-raghuvanshi-a75b79385/',
    department: 'Computer Science & Engineering',
    responsibilities: [
      'Social media campaigns (Instagram, LinkedIn, X)',
      'Digital poster and video reel campaigns',
      'Press releases and campus notice announcements',
      'Public relations with partner university clubs'
    ],
  },
  {
    id: 'tm-11',
    name: 'Aditya Srivastava',
    role: 'Membership Chair',
    wing: 'Publicity & Membership',
    avatar: '/api/linkedin-avatar?slug=aditya-srivastava-209273338',
    linkedinSlug: 'aditya-srivastava-209273338',
    bio: 'Membership Chair dedicated to expanding the IEEE student body, fostering affinity chapters, and providing member support.',
    email: 'aditya.membership@ieee.org',
    linkedin: 'https://www.linkedin.com/in/aditya-srivastava-209273338/',
    department: 'Computer Science & Engineering',
    responsibilities: [
      'First-year student outreach and IEEE benefits briefings',
      'IEEE Society chapters enrollment drives',
      'Member grievances and verification assistance',
      'Community mentorship and peer study groups'
    ],
  },
  {
    id: 'tm-12',
    name: 'Shivansh Vishwakarma',
    role: 'Webmaster',
    wing: 'Webmaster',
    avatar: '/api/linkedin-avatar?slug=shivansh-vishwakarma-616031278',
    linkedinSlug: 'shivansh-vishwakarma-616031278',
    bio: 'Webmaster managing the official IEEE BBDU digital portals, technical web infrastructure, server reliability, and interactive portals.',
    email: 'shivansh.web@ieee.org',
    linkedin: 'https://www.linkedin.com/in/shivansh-vishwakarma-616031278/',
    department: 'Computer Science & Engineering',
    github: 'https://github.com',
    responsibilities: [
      'Official IEEE BBDU website architecture and maintenance',
      'Deployment of event registration & portal systems',
      'UI/UX design, performance and mobile responsiveness',
      'Server security, domain administration, and SEO'
    ],
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'IEEE Day Campus Celebrations & Robotics Demo',
    category: 'IEEE Day',
    date: 'October 2025',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    caption: 'Student branch members demonstrating autonomous line-follower and drone obstacle avoidance prototypes during IEEE Day.',
    location: 'BBDU Central Quadrangle',
  },
  {
    id: 'gal-2',
    title: 'CodeSprint 24-Hour Hackathon Final Pitching',
    category: 'Hackathons',
    date: 'November 2025',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Finalist teams delivering pitch decks to industry judges and venture angel mentors at 3:00 AM after 20 hours of non-stop coding.',
    location: 'Dr. Akhilesh Das Auditorium, BBDU',
  },
  {
    id: 'gal-3',
    title: 'Hands-on IoT & Embedded Systems Workshop',
    category: 'Workshops',
    date: 'January 2026',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    caption: 'Participants configuring ESP32 microcontrollers, MQTT broker protocols, and cloud sensor dashboards in real-time.',
    location: 'Embedded Hardware Lab, Block E',
  },
  {
    id: 'gal-4',
    title: 'Industrial Research Visit to ISRO Regional Center',
    category: 'Industrial Visit',
    date: 'February 2026',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    caption: 'IEEE BBDU delegation visiting space telemetry labs, satellite tracking dishes, and meeting senior aerospace scientists.',
    location: 'Regional Satellite Telemetry Center',
  },
  {
    id: 'gal-5',
    title: 'WIE STEM Mentorship in Rural Schools',
    category: 'IEEE Day',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    caption: 'IEEE WIE BBDU volunteers conducting fun science experiments, basic block programming, and inspiring young girls into tech careers.',
    location: 'Lucknow Rural High School',
  },
];

export const SOCIETIES_CHAPTERS = [
  {
    name: 'IEEE Computer Society (CS)',
    badge: 'Flagship Chapter',
    desc: 'The leading society for computer science, machine learning, distributed computing, and software engineering enthusiasts.',
    icon: 'Terminal',
    members: '30+ Members',
  },
  {
    name: 'IEEE Women in Engineering (WIE)',
    badge: 'Affinity Group',
    desc: 'A global network of IEEE members dedicated to promoting women engineers and scientists and inspiring girls to follow STEM.',
    icon: 'Sparkles',
    members: '30+ Members',
  },
];
