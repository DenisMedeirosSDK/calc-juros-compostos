import { FormEvent, useState } from "react";
import { formattedCurrency } from "./utils/format-currency";

import * as z from "zod";
import { Adsense } from "./components/Adsense";

interface ResponseTable {
  month: number;
  fees: number;
  totalInvested: number;
  totalInterest: number;
  totalAccumulated: number;
}

const schema = z.object({
  initialMoney: z.number().min(0),
  monthMoney: z.number().min(0),
  interestPercentage: z.number().max(1).min(0),
  period: z.number().min(1),
});

export function App() {
  const [initialMoney, setInitialMoney] = useState("");
  const [monthMoney, setMonthMoney] = useState("");
  const [interestPercentage, setiInterestPercentage] = useState("");
  const [period, setPeriod] = useState("");

  const [finalTotalAmount, setFinalTotalAmount] = useState(0);
  const [finalTotalInvested, setFinalTotalInvested] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [isCalculate, setIsCalculate] = useState(false);

  const [result, setResult] = useState<ResponseTable[]>([]);

  function handleCalculate(event: FormEvent) {
    event.preventDefault();

    const convInitialMoney = Number(initialMoney);
    const convMonthMoney = Number(monthMoney);
    const convInterestPercentage = Number(interestPercentage) / 100;
    const convPeriod = Number(period);

    let totalInvested = convInitialMoney;
    let totalInterest = 0;
    let totalAccumulated = convInitialMoney;
    let results: ResponseTable[] = [];

    const sumFinalTotalAmount =
      convInitialMoney * Math.pow(1 + convInterestPercentage, convPeriod) +
      (convMonthMoney *
        (Math.pow(1 + convInterestPercentage, convPeriod) - 1)) /
        convInterestPercentage;

    const sumTotalInvested = convInitialMoney + convMonthMoney * convPeriod;

    setFinalTotalInvested(sumTotalInvested);
    setTotalInterest(sumFinalTotalAmount - sumTotalInvested);
    setFinalTotalAmount(sumFinalTotalAmount);

    for (let i = 1; i <= convPeriod; i++) {
      let fees = totalAccumulated * convInterestPercentage;

      const amount = totalAccumulated + fees;

      totalInvested = totalInvested + convMonthMoney;
      totalInterest = totalInterest + fees;
      totalAccumulated = amount + convMonthMoney;

      results.push({
        month: i,
        fees,
        totalInvested,
        totalInterest,
        totalAccumulated,
      });
    }

    setResult(results);
    setIsCalculate(true);
  }

  return (
    <div className="bg-zinc-900 text-zinc-100 flex flex-col w-full h-full min-h-screen items-center pb-10">
      <main className="flex flex-col justify-center items-center w-full px-5 mx-auto gap-10">
        <form
          action=""
          className="grid md:grid-cols-2 gap-4 w-full max-w-5xl mt-10"
        >
          <div className="flex flex-col">
            <label htmlFor="" className="font-semibold mb-2">
              Valor inicial
            </label>
            <input
              type="text"
              required
              placeholder="R$1.000,00"
              className="p-3 bg-zinc-800 rounded-lg border-collapse
            outline-none focus:ring-2 ring-green-300"
              value={initialMoney}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                setInitialMoney(event.currentTarget.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="font-semibold mb-2">
              Valor mensal
            </label>
            <input
              type="text"
              required
              placeholder="R$100,00"
              className="p-3 bg-zinc-800 rounded-lg border-collapse
            outline-none focus:ring-2 ring-green-300"
              value={monthMoney}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                setMonthMoney(event.currentTarget.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="font-semibold mb-2">
              Taxa de juros <i>(a.m)</i>
            </label>
            <input
              type="text"
              placeholder="10%"
              className="p-3 bg-zinc-800 rounded-lg border-collapse
            outline-none focus:ring-2 ring-green-300"
              value={interestPercentage}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                setiInterestPercentage(event.currentTarget.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="font-semibold mb-2">
              Periodo <i>(meses)</i>
            </label>
            <input
              type="text"
              placeholder="10"
              className="p-3 bg-zinc-800 rounded-lg border-collapse
            outline-none focus:ring-2 ring-green-300"
              value={period}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                setPeriod(event.currentTarget.value)
              }
            />
          </div>

          <button
            type="submit"
            onClick={handleCalculate}
            className="bg-green-300 hover:bg-green-500 transition-colors rounded-lg h-12 text-zinc-900 font-semibold"
          >
            Calcular
          </button>
        </form>
        <section className="w-full max-w-5xl">
          {isCalculate ? (
            <div className="grid md:grid-cols-3 md:justify-between items-center gap-5">
              <div
                className="flex flex-col justify-center items-center bg-zinc-700 p-3 rounded-lg
             drop-shadow-md transform hover:scale-105 transition-all hover:ring-2 ring-green-300"
              >
                <p className="capitalize font-medium">Valor total final</p>
                <span className="text-green-300 font-semibold">
                  {formattedCurrency(finalTotalAmount)}
                </span>
              </div>
              <div
                className="flex flex-col justify-center items-center bg-zinc-700 p-3 rounded-lg
             drop-shadow-md transform hover:scale-105 transition-all hover:ring-2 ring-green-300"
              >
                <p className="capitalize font-medium">Valor total investido</p>
                <span className="text-green-300 font-semibold">
                  {formattedCurrency(finalTotalInvested)}
                </span>
              </div>
              <div
                className="flex flex-col justify-center items-center bg-zinc-700 p-3 rounded-lg
             drop-shadow-md transform hover:scale-105 transition-all hover:ring-2 ring-green-300"
              >
                <p className="capitalize font-medium">Total em juros</p>
                <span className="text-green-300 font-semibold">
                  {formattedCurrency(totalInterest)}
                </span>
              </div>
            </div>
          ) : (
            <div className="max-w-[728px] max-h-[90px]">
              <Adsense
                client="ca-pub-5699676851939916"
                slot="2117955977"
                format="auto"
                adTest="on"
              />
            </div>
          )}
        </section>
        <section className="w-full overflow-auto max-h-[620px] max-w-5xl">
          <table className="min-w-full">
            <thead className="bg-zinc-800">
              <tr className="capitalize">
                <th className="p-3 tracking-wide text-center rounded-tl-lg">
                  Mês
                </th>
                <th className="p-3 tracking-wide text-center">Juros</th>
                <th className="p-3 tracking-wide text-center">
                  Total investido
                </th>
                <th className="p-3 tracking-wide text-center">Total juros</th>
                <th className="p-3 tracking-wide text-center rounded-tr-lg">
                  Total acumulado
                </th>
              </tr>
            </thead>
            <tbody>
              {result.map((data) => {
                return (
                  <tr
                    key={data.month}
                    className="bg-zinc-700 even:bg-zinc-800 last:rounded-b-lg"
                  >
                    <td className="p-3 text-center ">{data.month}</td>
                    <td className="p-3 text-center">
                      {formattedCurrency(data.fees)}
                    </td>
                    <td className="p-3 text-center">
                      {formattedCurrency(data.totalInvested)}
                    </td>
                    <td className="p-3 text-center">
                      {formattedCurrency(data.totalInterest)}
                    </td>
                    <td className="p-3 text-center">
                      {formattedCurrency(data.totalAccumulated)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
