import type React from 'react';
import { useState, useEffect } from 'react';
import IcoBatchList from '../components/IcoBatchList';
import TokenPurchaseForm from '../components/TokenPurchaseForm';
import { type IcoPluginConfig, type SalesBatch } from '../types/icoTypes';

// Mock 数据 - 在实际应用中，这些数据将来自合约或API
const mockIcoConfig: IcoPluginConfig = {
  daoAddress: '0x1234...',
  totalLimit: 1000000,
  totalSold: 150000,
  batches: [
    {
      id: '1',
      name: 'Early Bird Sale',
      description: 'Special rate for early supporters',
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前开始
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5天后结束
      tradingPair: {
        id: '1',
        inputToken: {
          address: '0xeth...',
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18
        },
        outputToken: {
          address: '0xdaotoken...',
          name: 'DAO Governance Token',
          symbol: 'DAO',
          decimals: 18
        },
        exchangeRate: 1000 // 1 ETH = 1000 DAO
      },
      totalLimit: 500000,
      userLimit: 5000,
      soldAmount: 75000,
      isActive: true
    },
    {
      id: '2',
      name: 'Public Sale',
      description: 'Public sale for all participants',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3天后开始
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10天后结束
      tradingPair: {
        id: '2',
        inputToken: {
          address: '0xeth...',
          name: 'Ethereum',
          symbol: 'ETH',
          decimals: 18
        },
        outputToken: {
          address: '0xdaotoken...',
          name: 'DAO Governance Token',
          symbol: 'DAO',
          decimals: 18
        },
        exchangeRate: 800 // 1 ETH = 800 DAO
      },
      totalLimit: 500000,
      userLimit: 10000,
      soldAmount: 75000,
      isActive: false
    }
  ]
};

const IcoPage: React.FC = () => {
  const [icoConfig, setIcoConfig] = useState<IcoPluginConfig | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<SalesBatch | null>(null);
  const [userBalance] = useState(5.5); // Mock 用户余额
  const [userPurchases, setUserPurchases] = useState(0); // Mock 用户已购买数量

  useEffect(() => {
    // 模拟从API或合约获取数据
    setTimeout(() => {
      setIcoConfig(mockIcoConfig);
    }, 500);
  }, []);

  const handleSelectBatch = (batch: SalesBatch) => {
    setSelectedBatch(batch);
  };

  const handlePurchase = async (amount: number) => {
    // 模拟购买过程
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // 这里应该调用智能合约进行实际购买
        console.log(`Purchasing ${amount.toString()} tokens from batch ${selectedBatch?.id ?? 'unknown'}`);
        
        // 模拟成功或失败
        if (Math.random() > 0.2) {
          // 更新本地状态以反映购买
          setUserPurchases(prev => prev + amount);
          resolve();
        } else {
          reject(new Error('Transaction failed'));
        }
      }, 2000);
    });
  };

  const handleCancelPurchase = () => {
    setSelectedBatch(null);
  };

  if (!icoConfig) {
    return <div>Loading ICO data...</div>;
  }

  return (
    <div className="ico-page">
      <div className="ico-page-header">
        <h1>DAO Token ICO</h1>
        <div className="ico-progress">
          <span>Total Sold: {icoConfig.totalSold} / {icoConfig.totalLimit} tokens</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((icoConfig.totalSold / icoConfig.totalLimit) * 100).toString()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {selectedBatch ? (
        <TokenPurchaseForm
          batch={selectedBatch}
          userBalance={userBalance}
          userPreviousPurchases={userPurchases}
          onPurchase={handlePurchase}
          onCancel={handleCancelPurchase}
        />
      ) : (
        <IcoBatchList 
          batches={icoConfig.batches} 
          onSelectBatch={handleSelectBatch} 
        />
      )}
    </div>
  );
};

export default IcoPage;
export { IcoPage };