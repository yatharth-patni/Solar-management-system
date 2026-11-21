export type WorkOrderStatus = 'Scheduled' | 'In Progress' | 'Submitted Review' | 'Completed';

export interface InstallationChecklist {
  dcIsolatorGrounded: boolean;
  mountingTorqueChecked: boolean;
  stringVocTested: boolean;
  inverterGridSyncPassed: boolean;
  acDisconnectLabeled: boolean;
  conduitSealingVerified: boolean;
}

export interface InstallationWorkOrder {
  id: string; // e.g. 'WO-8801'
  projectId: string;
  customerName: string;
  installationAddress: string;
  systemCapacityKw: number;
  assignedTechnicians: string[];
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  status: WorkOrderStatus;
  checklist: InstallationChecklist;
  testedVocVoltage: number; // e.g. 384 V
  earthResistanceOhms: number; // e.g. 2.4 Ohms (must be < 5)
  powerGenerationKw: number; // e.g. 5.8 kW
  photosUploaded: string[];
  customerSignatureCaptured: boolean;
  technicianNotes: string;
}
