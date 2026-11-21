export type WarrantyCoverageStatus = 'Active Warranty' | 'Expiring Soon' | 'Out of Warranty';
export type TicketStatus = 'Open' | 'In Progress' | 'Pending Customer Confirmation' | 'Resolved' | 'Closed';

export interface WarrantyRecord {
  id: string; // e.g. 'WAR-901'
  customerName: string;
  projectId: string;
  productName: string;
  serialNumber: string;
  equipmentCategory: 'Solar Panel' | 'Inverter' | 'Battery Storage' | 'Workmanship';
  deliveryDate: string;
  warrantyStartDate: string;
  warrantyExpiryDate: string;
  durationYears: number;
  coverageStatus: WarrantyCoverageStatus;
}

export interface ServiceTicket {
  id: string; // e.g. 'TKT-301'
  customerName: string;
  serialNumber: string;
  equipmentName: string;
  issueDescription: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  assignedTechnician: string;
  createdDate: string;
  status: TicketStatus;
  isCoveredUnderWarranty: boolean;
  partsReplaced?: string[];
  laborHoursRecorded?: number;
  customerConfirmedResolution: boolean;
  handedOffToFinance?: boolean;
}
