# Draw Plugin

The Draw Plugin is a modular plugin for Aragon OSx DAOs that enables NFT-based lottery and redemption functionality.

## Features

1. **NFT Lottery**: Randomly draw NFT IDs from enabled redemption combinations and mint ERC1155 NFTs
2. **NFT Batch Redemption**: Allow users to redeem multiple NFT combinations for ERC20 TokenA
3. **Governance Integration**: All parameters are controlled through DAO proposals
4. **Access Control**: Eligibility verification embedded in contracts to reduce gas costs

## Installation

To install the Draw Plugin in your DAO:

1. Navigate to your DAO settings
2. Click "Add Plugin" in the Draw Plugin section
3. Configure the plugin parameters:
   - Eligible Token: Token required for participation
   - Minimum Token Amount: Minimum balance required
   - Draw Interval: Minimum time between draws
   - NFT Combinations: Define redeemable NFT combinations

## Usage

### For DAO Members

1. **Check Eligibility**: Visit the Draw page to see if you meet participation requirements
2. **Participate in Draws**: Click the "Participate" button to enter the lottery
3. **Redeem Rewards**: If you win, claim your NFT rewards on the redemption page
4. **Batch Redemption**: Hold eligible NFTs and exchange them for tokens

### For DAO Administrators

1. **Configure Plugin**: Set up eligibility requirements and NFT combinations
2. **Manage via Proposals**: All parameter changes must go through DAO proposals
3. **Monitor Activity**: Track draw history and redemption activity

## API Methods

The plugin provides several methods for integration:

- `checkEligibility`: Verify if a user can participate
- `requestDraw`: Enter a user into the lottery
- `redeemNfts`: Exchange NFTs for tokens
- `getDrawHistory`: Retrieve a user's draw history
- `getNftHoldings`: Get a user's eligible NFT holdings

## Development

To develop and extend the Draw Plugin:

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Access the plugin at `/draw/test`

## Testing

Run tests with:

```bash
npm test
```

## Security

- All parameter changes require DAO proposals
- Random number generation uses multiple entropy sources
- Contract upgrades require proper permissions
- Issuance limits and blacklists prevent abuse

## License

MIT