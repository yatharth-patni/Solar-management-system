import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { ProductFormModal } from './ProductFormModal';
import { SerialCaptureModal } from './SerialCaptureModal';
import { ProductItem, ProductCategory, BomPackage, WarehouseLocation, StockDispatch } from './inventoryTypes';
import { MOCK_PRODUCTS, MOCK_BOM_PACKAGES, MOCK_WAREHOUSES, MOCK_DISPATCHES } from './inventoryData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Plus, 
  Warehouse, 
  Edit3
} from 'lucide-react';

interface InventoryEngineProps {
  onShowToast: (msg: string) => void;
}

export const InventoryEngine: React.FC<InventoryEngineProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'bom' | 'warehouses' | 'dispatch'>('catalogue');
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);
  const [boms] = useState<BomPackage[]>(MOCK_BOM_PACKAGES);
  const [warehouses] = useState<WarehouseLocation[]>(MOCK_WAREHOUSES);
  const [dispatches, setDispatches] = useState<StockDispatch[]>(MOCK_DISPATCHES);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<ProductItem | null>(null);
  const [dispatchForSerials, setDispatchForSerials] = useState<StockDispatch | null>(null);

  const categories: ProductCategory[] = [
    'Solar Panels',
    'Inverters',
    'Batteries',
    'Charge Controllers',
    'Mounting Structures',
    'Switches & Breakers',
    'Wires & Connectors',
    'Safety Components',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.warehouseLocation.toLowerCase().includes(q);
      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [products, categoryFilter, statusFilter, searchQuery]);

  const handleSaveProduct = (prodData: Partial<ProductItem>) => {
    if (selectedProductForEdit) {
      setProducts(prev => prev.map(p => p.id === selectedProductForEdit.id ? { ...p, ...prodData } as ProductItem : p));
      onShowToast(`Equipment SKU "${prodData.name}" updated successfully.`);
    } else {
      setProducts(prev => [prodData as ProductItem, ...prev]);
      onShowToast(`New product "${prodData.name}" added to catalogue.`);
    }
    setSelectedProductForEdit(null);
  };

  const handleSaveSerials = (dispatchId: string, serials: { equipment: string; serialNo: string }[]) => {
    setDispatches(prev => prev.map(d => d.id === dispatchId ? { ...d, serialNumbersCaptured: serials } : d));
    onShowToast(`Hardware serial numbers successfully locked and linked to customer warranty registry.`);
  };

  const handleAdvanceDispatch = (dispatchId: string) => {
    setDispatches(prev => prev.map(d => {
      if (d.id === dispatchId) {
        const nextStatus = d.status === 'Picking' ? 'Packed' : d.status === 'Packed' ? 'Dispatched' : 'Delivered';
        return { ...d, status: nextStatus };
      }
      return d;
    }));
    onShowToast(`Order dispatch status advanced.`);
  };

  const productColumns = [
    {
      header: 'Product Name',
      cell: (p: ProductItem) => (
        <div>
          <p className="font-semibold text-[#211D24]">{p.name}</p>
          <span className="font-mono text-[10px] text-[#6F6874]">{p.sku}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category' as keyof ProductItem,
      cell: (p: ProductItem) => (
        <span className="text-[11px] font-medium text-[#80538F] bg-[#F1EAF5] px-2.5 py-0.5 rounded-full">
          {p.category}
        </span>
      ),
    },
    {
      header: 'Procurement Cost',
      align: 'right' as const,
      cell: (p: ProductItem) => (
        <span className="font-mono text-xs text-[#211D24]">${p.unitCost}</span>
      ),
    },
    {
      header: 'Available Stock',
      align: 'center' as const,
      cell: (p: ProductItem) => (
        <div>
          <span className="font-display font-bold text-sm text-[#211D24]">{p.stockQty}</span>
          <span className="text-[10px] text-[#6F6874] block">({p.stockQty - p.reservedQty} free)</span>
        </div>
      ),
    },
    {
      header: 'Reserved for Projects',
      align: 'center' as const,
      cell: (p: ProductItem) => (
        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
          {p.reservedQty} units
        </span>
      ),
    },
    {
      header: 'Location',
      accessor: 'warehouseLocation' as keyof ProductItem,
      cell: (p: ProductItem) => (
        <span className="text-xs text-[#6F6874]">{p.warehouseLocation}</span>
      ),
    },
    {
      header: 'Stock Status',
      cell: (p: ProductItem) => (
        <StatusBadge 
          status={p.status === 'In Stock' ? 'Success' : p.status === 'Low Stock' ? 'Warning' : 'Blocked'} 
          customLabel={p.status}
          size="sm" 
        />
      ),
    },
    {
      header: 'Actions',
      align: 'right' as const,
      cell: (p: ProductItem) => (
        <button
          type="button"
          onClick={() => setSelectedProductForEdit(p)}
          className="p-1.5 rounded-lg text-[#6F6874] hover:text-[#80538F] hover:bg-[#F1EAF5] transition-colors"
          title="Edit SKU"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Inventory Management"
      scriptTagline="Hardware catalogue, bill of materials & warehouse dispatch"
      description="Supervise solar panels, inverters, LiFePO4 batteries, racking rails, warehouse bin stock allocations, and equipment serial tracking."
      breadcrumbs={getBreadcrumbs('inventory')}
      actions={
        <button
          type="button"
          onClick={() => setIsProductModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#80538F] hover:bg-[#693F77] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>Add Equipment SKU</span>
        </button>
      }
      kpiStats={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Total Stock Value</p>
            <p className="font-display font-extrabold text-2xl text-[#211D24] mt-0.5">$318,400</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Reserved for Projects</p>
            <p className="font-display font-extrabold text-2xl text-amber-700 mt-0.5">377 units</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Active Warehouses</p>
            <p className="font-display font-extrabold text-2xl text-[#80538F] mt-0.5">3 facilities</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Pending Dispatches</p>
            <p className="font-display font-extrabold text-2xl text-[#211D24] mt-0.5">{dispatches.length}</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Sub-Tabs Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#E8E5EA] pb-3">
          {[
            { id: 'catalogue', label: 'Product Catalogue', count: products.length },
            { id: 'bom', label: 'Bill of Materials (BOM)', count: boms.length },
            { id: 'warehouses', label: 'Warehouses & Yards', count: warehouses.length },
            { id: 'dispatch', label: 'Order Dispatches & Serials', count: dispatches.length },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#80538F] text-white shadow-subtle'
                  : 'text-[#6F6874] hover:text-[#211D24] hover:bg-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#E8E5EA] text-[#6F6874]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB 1: Product Catalogue */}
        {activeTab === 'catalogue' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8E5EA] shadow-subtle">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search products by title, SKU, or warehouse aisle..."
                className="w-full sm:w-80"
              />

              <div className="flex items-center space-x-2.5">
                <FilterDropdown
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    { label: 'All Categories', value: 'All' },
                    ...categories.map(c => ({ label: c, value: c }))
                  ]}
                />

                <FilterDropdown
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { label: 'All Stock Statuses', value: 'All' },
                    { label: 'In Stock', value: 'In Stock' },
                    { label: 'Low Stock', value: 'Low Stock' },
                    { label: 'Critical / Reorder', value: 'Critical / Reorder' },
                  ]}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8E5EA] bg-white shadow-subtle overflow-hidden">
              <DataTable
                columns={productColumns}
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                emptyTitle="No equipment SKU matched"
                emptyDescription="Try clearing filters or adding the product."
              />
            </div>
          </div>
        )}

        {/* TAB 2: Bill of Materials (BOM) */}
        {activeTab === 'bom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boms.map((bom) => (
              <div
                key={bom.id}
                className="p-6 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-[#80538F] bg-[#F1EAF5] px-2.5 py-0.5 rounded-full">
                      {bom.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF9FB] border border-[#E8E5EA] text-[#211D24]">
                      {bom.systemType} Architecture
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-[#211D24]">
                      {bom.name}
                    </h3>
                    <p className="text-xs text-[#6F6874]">{bom.capacityKw} kW Nameplate DC Rating</p>
                  </div>

                  {/* Component Table */}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-[#6F6874] uppercase tracking-wider mb-1.5 font-display">
                      Required Hardware Components
                    </p>
                    <div className="space-y-1.5 border border-[#E8E5EA] rounded-xl p-3 bg-[#FAF9FB]">
                      {bom.components.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-0.5 border-b border-[#E8E5EA]/60 last:border-b-0">
                          <span className="text-[#211D24] font-medium">{c.productName}</span>
                          <span className="font-semibold text-[#80538F]">
                            {c.quantity} {c.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E5EA] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6F6874] block">Hardware Bill Cost</span>
                    <span className="font-display font-bold text-base text-[#211D24]">
                      ${bom.totalEstimatedCost.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onShowToast(`Allocated BOM components for ${bom.name} into staging reserve.`)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white shadow-subtle transition-all"
                  >
                    Allocate to Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Warehouse Management */}
        {activeTab === 'warehouses' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warehouses.map((wh) => (
              <div
                key={wh.id}
                className="p-6 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F1EAF5] text-[#80538F] flex items-center justify-center">
                    <Warehouse className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#211D24] bg-[#F7F6F8] px-2 py-0.5 rounded border border-[#E8E5EA]">
                    {wh.code}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-[#211D24]">
                    {wh.name}
                  </h3>
                  <p className="text-xs text-[#6F6874]">{wh.city}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6F6874]">Capacity Used:</span>
                    <span className="font-semibold text-[#211D24]">{wh.capacityUtilizationPercent}%</span>
                  </div>
                  <div className="w-full bg-[#E8E5EA] h-1.5 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${wh.capacityUtilizationPercent}%` }}
                      className={`h-full ${wh.capacityUtilizationPercent > 80 ? 'bg-amber-500' : 'bg-[#80538F]'}`}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E5EA]">
                  <p className="text-[10px] font-bold text-[#6F6874] uppercase tracking-wider mb-1 font-display">
                    Storage Zones & Aisles
                  </p>
                  <ul className="text-xs text-[#6F6874] space-y-1">
                    {wh.storageAisles.map((a, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#80538F]" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Dispatch Management & Serial Link */}
        {activeTab === 'dispatch' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E8E5EA] bg-white shadow-subtle overflow-hidden">
              <DataTable
                columns={[
                  {
                    header: 'Dispatch ID',
                    accessor: 'id' as keyof StockDispatch,
                    cell: (d: StockDispatch) => (
                      <span className="font-mono text-xs font-semibold text-[#80538F]">{d.id}</span>
                    ),
                  },
                  {
                    header: 'Project / Customer',
                    cell: (d: StockDispatch) => (
                      <div>
                        <p className="font-semibold text-[#211D24]">{d.customerName}</p>
                        <span className="font-mono text-[10px] text-[#6F6874]">{d.projectId}</span>
                      </div>
                    ),
                  },
                  {
                    header: 'Fulfillment Origin',
                    accessor: 'warehouse' as keyof StockDispatch,
                    cell: (d: StockDispatch) => (
                      <span className="text-xs text-[#211D24]">{d.warehouse}</span>
                    ),
                  },
                  {
                    header: 'Serial Numbers',
                    cell: (d: StockDispatch) => (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {d.serialNumbersCaptured.length} units captured
                        </span>
                        <button
                          type="button"
                          onClick={() => setDispatchForSerials(d)}
                          className="text-[11px] text-[#80538F] hover:underline font-semibold"
                        >
                          View / Link
                        </button>
                      </div>
                    ),
                  },
                  {
                    header: 'Dispatch Status',
                    cell: (d: StockDispatch) => (
                      <StatusBadge 
                        status={d.status === 'Delivered' ? 'Success' : d.status === 'Dispatched' ? 'Pro' : 'Pending'} 
                        customLabel={d.status}
                        size="sm" 
                      />
                    ),
                  },
                  {
                    header: 'Actions',
                    align: 'right' as const,
                    cell: (d: StockDispatch) => (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setDispatchForSerials(d)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium border border-[#E8E5EA] text-[#211D24] hover:bg-[#F7F6F8] transition-colors"
                        >
                          Scan Serials
                        </button>
                        {d.status !== 'Delivered' && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceDispatch(d.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white transition-colors"
                          >
                            Advance
                          </button>
                        )}
                      </div>
                    ),
                  },
                ]}
                data={dispatches}
                keyExtractor={(item) => item.id}
              />
            </div>
          </div>
        )}

      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen || Boolean(selectedProductForEdit)}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProductForEdit(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={selectedProductForEdit}
      />

      {/* Serial Numbers Capture Modal */}
      <SerialCaptureModal
        isOpen={Boolean(dispatchForSerials)}
        onClose={() => setDispatchForSerials(null)}
        dispatchRecord={dispatchForSerials}
        onSaveSerials={handleSaveSerials}
      />
    </PageLayout>
  );
};
