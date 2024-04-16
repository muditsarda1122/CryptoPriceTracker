import { Crypto } from "../Types";

export type AppProps = {
  crypto: Crypto;
};

export default function CryptoSummary({ crypto }: AppProps): JSX.Element {
  return (
    <>
      <p>Name: {crypto.name}</p>
      <p>Symbol: {crypto.symbol}</p>
      <p>Current Price: ${crypto.current_price}</p>
    </>
  );
}
