import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import CryptoSummary from "./Components/CryptoSummary";
import { Crypto } from "./Types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  // we want cryptos to be an arrAY OF Crypto or null
  const [cryptos, setCryptos] = useState<Crypto[] | null>();
  const [selectedState, setSelectedState] = useState<Crypto | null>();
  const [data, setData] = useState<ChartData<"line">>();
  const [range, setRange] = useState<number>(30);
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  });

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setCryptos(response.data);
      });
  }, []);

  useEffect(() => {
    if (!selectedState) return;
    axios
      .get(
        // `https://api.coingecko.com/api/v3/coins/${
        //   selectedState?.id
        // }/market_chart?vs_currency=usd&days=${range}&${
        //   range === 1 ? `interval=hourly` : `interval=daily`
        // }`,
        range === 1
          ? `https://api.coingecko.com/api/v3/coins/${selectedState?.id}/market_chart?vs_currency=usd&days=1`
          : `https://api.coingecko.com/api/v3/coins/${selectedState?.id}/market_chart?vs_currency=usd&days=${range}&interval=daily`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        //setData()
        console.log(response.data);
        setData({
          // labels are timestamps and data are the actual prices
          labels: response.data.prices.map((price: number[]) => {
            return moment
              .unix(price[0] / 1000)
              .format(range === 1 ? "HH:mm" : "MM-DD");
          }),
          datasets: [
            {
              label: "Dataset 1",
              data: response.data.prices.map((price: number[]) => {
                return price[1];
              }),
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        });
        setOptions({
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text:
                `${selectedState?.name}'s Price Over The Last ` +
                range +
                (range === 1 ? " Day." : " Days."),
            },
          },
        });
      })
      .catch((error) => {
        console.log("error fetching data: ", error);
      });
  }, [selectedState, range]);

  return (
    <>
      <div className="App">
        <select
          onChange={(e) => {
            const c = cryptos?.find((x) => x.id === e.target.value);
            setSelectedState(c);
          }}
          defaultValue="default"
        >
          <option value="default">Select a crypto currency</option>
          {cryptos
            ? cryptos.map((crypto) => {
                return (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name}
                  </option>
                );
              })
            : null}
        </select>
        <select
          onChange={(e) => {
            setRange(parseInt(e.target.value));
          }}
        >
          <option value={30}>30 days</option>
          <option value={7}>7 days</option>
          <option value={1}>1 day</option>
        </select>
      </div>
      {selectedState ? <CryptoSummary crypto={selectedState} /> : null}
      {data ? (
        <div style={{ width: 600 }}>
          <Line data={data} options={options} />
        </div>
      ) : null}
    </>
  );
}

export default App;
