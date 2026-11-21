export type ProjectStatus = 
  | 'Survey Approved'
  | 'Materials Ready'
  | 'Installation Scheduled'
  | 'Installation Started'
  | 'Testing Completed'
  | 'Customer Sign-off'
  | 'Project Completed';

export interface SolarProject {
  id: string; // e.g. 'PRJ-401'
  customerName: string;
  siteAddress: string;
  systemCapacityKw: number;
  projectManager: string;
  assignedTechnicians: string[];
  startDate: string;
  expectedCompletion: string;
  status: ProjectStatus;
  confirmedQuotationId: string;
  milestones: {
    name: string;
    completed: boolean;
    dateCompleted?: string;
  }[];
  documentsCount: number;
}

export interface ProjectTask {
  id: string; // e.g. 'TSK-101'
  projectId: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Blocked' | 'Done';
}

export interface TechnicianSchedule {
  id: string;
  name: string;
  role: string;
  availability: 'Available' | 'Onsite' | 'Scheduled' | 'Off-duty';
  activeProjects: string[];
  workloadScorePercent: number; // e.g. 75%
  nextAvailableSlot: string;
}
