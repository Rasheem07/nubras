import React from 'react';
import { Package } from 'lucide-react';
import Link from 'next/link';

interface SectionCardProps {
  section: {
    id: string;
    name: string;
    products: any[];
    totalQuantitySold: number;
    totalSalesAmount: number;
  };
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            {section.name.toUpperCase()}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 font-medium">
              {(section.products && section.products.length) || 0} Products
            </span>
          </div>
        </div>



        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Total Sold
            </p>

            <p className="text-white font-semibold">
              {section.totalQuantitySold.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Total Revenue
            </p>
            <p className="text-white font-semibold">
              AED {section.totalSalesAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <Link href={`/dashboard/products/${section.name}`} className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center transition-colors w-full">View all products</Link>
      </div>
    </div>
  );
};

export default SectionCard;