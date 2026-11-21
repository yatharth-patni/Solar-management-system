export type ProductCategory = 
  | 'Solar Panels'
  | 'Inverters'
  | 'Batteries'
  | 'Charge Controllers'
  | 'Mounting Structures'
  | 'Switches & Breakers'
  | 'Wires & Connectors'
  | 'Safety Components';

export interface ProductItem {
  id: string; // e.g. 'PRD-101'
  name: string;
  category: ProductCategory;
  sku: string;
  unitCost: number; // in $
  stockQty: number;
  reservedQty: number; // reserved against active projects
  reorderThreshold: number;
  warehouseLocation: string;
  status: 'In Stock' | 'Low Stock' | 'Critical / Reorder';
}

export interface BomPackage {
  id: string; // e.g. 'BOM-5KW-ONGRID'
  name: string;
  capacityKw: number;
  systemType: 'On-Grid' | 'Off-Grid' | 'Hybrid';
  components: {
    productName: string;
    sku: string;
    quantity: number;
    unit: string;
  }[];
  totalEstimatedCost: number;
}

export interface WarehouseLocation {
  id: string;
  name: string;
  code: string;
  city: string;
  capacityUtilizationPercent: number;
  totalSkus: number;
  storageAisles: string[];
}

export interface StockDispatch {
  id: string; // e.g. 'DSP-401'
  orderId: string;
  projectId: string;
  customerName: string;
  deliveryAddress: string;
  warehouse: string;
  status: 'Picking' | 'Packed' | 'Dispatched' | 'Delivered';
  scheduledDispatchDate: string;
  serialNumbersCaptured: {
    equipment: string;
    serialNo: string;
  }[];
  courier: string;
}
