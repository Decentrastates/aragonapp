import type React from 'react';
import { useState } from 'react';
import { type SalesBatch } from '../types/icoTypes';
import { validatePurchase, calculateExchangeAmount } from '../utils/icoCalculationUtils';

interface TokenPurchaseFormProps {
  batch: SalesBatch;
  userBalance: number; // 用户余额
  userPreviousPurchases: number; // 用户已购买数量
  onPurchase: (amount: number) => void;
  onCancel: () => void;
}

const TokenPurchaseForm: React.FC<TokenPurchaseFormProps> = ({
  batch,
  userBalance,
  userPreviousPurchases,
  onPurchase,
  onCancel
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const purchaseAmount = parseFloat(amount);
    
    // 验证购买请求
    const validation = validatePurchase(batch, purchaseAmount, userPreviousPurchases);
    
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Invalid purchase');
      return;
    }
    
    // 检查用户余额
    if (purchaseAmount > userBalance) {
      setError('Insufficient balance');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await onPurchase(purchaseAmount);
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const exchangeAmount = calculateExchangeAmount(parseFloat(amount) || 0, batch.tradingPair.exchangeRate);

  return (
    <div className="token-purchase-form">
      <div className="form-header">
        <h2>Purchase {batch.tradingPair.outputToken.name}</h2>
        <button className="close-button" onClick={onCancel}>×</button>
      </div>
      
      <div className="batch-info">
        <h3>{batch.name}</h3>
        <p>{batch.description}</p>
        
        <div className="exchange-rate">
          Exchange Rate: 1 {batch.tradingPair.inputToken.symbol} = {batch.tradingPair.exchangeRate} {batch.tradingPair.outputToken.symbol}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">
            Amount to spend ({batch.tradingPair.inputToken.symbol}):
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            min="0"
            step="any"
            disabled={isProcessing}
          />
          
          <div className="balance-info">
            Your balance: {userBalance.toFixed(6)} {batch.tradingPair.inputToken.symbol}
          </div>
        </div>
        
        {amount && parseFloat(amount) > 0 && (
          <div className="exchange-preview">
            <p>You will receive approximately:</p>
            <h3>{exchangeAmount.toFixed(6)} {batch.tradingPair.outputToken.symbol}</h3>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isProcessing}
            className="secondary-button"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isProcessing || !amount || parseFloat(amount) <= 0}
            className="primary-button"
          >
            {isProcessing ? 'Processing...' : 'Purchase Tokens'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TokenPurchaseForm;