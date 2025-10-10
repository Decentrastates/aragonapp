import React, { useState } from 'react';
import { SalesBatch, TradingPair, IcoToken } from '../types/icoTypes';
import { DEFAULT_SALES_BATCH, DEFAULT_TRADING_PAIR } from '../constants/icoConstants';

const IcoAdminPage: React.FC = () => {
  const [batches, setBatches] = useState<SalesBatch[]>([]);
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [editingBatch, setEditingBatch] = useState<SalesBatch | null>(null);

  // 表单状态
  const [batchForm, setBatchForm] = useState<Partial<SalesBatch>>(DEFAULT_SALES_BATCH());
  const [tradingPairForm, setTradingPairForm] = useState<Partial<TradingPair>>(DEFAULT_TRADING_PAIR());

  const handleCreateBatch = () => {
    setIsCreatingBatch(true);
    setEditingBatch(null);
    setBatchForm(DEFAULT_SALES_BATCH());
    setTradingPairForm(DEFAULT_TRADING_PAIR());
  };

  const handleEditBatch = (batch: SalesBatch) => {
    setIsCreatingBatch(true);
    setEditingBatch(batch);
    setBatchForm(batch);
    setTradingPairForm(batch.tradingPair);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBatch: SalesBatch = {
      id: editingBatch?.id ?? Date.now().toString(),
      name: batchForm.name ?? '',
      description: batchForm.description ?? '',
      startTime: batchForm.startTime ?? new Date(),
      endTime: batchForm.endTime ?? new Date(),
      totalLimit: batchForm.totalLimit ?? 0,
      userLimit: batchForm.userLimit ?? 0,
      soldAmount: batchForm.soldAmount ?? 0,
      isActive: batchForm.isActive ?? false,
      tradingPair: {
        id: tradingPairForm.id ?? Date.now().toString(),
        inputToken: tradingPairForm.inputToken ?? {
          address: '',
          name: '',
          symbol: '',
          decimals: 18
        },
        outputToken: tradingPairForm.outputToken ?? {
          address: '',
          name: '',
          symbol: '',
          decimals: 18
        },
        exchangeRate: tradingPairForm.exchangeRate ?? 1
      }
    };
    
    if (editingBatch) {
      // 更新现有批次
      setBatches(batches.map(b => b.id === editingBatch.id ? newBatch : b));
    } else {
      // 添加新批次
      setBatches([...batches, newBatch]);
    }
    
    // 重置表单
    setIsCreatingBatch(false);
    setEditingBatch(null);
    setBatchForm(DEFAULT_SALES_BATCH());
    setTradingPairForm(DEFAULT_TRADING_PAIR());
  };

  const handleDeleteBatch = (id: string) => {
    setBatches(batches.filter(batch => batch.id !== id));
  };

  const handleBatchFormChange = <K extends keyof SalesBatch>(field: K, value: SalesBatch[K]) => {
    setBatchForm({ ...batchForm, [field]: value });
  };

  const handleTradingPairFormChange = <K extends keyof TradingPair>(field: K, value: TradingPair[K]) => {
    setTradingPairForm({ ...tradingPairForm, [field]: value });
  };

  const handleTokenChange = <K extends keyof IcoToken>(tokenType: 'input' | 'output', field: K, value: IcoToken[K]) => {
    setTradingPairForm({
      ...tradingPairForm,
      [tokenType === 'input' ? 'inputToken' : 'outputToken']: {
        ...(tokenType === 'input' ? tradingPairForm.inputToken : tradingPairForm.outputToken),
        [field]: value
      } as TradingPair['inputToken' | 'outputToken']
    });
  };

  return (
    <div className="ico-admin-page">
      <div className="admin-header">
        <h1>ICO Administration</h1>
        <button 
          className="primary-button"
          onClick={handleCreateBatch}
        >
          Create New Sales Batch
        </button>
      </div>

      {isCreatingBatch ? (
        <div className="batch-form-container">
          <h2>{editingBatch ? 'Edit Sales Batch' : 'Create New Sales Batch'}</h2>
          <form onSubmit={handleFormSubmit} className="batch-form">
            <div className="form-section">
              <h3>Batch Details</h3>
              
              <div className="form-group">
                <label htmlFor="batch-name">Batch Name</label>
                <input
                  type="text"
                  id="batch-name"
                  value={batchForm.name ?? ''}
                  onChange={(e) => handleBatchFormChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="batch-description">Description</label>
                <textarea
                  id="batch-description"
                  value={batchForm.description ?? ''}
                  onChange={(e) => handleBatchFormChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start-time">Start Time</label>
                  <input
                    type="datetime-local"
                    id="start-time"
                    value={batchForm.startTime ? 
                      new Date(batchForm.startTime.getTime() - batchForm.startTime.getTimezoneOffset() * 60000)
                        .toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleBatchFormChange('startTime', new Date(e.target.value))}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="end-time">End Time</label>
                  <input
                    type="datetime-local"
                    id="end-time"
                    value={batchForm.endTime ? 
                      new Date(batchForm.endTime.getTime() - batchForm.endTime.getTimezoneOffset() * 60000)
                        .toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleBatchFormChange('endTime', new Date(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="total-limit">Total Limit</label>
                  <input
                    type="number"
                    id="total-limit"
                    value={batchForm.totalLimit ?? ''}
                    onChange={(e) => handleBatchFormChange('totalLimit', Number(e.target.value))}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="user-limit">User Limit</label>
                  <input
                    type="number"
                    id="user-limit"
                    value={batchForm.userLimit ?? ''}
                    onChange={(e) => handleBatchFormChange('userLimit', Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={batchForm.isActive ?? false}
                    onChange={(e) => handleBatchFormChange('isActive', e.target.checked)}
                  />
                  Active
                </label>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Trading Pair</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="exchange-rate">Exchange Rate</label>
                  <input
                    type="number"
                    id="exchange-rate"
                    value={tradingPairForm.exchangeRate ?? ''}
                    onChange={(e) => handleTradingPairFormChange('exchangeRate', Number(e.target.value))}
                    min="0"
                    step="0.0001"
                    placeholder="Enter exchange rate"
                  />
                  <small>1 Input Token = X Output Tokens</small>
                </div>
              </div>
              
              <div className="token-section">
                <h4>Input Token (Payment Token)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="input-token-name">Name</label>
                    <input
                      type="text"
                      id="input-token-name"
                      value={tradingPairForm.inputToken?.name ?? ''}
                      onChange={(e) => handleTokenChange('input', 'name', e.target.value)}
                      placeholder="Token Name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="input-token-symbol">Symbol</label>
                    <input
                      type="text"
                      id="input-token-symbol"
                      value={tradingPairForm.inputToken?.symbol ?? ''}
                      onChange={(e) => handleTokenChange('input', 'symbol', e.target.value)}
                      placeholder="Token Symbol"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="input-token-address">Address</label>
                    <input
                      type="text"
                      id="input-token-address"
                      value={tradingPairForm.inputToken?.address ?? ''}
                      onChange={(e) => handleTokenChange('input', 'address', e.target.value)}
                      placeholder="Token Contract Address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="input-token-decimals">Decimals</label>
                    <input
                      type="number"
                      id="input-token-decimals"
                      value={tradingPairForm.inputToken?.decimals ?? 18}
                      onChange={(e) => handleTokenChange('input', 'decimals', Number(e.target.value))}
                      min="0"
                      max="18"
                      placeholder="18"
                    />
                  </div>
                </div>
              </div>
              
              <div className="token-section">
                <h4>Output Token (Governance Token)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="output-token-name">Name</label>
                    <input
                      type="text"
                      id="output-token-name"
                      value={tradingPairForm.outputToken?.name ?? ''}
                      onChange={(e) => handleTokenChange('output', 'name', e.target.value)}
                      placeholder="Token Name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="output-token-symbol">Symbol</label>
                    <input
                      type="text"
                      id="output-token-symbol"
                      value={tradingPairForm.outputToken?.symbol ?? ''}
                      onChange={(e) => handleTokenChange('output', 'symbol', e.target.value)}
                      placeholder="Token Symbol"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="output-token-address">Address</label>
                    <input
                      type="text"
                      id="output-token-address"
                      value={tradingPairForm.outputToken?.address ?? ''}
                      onChange={(e) => handleTokenChange('output', 'address', e.target.value)}
                      placeholder="Token Contract Address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="output-token-decimals">Decimals</label>
                    <input
                      type="number"
                      id="output-token-decimals"
                      value={tradingPairForm.outputToken?.decimals ?? 18}
                      onChange={(e) => handleTokenChange('output', 'decimals', Number(e.target.value))}
                      min="0"
                      max="18"
                      placeholder="18"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setIsCreatingBatch(false)}
                className="secondary-button"
              >
                Cancel
              </button>
              <button type="submit" className="primary-button">
                {editingBatch ? 'Update Batch' : 'Create Batch'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="batches-list">
          <h2>Sales Batches</h2>
          {batches.length === 0 ? (
            <p>No sales batches created yet.</p>
          ) : (
            <div className="batches-table">
              <div className="table-header">
                <div>Name</div>
                <div>Period</div>
                <div>Exchange Rate</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              {batches.map(batch => (
                <div key={batch.id} className="table-row">
                  <div>{batch.name}</div>
                  <div>
                    {batch.startTime.toLocaleDateString()} - {batch.endTime.toLocaleDateString()}
                  </div>
                  <div>
                    1 {batch.tradingPair.inputToken.symbol} = {batch.tradingPair.exchangeRate} {batch.tradingPair.outputToken.symbol}
                  </div>
                  <div>
                    <span className={`status ${batch.isActive ? 'active' : 'inactive'}`}>
                      {batch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleEditBatch(batch)}
                      className="secondary-button small"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteBatch(batch.id)}
                      className="danger-button small"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IcoAdminPage;
export { IcoAdminPage };