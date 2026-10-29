export type EventCategory = 'Technical' | 'Workshop' | 'Hackathon' | 'Webinar' | 'Social' | 'WIE';

export interface EventWinner {
  id?: string;
  name: string;
  department?: string;
  prize?: string;
  position?: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'past';
  image: string;
  description: string;
  winners?: EventWinner[];
  winner?: EventWinner | string;
  relatedPictures?: string[];
  speaker?: {
    name: string;
    designation: string;
    avatar?: string;
  };
  registrationOpen?: boolean;
  registrationDeadline?: string;
  attendeesCount?: number;
  tags: string[];
  recapNotes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type TeamWing = 
  | 'All' 
  | 'Faculty Counsellor' 
  | 'Office Bearers' 
  | 'Event Coordinators' 
  | 'Publicity & Membership' 
  | 'Webmaster';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  wing: TeamWing;
  avatar: string;
  linkedinSlug: string;
  bio: string;
  email?: string;
  linkedin: string;
  github?: string;
  department?: string;
  ieeeNumber?: string;
  responsibilities?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Workshops' | 'Hackathons' | 'IEEE Day' | 'Industrial Visit' | 'Competitions';
  date: string;
  image: string;
  caption: string;
  location: string;
}

export interface BranchStat {
  label: string;
  value: string;
  iconName: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  studentId?: string;
  branch?: string;
  purpose: 'membership' | 'events' | 'sponsorship' | 'query';
  subject: string;
  message: string;
}
