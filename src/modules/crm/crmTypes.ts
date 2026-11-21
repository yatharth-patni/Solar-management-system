export type LeadStage = 
  | 'New Lead'
  | 'Contacted'
  | 'Site Survey Scheduled'
  | 'Survey Approved'
  | 'Quotation Sent'
  | 'Won / Handoff'
  | 'Lost';

export type RoofType = 'RCC Flat Roof' | 'Slanted Tile' | 'Metal Sheet' | 'Ground Mount';

export interface CustomerLead {
  id: string; // e.g. 'LD-101'
  customerName: string;
  email: string;
  phone: string;
  address: string;
  assignedRep: string;
  stage: LeadStage;
  roofType: RoofType;
  monthlyBillAmount: number; // in $
  avgConsumptionKwh: number;
  proposedCapacityKw: number;
  estimatedValue: number;
  followUpDate: string;
  followUpNotes: string;
  createdDate: string;
  surveyId?: string;
  surveyStatus?: 'Pending' | 'Completed' | 'Approved' | 'Rejected';
  quotationId?: string;
  quotationStatus?: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
}

export interface SiteSurvey {
  id: string; // e.g. 'SRV-501'
  leadId: string;
  customerName: string;
  address: string;
  scheduledDate: string;
  surveyor: string;
  roofConditionScore: 'Good' | 'Moderate' | 'Reinforcement Needed';
  usableAreaSqFt: number;
  azimuthAngle: string;
  tiltAngle: string;
  shadingObstacles: string;
  status: 'Pending' | 'Completed' | 'Approved' | 'Rejected';
  notes: string;
}

export interface Quotation {
  id: string; // e.g. 'QT-201'
  leadId: string;
  customerName: string;
  capacityKw: number;
  panelModel: string;
  inverterModel: string;
  batteryBackup: string;
  proposedPrice: number;
  estAnnualGenerationKwh: number;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  handoffStatus?: 'Pending' | 'Handed Off to Projects';
}
