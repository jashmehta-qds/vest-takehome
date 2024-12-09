import { Field } from 'formik';

const markets = [
  { value: 'BTC-PERP', label: 'BTC-PERP' },
  { value: 'ETH-PERP', label: 'ETH-PERP' },
  { value: 'SOL-PERP', label: 'SOL-PERP' },
  { value: 'AVAX-PERP', label: 'AVAX-PERP' },
];

const MarketSelector = () => {
  return (
    <div>
      <label className="text-gray-400 text-sm">Market</label>
      <Field
        as="select"
        name="market"
        className="w-full bg-[#1a1a1a] text-white p-2 rounded mt-1 border border-gray-800"
      >
        {markets.map((market) => (
          <option key={market.value} value={market.value}>
            {market.label}
          </option>
        ))}
      </Field>
    </div>
  );
};

export default MarketSelector; 