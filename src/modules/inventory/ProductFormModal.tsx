import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { ProductItem, ProductCategory } from './inventoryTypes';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<ProductItem>) => void;
  initialProduct?: ProductItem | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Solar Panels');
  const [sku, setSku] = useState('');
  const [unitCost, setUnitCost] = useState(120);
  const [stockQty, setStockQty] = useState(100);
  const [reorderThreshold, setReorderThreshold] = useState(30);
  const [warehouseLocation, setWarehouseLocation] = useState('Main Hub - Aisle 1');

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setSku(initialProduct.sku);
      setUnitCost(initialProduct.unitCost);
      setStockQty(initialProduct.stockQty);
      setReorderThreshold(initialProduct.reorderThreshold);
      setWarehouseLocation(initialProduct.warehouseLocation);
    } else {
      setName('');
      setCategory('Solar Panels');
      setSku('');
      setUnitCost(120);
      setStockQty(100);
      setReorderThreshold(30);
      setWarehouseLocation('Main Central Hub - Aisle 1');
    }
  }, [initialProduct, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(stockQty);
    const threshold = Number(reorderThreshold);
    let status: ProductItem['status'] = 'In Stock';
    if (qty <= threshold / 2) status = 'Critical / Reorder';
    else if (qty <= threshold) status = 'Low Stock';

    onSave({
      id: initialProduct?.id || `PRD-${Math.floor(100 + Math.random() * 900)}`,
      name,
      category,
      sku: sku.toUpperCase() || `SKU-${Date.now().toString().slice(-6)}`,
      unitCost: Number(unitCost),
      stockQty: qty,
      reservedQty: initialProduct?.reservedQty || 0,
      reorderThreshold: threshold,
      warehouseLocation,
      status,
    });
    onClose();
  };

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProduct ? 'Edit Catalogue Item' : 'Add Solar Equipment SKU'}
      subtitle="Register stock specifications, unit procurement cost, and warehouse storage aisle."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Product Item Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bifacial Mono 580W Solar Panel"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Component Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              SKU Identifier
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. SP-580-BIFI"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Unit Cost ($)
            </label>
            <input
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Physical Stock
            </label>
            <input
              type="number"
              value={stockQty}
              onChange={(e) => setStockQty(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#211D24] mb-1">
              Reorder Point
            </label>
            <input
              type="number"
              value={reorderThreshold}
              onChange={(e) => setReorderThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#211D24] mb-1">
            Warehouse Storage Location
          </label>
          <input
            type="text"
            value={warehouseLocation}
            onChange={(e) => setWarehouseLocation(e.target.value)}
            placeholder="e.g. Main Central Hub - High Bay 3"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] focus:outline-none focus:bg-white focus:border-[#80538F]"
          />
        </div>

        <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-[#E8E5EA]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#6F6874] hover:text-[#211D24] hover:bg-[#F2F0F4] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white shadow-subtle transition-all"
          >
            Save Catalogue SKU
          </button>
        </div>
      </form>
    </Modal>
  );
};
