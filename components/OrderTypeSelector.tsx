import Input from "./ui/Input";
import Select from "./ui/Select";

interface OrderTypeSelectorProps {
  orderType: string;
  price: number;
  size: number;
  maxSize: number;
  onOrderTypeChange: (type: string) => void;
  onSizeChange: (size: number) => void;
  className?: string;
}

const OrderTypeSelector = ({
  orderType,
  price,
  size,
  maxSize,
  onOrderTypeChange,
  onSizeChange,
  className,
}: OrderTypeSelectorProps) => {
  console.log("className", className);
  return (
    <div className="flex flex-col gap-4">
      {/* Order Type and Price Row */}
      <div className="grid grid-cols-8 gap-4">
        <div className="col-span-5">
          <div className="w-[196px]">
            <Select
              value={orderType}
              onChange={onOrderTypeChange}
              options={[
                { value: "MARKET", label: "MARKET" },
                { value: "LIMIT", label: "LIMIT" },
              ]}
              label="Order type"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label className="text-custom-gray text-sm  block mb-2">
            Open Price
          </label>
          <div className="text-custom-light  text-sm">
            <div>{`${price.toLocaleString()}`}</div>
            <div>USDC</div>
          </div>
        </div>
      </div>

      {/* Size Input */}
      <div>
        <Input
          type="number"
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          label="Size"
          suffix="USDC"
          helperText={`Up to ${maxSize.toLocaleString()}`}
          className={className}

        />
      </div>
    </div>
  );
};

export default OrderTypeSelector;
