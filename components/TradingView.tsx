"use client";
import confetti from "canvas-confetti";
import { Form, Formik } from "formik";
import { memo, useMemo, useRef, useState } from "react";
import * as Yup from "yup";
import EmojiPicker from "./EmojiPicker";
import EthChart from "./EthChart";
import { LeverageSlider } from "./LeverageSlider";
import OrderTypeSelector from "./OrderTypeSelector";
import TabSelector from "./TabSelector";
import TopBar from "./TopBar";

const tabOptions = [
  {
    value: "price",
    label: "PRICE",
    color: "red-500",
    hoverColor: "red-500",
  },
  {
    value: "funding",
    label: "FUNDING",
    color: "gray-500",
    hoverColor: "gray-500",
  },
];

const positionOptions = [
  {
    value: "LONG",
    label: "LONG",
    color: "[#26a69a]",
    hoverColor: "green-500",
  },
  {
    value: "SHORT",
    label: "SHORT",
    color: "red-500",
    hoverColor: "red-500",
  },
];

const TradingSchema = Yup.object().shape({
  market: Yup.string().required("Required"),
  orderType: Yup.string().required("Required"),
  leverage: Yup.number().min(2).max(128).required("Required"),
  size: Yup.number().min(0.001).max(1458.173).required("Required"),
  price: Yup.number().when("orderType", ([orderType]) =>
    orderType === "LIMIT"
      ? Yup.number().required("Price is required for limit orders")
      : Yup.number().notRequired()
  ),
});

const MemoizedTabSelector2 = memo(TabSelector);

const TradingView = () => {
  const [position, setPosition] = useState<"LONG" | "SHORT">("LONG");
  const [selectedTab, setSelectedTab] = useState("price");

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    const audio = new Audio("/ping.wav");
    audio.play();

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y, x },
      });
    }
    setSubmitting(false);
  };

  const LongShortSelector = useMemo(
    () => (
      <TabSelector
        options={positionOptions}
        value={position}
        onChange={(value) => setPosition(value as "LONG" | "SHORT")}
      />
    ),
    [positionOptions, position, setPosition]
  );

  return (
    <div className="flex flex-col space-y-4">
      <TopBar />
      <div className="border-b border-custom-darker">
        <div className="w-48">
          <TabSelector
            options={tabOptions}
            value={selectedTab}
            onChange={setSelectedTab}
          />
        </div>
      </div>

      {selectedTab === "price" ? (
        <>
          <div className="grid grid-cols-11 gap-4 h-fit">
            <div className="col-span-8 flex flex-col overflow-hidden h-auto">
              <div className="w-full h-full overflow-hidden bg-custom-darker px-4">
                <EthChart />
              </div>
            </div>

            <div className="col-span-3 bg-custom-darker p-4 h-full">
              <Formik
                initialValues={{
                  market: "BTC-PERP",
                  orderType: "MARKET",
                  leverage: 10,
                  price: "",
                  size: 0,
                }}
                validationSchema={TradingSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="space-y-4">
                    {LongShortSelector}

                    <OrderTypeSelector
                      orderType={values.orderType}
                      price={30021.29}
                      size={values.size}
                      maxSize={1458.173}
                      onOrderTypeChange={(type) =>
                        setFieldValue("orderType", type)
                      }
                      onSizeChange={(size) => setFieldValue("size", size)}
                      className={`${
                        errors.size && touched.size
                          ? "border-red-500 border"
                          : ""
                      }`}
                    />

                    <LeverageSlider
                      value={values.leverage}
                      onChange={(value) => setFieldValue("leverage", value)}
                      markerConfig={[
                        { label: "5x", value: 5 },
                        { label: "25x", value: 25 },
                        { label: "50x", value: 50 },
                        { label: "100x", value: 100 },
                      ]}
                    />

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between text-sm">
                        <span className=" text-custom-gray">
                          Liquidation Price
                        </span>
                        <span className=" font-sm text-custom-light">
                          300,212 USDC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className=" text-custom-gray">Slippage</span>
                        <span className=" font-sm text-custom-light">
                          1.20 USDC (0.3%)
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className=" text-custom-gray">Fee</span>
                        <span className=" font-sm text-custom-light">
                          2.00 USDC (0.05%)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between text-sm">
                        <span className=" text-custom-gray">Advanced</span>
                        <span className="text-white">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="transform transition-transform duration-200 hover:translate-y-0.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      ref={buttonRef}
                      className={`w-full py-3 ${
                        position === "LONG"
                          ? "bg-[#26a69a] hover:bg-[#22968a]"
                          : "bg-red-500 hover:bg-red-600"
                      }  text-sm text-custom-darker rounded-sm h-11 px-4 py-[11px]`}
                    >
                      {position === "LONG" ? "BUY / LONG" : "SELL / SHORT"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <EmojiPicker show={false} onSelect={() => {}} />
        </>
      ) : (
        <div>Funding View Component Here</div>
      )}
    </div>
  );
};

export default TradingView;
