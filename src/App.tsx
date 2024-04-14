import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

export type Crypto = {
  ath: number;
  atl: number;
  current_price: number;
  high_24h: number;
  id: string;
  low_24h: number;
  market_cap_rank: number;
  max_supply: number;
  name: string;
  symbol: string;
};

function App() {
  // we want cryptos to be an arrAY OF Crypto or null
  const [cryptos, setCryptos] = useState<Crypto[] | null>();

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  return (
    <div className="App">
      {cryptos
        ? cryptos.map((crypto) => {
            return <p>{crypto.name}</p>;
          })
        : null}
    </div>
  );
}

export default App;
