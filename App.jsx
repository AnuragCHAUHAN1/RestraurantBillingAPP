import React, { useState, useEffect, useMemo } from 'react';
import { Printer, Plus, Minus, Utensils, Coffee, X, ShoppingBag, MapPin, Phone, Monitor, Star, Code, Delete, Check, LayoutList, Receipt } from 'lucide-react';

// --- CSS for hiding scrollbars & Print ---
const ScrollbarStyles = () => (
  <style>{`
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    /* Hide number input arrows */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    /* Safe area for mobile bottom nav */
    .pb-safe {
        padding-bottom: env(safe-area-inset-bottom);
    }
    @media print {
      @page { margin: 0; }
      body { margin: 0; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  `}</style>
);

// --- Menu Data Configuration ---
const MENU_ITEMS = [
  { id: 21, name: 'Water Bottle', category: 'Sides', type: 'veg', prices: { single: 20 } },
  { id: 1, name: 'Khur (Paya)', category: 'Main Course', type: 'non-veg', prices: { full: 300, half: 180 } },
  { id: 2, name: 'Mutton', category: 'Main Course', type: 'non-veg', prices: { full: 300, half: 180 } },
  { id: 3, name: 'Chicken', category: 'Main Course', type: 'non-veg', prices: { full: 250, half: 150 } },
  { id: 4, name: 'Kheema', category: 'Main Course', type: 'non-veg', prices: { full: 300, half: 180 } },
  { id: 6, name: 'Sundari', category: 'Main Course', type: 'non-veg', prices: { full: 180, half: 100 } },
  { id: 7, name: 'Sundari Fry', category: 'Main Course', type: 'non-veg', prices: { full: 200, half: 120 } },
  { id: 8, name: 'Egg Curry', category: 'Main Course', type: 'non-veg', prices: { full: 120, half: 80 } },
  { id: 9, name: 'Egg Curry Fry', category: 'Main Course', type: 'non-veg', prices: { single: 150 } }, 
  { id: 10, name: 'Dal Fry', category: 'Main Course', type: 'veg', prices: { full: 150, half: 80 } },
  { id: 11, name: 'Dal Tadka', category: 'Main Course', type: 'veg', prices: { full: 170, half: 90 } },
  { id: 20, name: 'Special Order (1 Kg)', category: 'Main Course', type: 'non-veg', prices: { single: 400 } },
  { id: 12, name: 'Plain Rice', category: 'Rice', type: 'veg', prices: { full: 80, half: 40 } },
  { id: 13, name: 'Jeera Rice', category: 'Rice', type: 'veg', prices: { full: 100, half: 50 } },
  { id: 14, name: 'Garlic Rice', category: 'Rice', type: 'veg', prices: { full: 120, half: 60 } },
  { id: 15, name: 'Boiled Egg', category: 'Sides', type: 'non-veg', prices: { full: 40, half: 20 } },
  { id: 16, name: 'Boiled Egg Fry', category: 'Sides', type: 'non-veg', prices: { single: 50 } },
  { id: 17, name: 'Roti', category: 'Breads', type: 'veg', prices: { single: 10 } },
  { id: 18, name: 'Papad', category: 'Sides', type: 'veg', prices: { single: 20 } },
  { id: 19, name: 'Gravy', category: 'Sides', type: 'veg', prices: { single: 30 } },
];

const CATEGORIES = ['All', 'Main Course', 'Rice', 'Breads', 'Sides'];
const DINING_TABLE_IDS = ['1', '2', '4', '5', '6', '6.1', '6.2', '7', '8', '9', '10', '11', '11.1', '11.2'];

const getTodayKey = () => {
  const d = new Date();
  return `ravi_sales_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

// --- 1. Number Pad Modal Component (Top Level) ---
const NumberPadModal = ({ isOpen, onClose, onConfirm, initialValue, itemName }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue !== undefined && initialValue !== null ? String(initialValue) : '');
      if (initialValue === 0) setValue(''); 
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleNumClick = (num) => setValue(prev => prev + num);
  const handleBackspace = () => setValue(prev => prev.slice(0, -1));
  const handleClear = () => setValue('');
  
  const handleAdd = () => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) onConfirm(num);
    onClose();
  };

  const handleRemove = () => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) onConfirm(-num); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
          <div>
            <div className="text-xs opacity-80 font-bold uppercase tracking-wider">Edit Quantity</div>
            <div className="text-lg font-black leading-none truncate w-48">{itemName}</div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <div className="bg-gray-100 p-4 border-b border-gray-200">
          <div className="bg-white border-2 border-orange-200 rounded-xl h-16 flex items-center justify-center text-4xl font-black text-gray-800 shadow-inner">
            {value || '0'}
          </div>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3 bg-gray-50">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleNumClick(num)} className="aspect-square rounded-xl bg-white border-b-4 border-gray-200 text-2xl font-bold text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 active:scale-95 active:border-b-0 active:translate-y-1 transition-all shadow-sm">{num}</button>
          ))}
          <button onClick={handleClear} className="aspect-square rounded-xl bg-blue-50 border-b-4 border-blue-200 text-lg font-bold text-blue-600 hover:bg-blue-100 active:scale-95 active:border-b-0 active:translate-y-1 transition-all shadow-sm flex flex-col items-center justify-center">CLR</button>
          <button onClick={() => handleNumClick(0)} className="aspect-square rounded-xl bg-white border-b-4 border-gray-200 text-2xl font-bold text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 active:scale-95 active:border-b-0 active:translate-y-1 transition-all shadow-sm">0</button>
          <button onClick={handleBackspace} className="aspect-square rounded-xl bg-gray-200 border-b-4 border-gray-300 text-gray-600 hover:bg-gray-300 active:scale-95 active:border-b-0 active:translate-y-1 transition-all shadow-sm flex items-center justify-center"><Delete size={24} /></button>
        </div>
        <div className="p-4 pt-0 bg-gray-50 flex gap-3">
          <button onClick={handleRemove} className="flex-1 py-4 bg-red-100 text-red-600 rounded-xl font-black text-lg hover:bg-red-200 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1 border border-red-200">
            <Minus size={20} strokeWidth={3} /> REMOVE
          </button>
          <button onClick={handleAdd} className="flex-1 py-4 bg-green-600 text-white rounded-xl font-black text-lg hover:bg-green-700 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-1 border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
            <Plus size={20} strokeWidth={3} /> ADD
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. MenuCard Component (Top Level) ---
const MenuCard = ({ item, onAdd, onOpenNumpad }) => {
  const openBulkNumpad = () => {
    onOpenNumpad(item.name, 0, (addedQty) => {
        onAdd(item, 'Single', item.prices.single, addedQty);
    });
  };
  const isBulkItem = item.id === 17; 

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col group h-full">
      <div className="p-4 border-b border-gray-50 flex justify-between items-start bg-gradient-to-br from-white to-gray-50">
        <div>
            <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-orange-600 transition-colors">{item.name}</h3>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">{item.category}</span>
        </div>
        <div className={`w-3 h-3 rounded-full mt-1 shadow-sm ${item.type === 'non-veg' ? 'bg-red-500 border border-red-200' : 'bg-green-500 border border-green-200'}`} title={item.type} />
      </div>
      <div className="p-3 flex gap-2 mt-auto bg-white">
        {item.prices.full ? (
          <>
            <button onClick={() => onAdd(item, 'Half', item.prices.half, 1)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 active:scale-95 transition-all">
              Half <div className="text-xs font-normal text-gray-500">₹{item.prices.half}</div>
            </button>
            <button onClick={() => onAdd(item, 'Full', item.prices.full, 1)} className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 shadow-md shadow-orange-100 active:scale-95 transition-all">
              Full <div className="text-xs font-normal text-orange-100">₹{item.prices.full}</div>
            </button>
          </>
        ) : (
          isBulkItem ? (
             <div className="flex flex-col w-full gap-2">
                <button 
                  onClick={openBulkNumpad} 
                  className="w-full bg-white border-2 border-orange-100 text-orange-600 py-2 rounded-lg text-sm font-bold hover:bg-orange-50 hover:border-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Monitor size={16} /> QTY
                </button>
                <button 
                  onClick={() => onAdd(item, 'Single', item.prices.single, 1)} 
                  className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 shadow-md shadow-orange-100 active:scale-95 transition-all flex justify-between px-4 items-center"
                >
                  <span>ADD 1</span><span className="bg-orange-600/30 px-2 rounded">₹{item.prices.single}</span>
                </button>
             </div>
          ) : (
            <button onClick={() => onAdd(item, 'Plate', item.prices.single, 1)} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 shadow-md shadow-orange-100 active:scale-95 transition-all flex justify-between px-4 items-center">
              <span>Add to Bill</span><span className="bg-orange-600/30 px-2 rounded">₹{item.prices.single}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

// --- 3. SidebarTableList Component ---
const SidebarTableList = ({ tables, activeTableId, setActiveTableId }) => {
    const parcelData = tables['PARCEL'];
    const parcelActiveCount = parcelData.bills.filter(b => b.items.length > 0).length;
    const isParcelActive = activeTableId === 'PARCEL';
    const specialData = tables['SPECIAL'];
    const specialActiveCount = specialData.bills.filter(b => b.items.length > 0).length;
    const isSpecialActive = activeTableId === 'SPECIAL';
    const tableKeys = DINING_TABLE_IDS;

    return (
        <div className="w-full bg-white border-r border-gray-200 flex flex-col items-center py-4 h-full shadow-lg z-10 shrink-0">
            <div className="w-full px-4 mb-4 overflow-y-auto no-scrollbar">
                 <button onClick={() => setActiveTableId('PARCEL')} className={`w-full h-20 rounded-xl flex items-center justify-between px-6 transition-all duration-200 border-2 mb-3 relative overflow-hidden group shadow-xl ${isParcelActive ? 'bg-purple-200 border-purple-500 ring-4 ring-purple-100 text-purple-900' : parcelActiveCount > 0 ? 'bg-purple-100 border-purple-500 text-purple-800 hover:bg-purple-300' : 'bg-purple-100 border-purple-500 text-purple-800 hover:bg-purple-300'}`}>
                    <ShoppingBag size={80} className="absolute inset-0 text-purple-800/10 transform scale-125 flex items-center justify-center pointer-events-none mx-auto my-auto rotate-12" />
                    <div className="flex flex-col items-start z-10">
                        <span className="text-lg font-black tracking-tight flex items-center gap-2">PARCEL <ShoppingBag size={18} className="group-hover:-translate-y-1 transition-transform duration-300" /></span>
                        <span className="text-[10px] font-medium opacity-80 mt-0.5">{parcelActiveCount > 0 ? `${parcelActiveCount} Active Orders` : 'Takeout / Delivery'}</span>
                    </div>
                </button>
                 <button onClick={() => setActiveTableId('SPECIAL')} className={`w-full h-20 rounded-xl flex items-center justify-between px-6 transition-all duration-200 border-2 mb-6 relative overflow-hidden group shadow-xl ${isSpecialActive ? 'bg-red-200 border-red-500 ring-4 ring-red-100 text-red-900' : specialActiveCount > 0 ? 'bg-red-100 border-red-500 text-red-800' : 'bg-red-100 border-red-500 text-red-800 hover:bg-red-200'}`}>
                    <Star size={80} className="absolute inset-0 text-red-800/10 transform scale-125 flex items-center justify-center pointer-events-none mx-auto my-auto -rotate-12" />
                    <div className="flex flex-col items-start z-10">
                        <span className="text-lg font-black tracking-tight flex items-center gap-2">SPECIAL <Star size={18} className="group-hover:rotate-180 transition-transform duration-500" /></span>
                        <span className="text-[10px] font-bold opacity-80 mt-0.5 bg-white/30 px-1.5 py-0.5 rounded">Auto-Add: 400/-</span>
                    </div>
                </button>
                <div className="text-xs font-bold text-gray-400 mb-2 pl-1">DINING TABLES</div>
                <div className="grid grid-cols-3 gap-3 w-full pb-4">
                    {tableKeys.map(id => {
                        const currentTable = tables[id];
                        const activeBillCount = currentTable.bills.filter(b => b.items.length > 0).length;
                        const isOccupied = activeBillCount > 0;
                        const isActive = String(id) === String(activeTableId);
                        const fontSizeClass = id.length > 2 ? 'text-xl' : 'text-2xl';
                        return (
                            <button key={id} onClick={() => setActiveTableId(id)} className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 border relative overflow-hidden ${isActive ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200 text-blue-700 shadow-md transform scale-105 z-10' : isOccupied ? 'bg-red-50 border-red-300 text-red-800 hover:bg-red-100' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100 hover:border-gray-300'}`}>
                                <span className={`${fontSizeClass} font-black ${isActive ? 'text-blue-700' : isOccupied ? 'text-red-800' : 'text-gray-500'}`}>{id}</span>
                                {isOccupied ? (<div className="text-[10px] font-black text-red-700 mt-1 uppercase tracking-wider bg-red-200 px-1 rounded">BUSY</div>) : (<div className="text-[10px] font-medium text-gray-500 mt-1 uppercase tracking-wider">EMPTY</div>)}
                            </button>
                        )
                    })}
                </div>
            </div>
            {/* UPDATED CREDIT SECTION: MORE PADDING & MARGIN */}
            <div className="mt-auto w-full px-2 py-4 border-y-4 border-gray-900 bg-blue-50 relative overflow-hidden group mb-1"> 
                <Code size={120} className="absolute inset-0 text-blue-200/50 transform scale-125 flex items-center justify-center pointer-events-none mx-auto my-auto rotate-12 transition-transform duration-700 ease-in-out group-hover:rotate-45 group-hover:scale-150" />
                <div className="flex flex-col items-center text-center opacity-100 z-10 relative">
                    <Monitor size={14} className="mb-1 text-orange-600 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1" />
                    <p className="text-[10px] uppercase font-extrabold text-blue-900 leading-none tracking-wider">SOFTWARE BY</p>
                    <p className="text-sm font-black text-blue-900 leading-tight my-0.5">ANURAG CHAUHAN</p>
                    <p className="text-xs font-bold text-blue-800">+91 8668262217</p>
                </div>
            </div>
        </div>
    );
};

// --- 4. SalesReportSummary Component ---
const SalesReportSummary = ({ totalRevenue, totalBills, onClearSales }) => {
    return (
        <div className="bg-white p-3 m-2 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Today's Sales</p>
                    <h3 className="text-2xl font-black text-gray-800 leading-none">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-600">{totalBills} Bills</p>
                </div>
            </div>
             <button onClick={onClearSales} disabled={totalBills === 0} className="w-full py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><X size={12} /> Clear History</button>
        </div>
    );
};

// --- 5. BillPanel Component ---
const BillPanel = ({ 
    tables, activeTableId, switchActiveBill, addNewBillToTable, updateQuantity, calculateTotal, setShowReceipt, onOpenNumpad, 
    totalRevenue, totalBills, onClearSales 
}) => {
    const currentTable = tables[activeTableId];
    const bills = currentTable.bills;
    const activeBill = currentTable.activeBillIndex >= 0 ? bills[currentTable.activeBillIndex] : { items: [] };
    const currentOrder = activeBill.items || [];
    const total = calculateTotal(currentOrder);
    
    let themeClass = 'bg-orange-100 text-orange-600';
    let bgTheme = 'bg-white';
    let textTheme = 'text-gray-800';
    let buttonTheme = 'bg-gray-900 hover:bg-black';
    let borderTheme = 'border-gray-200';
    let displayLabel = `Table ${activeTableId}`;
    let headerIcon = <Utensils size={18} />;

    if (activeTableId === 'PARCEL') {
        displayLabel = 'Parcel Order';
        headerIcon = <ShoppingBag size={18} />;
        themeClass = 'bg-purple-200 text-purple-800';
        bgTheme = 'bg-purple-50';
        textTheme = 'text-purple-900';
        buttonTheme = 'bg-purple-600 hover:bg-purple-700 shadow-purple-200 group'; 
        borderTheme = 'border-purple-200';
    } else if (activeTableId === 'SPECIAL') {
        displayLabel = 'Special Order';
        headerIcon = <Star size={18} />;
        themeClass = 'bg-red-200 text-red-800';
        bgTheme = 'bg-red-50';
        textTheme = 'text-red-900';
        buttonTheme = 'bg-red-600 hover:bg-red-700 shadow-red-200 group';
        borderTheme = 'border-red-200';
    } else {
        bgTheme = 'bg-white';
        textTheme = 'text-gray-800';
        buttonTheme = 'bg-orange-600 hover:bg-orange-700 shadow-orange-200 group';
    }

    return (
      <div className={`w-full border-l ${borderTheme} flex flex-col h-full shadow-2xl z-20 ${bgTheme}`}>
        <SalesReportSummary totalRevenue={totalRevenue} totalBills={totalBills} onClearSales={onClearSales} />
        
        <div className={`border-b ${borderTheme} shadow-sm`}>
            <div className={`p-4 flex justify-between items-center ${bgTheme}`}>
                <h2 className={`font-bold text-xl flex items-center gap-2 ${textTheme}`}>
                    <div className={`p-1.5 rounded-lg ${themeClass}`}>{headerIcon}</div>
                    {displayLabel}
                </h2>
                <span className="text-xs font-bold text-gray-500">Grp: {bills.length}</span>
            </div>
            <div className="flex px-2 gap-1 overflow-x-auto no-scrollbar">
                {bills.map((bill, idx) => (
                    <button key={bill.id} onClick={() => switchActiveBill(idx)} className={`px-4 py-2 rounded-t-lg text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${idx === currentTable.activeBillIndex ? `border-current ${textTheme} bg-white/50` : 'border-transparent text-gray-400 hover:bg-white/30'}`}>
                        {activeTableId === 'PARCEL' || activeTableId === 'SPECIAL' ? '#' : ''}{bill.id}
                    </button>
                ))}
                <button onClick={addNewBillToTable} className="px-3 py-2 text-gray-400 hover:text-gray-600"><Plus size={16}/></button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentOrder.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70">
                    <Coffee size={48} className="mb-4 stroke-1" />
                    <p className="font-medium">Empty Bill</p>
                    {activeTableId === 'SPECIAL' && <p className="text-xs text-red-500 font-bold mt-2">Auto-added Special Item</p>}
                </div>
            ) : (
                currentOrder.map((item, idx) => (
                    <div key={`${item.id}-${item.variant}`} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div className="flex-1">
                            <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{item.variant !== 'Plate' && item.variant !== 'Single' && item.variant} • ₹{item.price}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(idx, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:text-red-500"><Minus size={12} /></button>
                            <button 
                                onClick={() => onOpenNumpad(
                                    item.name,
                                    0, 
                                    (addedQty) => {
                                        updateQuantity(idx, addedQty);
                                    }
                                )} 
                                className="font-bold text-sm min-w-[2rem] text-center border-b border-dashed border-gray-400 hover:bg-gray-100 hover:text-orange-600 transition-colors"
                                title="Click to add more"
                            >
                                {item.quantity}
                            </button>
                            <button onClick={() => updateQuantity(idx, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:text-green-500"><Plus size={12} /></button>
                        </div>
                        <div className="w-14 text-right font-bold text-gray-700">₹{item.totalPrice}</div>
                    </div>
                ))
            )}
        </div>
        <div className={`p-4 border-t ${borderTheme} bg-white/50`}>
            <div className="flex justify-between items-end mb-4">
                <span className="text-gray-500 font-medium text-sm">Total Amount</span>
                <span className={`font-black text-3xl ${textTheme}`}>₹{total}</span>
            </div>
            <button onClick={() => setShowReceipt(true)} disabled={currentOrder.length === 0} className={`w-full flex items-center justify-center gap-2 px-4 py-4 text-white rounded-xl shadow-lg font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${buttonTheme}`}>
                <Printer size={20} className="transition-transform duration-300 group-hover:rotate-12" /> Checkout
            </button>
        </div>
      </div>
    );
};

// --- 6. ReceiptModal Component ---
const ReceiptModal = ({ show, onClose, onPrint, billData }) => {
    if (!show) return null;
    const { items, total, title } = billData;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm print:p-0 print:bg-white print:static">
            <div className="bg-white w-[350px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col print:w-full print:shadow-none print:max-h-none print:rounded-none">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 print:hidden">
                    <span className="font-bold text-gray-700">Print Preview</span>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X size={20} /></button>
                </div>
                <div className="p-8 text-sm font-mono text-gray-900 bg-white" id="printable-receipt">
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 mx-auto mb-2 overflow-hidden flex items-center justify-center">
                             <img src="./logo.jpg" alt="RSB Logo" className="w-full h-full object-contain" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', display: 'block' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                             <div className="hidden w-full h-full items-center justify-center bg-gray-50 rounded-full"><Utensils size={40} className="text-gray-400" /></div>
                        </div>
                        <h1 style={{ fontFamily: '"Baskerville Old Face", serif' }} className="text-3xl font-bold uppercase tracking-wider mb-0 leading-none text-black">Ravi Saoji</h1>
                        <h2 style={{ fontFamily: '"Baskerville Old Face", serif' }} className="text-3xl font-bold uppercase tracking-wider mb-2 text-black">Bhojnalay</h2>
                        <div className="text-[10px] text-gray-600 font-medium leading-tight mb-2 px-4">Omkar Nagar Road, Manewada Ring Rd,<br/>Nagpur, Maharashtra 440027</div>
                        <div className="text-xs font-bold text-gray-800 flex items-center justify-center gap-1"><Phone size={10} /> 098602 08682 / 72765 42388</div>
                        <div className="border-b-2 border-dashed border-gray-300 my-4"></div>
                        <div className="flex justify-between text-xs font-bold uppercase"><span>{title}</span><span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                        <div className="text-left text-xs text-gray-500 mt-1">{new Date().toLocaleDateString()}</div>
                    </div>
                    <div className="flex flex-col gap-1 mb-4">
                        <div className="flex font-bold border-b-2 border-black pb-1 mb-2"><span className="flex-1 text-left">ITEM</span><span className="w-8 text-center">QTY</span><span className="w-12 text-right">AMT</span></div>
                        {items.map((item, idx) => (
                            <div key={idx} className="flex py-0.5"><span className="flex-1 text-left truncate pr-2">{item.name} {item.variant !== 'Plate' && item.variant !== 'Single' && <span className="text-[10px] ml-1 text-gray-600">({item.variant})</span>}</span><span className="w-8 text-center">{item.quantity}</span><span className="w-12 text-right">{item.totalPrice}</span></div>
                        ))}
                    </div>
                    <div className="border-t-2 border-dashed border-gray-300 pt-3 mb-8"><div className="flex justify-between text-xl font-bold"><span>TOTAL</span><span>₹{total}</span></div></div>
                    <div className="text-center text-xs space-y-1"><p>THANK YOU! VISIT AGAIN</p></div>
                </div>
                <div className="p-4 border-t bg-gray-50 print:hidden space-y-2">
                    <button onClick={onPrint} className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 shadow-lg flex items-center justify-center gap-2"><Printer size={18} /> Print & Close Bill</button>
                </div>
            </div>
        </div>
    );
};

// --- 7. Main Application Component (Modified for Mobile Tabs & Landscape) ---
const BillingApp = () => {
  // State
  const [tables, setTables] = useState(() => {
    const initialTables = {};
    initialTables['PARCEL'] = { bills: [{ id: '1', items: [] }], activeBillIndex: 0 };
    initialTables['SPECIAL'] = { bills: [{ id: '1', items: [] }], activeBillIndex: 0 };
    DINING_TABLE_IDS.forEach(id => {
      initialTables[id] = { bills: [{ id: 'A', items: [] }], activeBillIndex: 0 };
    });
    try {
      const savedData = localStorage.getItem('ravi_current_tables');
      if (savedData) return { ...initialTables, ...JSON.parse(savedData) };
    } catch (error) {
      console.error("Error loading saved tables state:", error);
    }
    return initialTables;
  });

  const [activeTableId, setActiveTableId] = useState('PARCEL'); 
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showReceipt, setShowReceipt] = useState(false);
  const [dailySales, setDailySales] = useState([]);
  const todayKey = useMemo(getTodayKey, []);
  
  // [NEW] Mobile Tab State
  const [mobileTab, setMobileTab] = useState('menu'); // 'tables', 'menu', 'bill'
  
  const [numpadConfig, setNumpadConfig] = useState({
    isOpen: false,
    initialQty: 0,
    itemName: '',
    onConfirm: () => {}
  });

  const openNumpad = (itemName, currentQty, callback) => {
    setNumpadConfig({
        isOpen: true,
        itemName: itemName,
        initialQty: currentQty,
        onConfirm: callback
    });
  };

  useEffect(() => { localStorage.setItem('ravi_current_tables', JSON.stringify(tables)); }, [tables]);
  useEffect(() => {
    const storedData = localStorage.getItem(todayKey);
    if (storedData) { try { setDailySales(JSON.parse(storedData)); } catch (error) { setDailySales([]); } }
  }, [todayKey]);
  useEffect(() => {
    if (dailySales.length > 0) { localStorage.setItem(todayKey, JSON.stringify(dailySales)); } 
    else if (localStorage.getItem(todayKey) && dailySales.length === 0) { localStorage.removeItem(todayKey); }
  }, [dailySales, todayKey]);

  const addNewBillToTable = () => {
    setTables(prev => {
      const currentTable = prev[activeTableId];
      const isNamedZone = activeTableId === 'PARCEL' || activeTableId === 'SPECIAL';
      const nextId = isNamedZone ? String(currentTable.bills.length + 1) : String.fromCharCode(65 + currentTable.bills.length); 
      return { ...prev, [activeTableId]: { ...currentTable, bills: [...currentTable.bills, { id: nextId, items: [] }], activeBillIndex: currentTable.bills.length } };
    });
  };

  const switchActiveBill = (index) => {
    setTables(prev => ({ ...prev, [activeTableId]: { ...prev[activeTableId], activeBillIndex: index } }));
  };

  const handleTableSwitch = (newId) => {
      setActiveTableId(newId);
      if (newId === 'SPECIAL') {
        setTables(prev => {
            const table = prev['SPECIAL'];
            if (table.bills[table.activeBillIndex].items.length === 0) {
                const specialItem = MENU_ITEMS.find(i => i.id === 20);
                const newItem = { id: specialItem.id, name: specialItem.name, variant: 'Single', price: specialItem.prices.single, quantity: 1, totalPrice: specialItem.prices.single };
                const newBills = [...table.bills];
                newBills[table.activeBillIndex] = { ...table.bills[table.activeBillIndex], items: [newItem] };
                return { ...prev, ['SPECIAL']: { ...table, bills: newBills } };
            }
            return prev;
        });
      }
  };

  const addItemToTable = (item, variant, price, qty = 1) => {
    setTables(prev => {
      const currentTable = prev[activeTableId];
      const activeBillIndex = currentTable.activeBillIndex;
      let newItems = [...currentTable.bills[activeBillIndex].items];
      const existingItemIndex = newItems.findIndex(i => i.id === item.id && i.variant === variant);

      if (existingItemIndex > -1) {
        const newQty = newItems[existingItemIndex].quantity + qty;
        if (newQty <= 0) {
             newItems.splice(existingItemIndex, 1);
        } else {
             newItems[existingItemIndex] = { ...newItems[existingItemIndex], quantity: newQty, totalPrice: newQty * price };
        }
      } else {
        if (qty > 0) {
            newItems.push({ id: item.id, name: item.name, variant: variant, price: price, quantity: qty, totalPrice: price * qty });
        }
      }
      const newBills = [...currentTable.bills];
      newBills[activeBillIndex] = { ...currentTable.bills[activeBillIndex], items: newItems };
      return { ...prev, [activeTableId]: { ...currentTable, bills: newBills } };
    });
  };

  const updateQuantity = (itemIndex, delta) => {
    setTables(prev => {
      const currentTable = prev[activeTableId];
      const activeBillIndex = currentTable.activeBillIndex;
      let newItems = [...currentTable.bills[activeBillIndex].items];
      const item = { ...newItems[itemIndex] };
      item.quantity += delta;
      item.totalPrice = item.quantity * item.price;
      if (item.quantity <= 0) newItems.splice(itemIndex, 1);
      else newItems[itemIndex] = item;
      const newBills = [...currentTable.bills];
      newBills[activeBillIndex] = { ...currentTable.bills[activeBillIndex], items: newItems };
      return { ...prev, [activeTableId]: { ...currentTable, bills: newBills } };
    });
  };

  const calculateTotal = (items) => items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handlePrintAndClose = () => {
    const currentTable = tables[activeTableId];
    const activeBill = currentTable.bills[currentTable.activeBillIndex];
    const total = calculateTotal(activeBill.items);
    const orderType = activeTableId === 'PARCEL' ? 'Parcel' : activeTableId === 'SPECIAL' ? 'Special' : 'Dine-In';

    if (total > 0) {
        const saleRecord = {
            id: Date.now(), billId: `${activeTableId}-${activeBill.id}`, type: orderType,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            date: new Date().toLocaleDateString('en-IN'), amount: total,
            items: activeBill.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
        };
        setDailySales(prev => [...prev, saleRecord]);
    }
    window.print();
    setTables(prev => {
        const table = prev[activeTableId];
        let newBills = [...table.bills];
        if (newBills.length > 1) {
            newBills.splice(table.activeBillIndex, 1);
            return { ...prev, [activeTableId]: { ...table, bills: newBills, activeBillIndex: 0 } };
        } else {
            newBills[0].items = [];
            return { ...prev, [activeTableId]: { ...table, bills: newBills } };
        }
    });
    setShowReceipt(false);
  };

  const handleClearSales = () => {
    if(window.confirm("Are you sure you want to clear all sales data for today? This cannot be undone.")) {
        setDailySales([]);
        localStorage.removeItem(todayKey);
    }
  };

  // Prepare Bill Data for Receipt Modal
  const currentTableData = tables[activeTableId];
  const currentBillData = currentTableData.bills[currentTableData.activeBillIndex];
  const receiptData = {
      items: currentBillData ? currentBillData.items : [],
      total: currentBillData ? calculateTotal(currentBillData.items) : 0,
      title: activeTableId === 'PARCEL' ? `PARCEL ORDER #${currentBillData.id}` : activeTableId === 'SPECIAL' ? `SPECIAL ORDER #${currentBillData.id}` : `TABLE ${activeTableId} / Guest ${currentBillData.id}`
  };

  // --- RESPONSIVE LAYOUT RETURN (UPDATED for Landscape) ---
  return (
    // Changed md:flex-row to lg:flex-row to force Tabs on Tablets/Landscape
    <div className="flex flex-col lg:flex-row h-screen bg-stone-50 font-sans text-gray-800 overflow-hidden relative">
        <ScrollbarStyles />
        <NumberPadModal 
            isOpen={numpadConfig.isOpen} 
            initialValue={numpadConfig.initialQty} 
            itemName={numpadConfig.itemName} 
            onClose={() => setNumpadConfig(prev => ({ ...prev, isOpen: false }))} 
            onConfirm={numpadConfig.onConfirm} 
        />

        {/* --- SECTION 1: TABLES (Sidebar) --- */}
        {/* Changed hidden md:flex to hidden lg:flex */}
        <div className={`${mobileTab === 'tables' ? 'flex w-full' : 'hidden lg:flex lg:w-80'} h-[calc(100vh-60px)] lg:h-full flex-col`}>
             <SidebarTableList tables={tables} activeTableId={activeTableId} setActiveTableId={(id) => {
                 handleTableSwitch(id);
                 if (window.innerWidth < 1024) setMobileTab('menu'); // Auto switch to menu on mobile/tablet
             }} />
        </div>

        {/* --- SECTION 2: MENU (Center) --- */}
        {/* Changed hidden md:flex to hidden lg:flex */}
        <div className={`${mobileTab === 'menu' ? 'flex w-full' : 'hidden lg:flex lg:flex-1'} flex-col h-[calc(100vh-60px)] lg:h-full overflow-hidden`}>
            {/* Header */}
            <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200 flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-full group cursor-default">
                        <h1 className="text-xl lg:text-3xl font-black text-gray-800 tracking-tight leading-none">Ravi Saoji</h1>
                        <p className="text-sm lg:text-3xl text-orange-600 font-bold uppercase tracking-tight mt-0.5">Bhojnalay</p>
                    </div>
                </div>
                 {/* Mobile Only: Show active table info in header */}
                <div className="lg:hidden text-xs font-bold bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    {activeTableId === 'PARCEL' ? 'PARCEL' : activeTableId === 'SPECIAL' ? 'SPECIAL' : `TABLE ${activeTableId}`}
                </div>
                <div className="hidden lg:flex flex-col items-end justify-center h-full text-right">
                    <div className="flex items-center gap-1.5 text-gray-600 text-sm font-bold mb-0.5">Omkar Nagar Road<MapPin size={16} className="text-orange-500" /></div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">098602 08682 / 72765 42388<Phone size={14} className="text-orange-500" /></div>
                </div>
            </div>

            {/* Category Bar */}
            <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-100 z-10 shrink-0">
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 lg:px-5 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>{cat}</button>
                ))}
            </div>

            {/* Menu Grid */}
            <div className="flex-1 overflow-y-auto p-4 bg-stone-50 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {MENU_ITEMS.filter(item => selectedCategory === 'All' || item.category === selectedCategory).map(item => (
                        <MenuCard key={item.id} item={item} onAdd={addItemToTable} onOpenNumpad={openNumpad} />
                    ))}
                </div>
            </div>
        </div>

        {/* --- SECTION 3: BILL PANEL (Right Side) --- */}
        {/* Changed hidden md:flex to hidden lg:flex */}
        <div className={`${mobileTab === 'bill' ? 'flex w-full' : 'hidden lg:flex lg:w-96'} h-[calc(100vh-60px)] lg:h-full flex-col bg-white z-20`}>
             <BillPanel 
                tables={tables} activeTableId={activeTableId} switchActiveBill={switchActiveBill} addNewBillToTable={addNewBillToTable}
                updateQuantity={updateQuantity} calculateTotal={calculateTotal} setShowReceipt={setShowReceipt} onOpenNumpad={openNumpad}
                totalRevenue={dailySales.reduce((sum, sale) => sum + sale.amount, 0)} totalBills={dailySales.length} onClearSales={handleClearSales}
            />
        </div>

        {/* --- BOTTOM NAVIGATION (Mobile Only) --- */}
        {/* Changed md:hidden to lg:hidden to show on Landscape/Tablets */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-gray-200 flex justify-around items-center z-50 pb-safe">
            <button onClick={() => setMobileTab('tables')} className={`flex flex-col items-center justify-center w-full h-full ${mobileTab === 'tables' ? 'text-orange-600' : 'text-gray-400'}`}>
                <MapPin size={20} className={mobileTab === 'tables' ? 'fill-current' : ''} />
                <span className="text-[10px] font-bold mt-1">TABLES</span>
            </button>
            <button onClick={() => setMobileTab('menu')} className={`flex flex-col items-center justify-center w-full h-full ${mobileTab === 'menu' ? 'text-orange-600' : 'text-gray-400'}`}>
                <Utensils size={20} className={mobileTab === 'menu' ? 'fill-current' : ''} />
                <span className="text-[10px] font-bold mt-1">MENU</span>
            </button>
            <button onClick={() => setMobileTab('bill')} className={`flex flex-col items-center justify-center w-full h-full ${mobileTab === 'bill' ? 'text-orange-600' : 'text-gray-400'} relative`}>
                <div className="relative">
                    <ShoppingBag size={20} className={mobileTab === 'bill' ? 'fill-current' : ''} />
                    {/* Badge for bill items */}
                    {tables[activeTableId]?.bills[tables[activeTableId]?.activeBillIndex]?.items?.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {tables[activeTableId].bills[tables[activeTableId].activeBillIndex].items.length}
                        </span>
                    )}
                </div>
                <span className="text-[10px] font-bold mt-1">BILL</span>
            </button>
        </div>

        <ReceiptModal show={showReceipt} onClose={() => setShowReceipt(false)} onPrint={handlePrintAndClose} billData={receiptData} />
    </div>
  );
};

export default BillingApp;