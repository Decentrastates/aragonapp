import type React from 'react';
import { useState } from 'react';
import { type SalesBatch } from '../types/icoTypes';

interface IcoBatchListProps {
  batches: SalesBatch[];
  onSelectBatch: (batch: SalesBatch) => void;
}

const IcoBatchList: React.FC<IcoBatchListProps> = ({ batches, onSelectBatch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBatches = batches.filter(batch => 
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ico-batch-list">
      <div className="ico-batch-list-header">
        <h2>ICO Sales Batches</h2>
        <input
          type="text"
          placeholder="Search batches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="batch-grid">
        {filteredBatches.map(batch => (
          <div 
            key={batch.id} 
            className={`batch-card ${batch.isActive ? 'active' : 'inactive'}`}
            onClick={() => onSelectBatch(batch)}
          >
            <div className="batch-header">
              <h3>{batch.name}</h3>
              <span className={`status ${batch.isActive ? 'active' : 'inactive'}`}>
                {batch.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="batch-description">{batch.description}</p>
            
            <div className="batch-details">
              <div className="detail-item">
                <span className="label">Exchange Rate:</span>
                <span className="value">1 {batch.tradingPair.inputToken.symbol} = {batch.tradingPair.exchangeRate} {batch.tradingPair.outputToken.symbol}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">Period:</span>
                <span className="value">
                  {batch.startTime.toLocaleDateString()} - {batch.endTime.toLocaleDateString()}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="label">Sold:</span>
                <span className="value">
                  {batch.soldAmount} / {batch.totalLimit} {batch.tradingPair.outputToken.symbol}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="label">Your Limit:</span>
                <span className="value">{batch.userLimit} {batch.tradingPair.outputToken.symbol}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IcoBatchList;