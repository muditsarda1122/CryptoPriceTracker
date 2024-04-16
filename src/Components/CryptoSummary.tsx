import { Crypto } from "../Types";
import { useState, useEffect } from "react";

export type AppProps = {
  crypto: Crypto;
  updateOwned: (crypto: Crypto, amount: number) => void;
};

export default function CryptoSummary({
  crypto,
  updateOwned,
}: AppProps): JSX.Element {
  useEffect(() => {
    if (!amount) return;
    console.log(crypto.name, amount, crypto.current_price * amount);
  });
  const [amount, setAmount] = useState<number>(0);
  return (
    <div>
      <span>
        {crypto.name}: ${crypto.current_price}
      </span>
      <input
        type="number"
        style={{ margin: 10 }}
        value={amount}
        onChange={(e) => {
          setAmount(parseFloat(e.target.value));
          // set the parent's state by calling a function passed as a prop
          updateOwned(crypto, parseFloat(e.target.value));
        }}
      ></input>
      <p>
        Value:{" "}
        {isNaN(amount)
          ? "$0.00"
          : "$" +
            (crypto.current_price * amount).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
      </p>
    </div>
  );
}
