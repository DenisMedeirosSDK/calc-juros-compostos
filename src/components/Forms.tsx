import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import clx from "classnames";

interface ResponseTable {
  month: number;
  fees: number;
  totalInvested: number;
  totalInterest: number;
  totalAccumulated: number;
}

const schema2 = z.object({
  month: z.number().min(1),
  fees: z.number().max(1).min(0),
  totalInvested: z.number().min(0),
  totalInterest: z.number().min(0),
  totalAccumulated: z.number(),
});

const schema = z.object({
  initialMoney: z.string(),
  monthMoney: z.string(),
  interestPercentage: z.string(),
  period: z.string(),
});

type Schema = z.infer<typeof schema>;

export function Form() {
  const [finalTotalAmount, setFinalTotalAmount] = useState(0);
  const [finalTotalInvested, setFinalTotalInvested] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [isCalculate, setIsCalculate] = useState(false);

  const [result, setResult] = useState<ResponseTable[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  function handleCalculate({
    initialMoney,
    interestPercentage,
    monthMoney,
    period,
  }: Schema) {
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
    console.log(results);
    setIsCalculate(true);
  }

  function onSubmit(data: Schema) {
    console.log(data);
  }
  // const onSubmit = (data: Schema) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(handleCalculate)}
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
          className={clx(
            `p-3 bg-zinc-800 rounded-lg border-collapse
          outline-none focus:ring-2 ring-green-300`,
            errors ?? `ring-red-500`
          )}
          {...register("initialMoney")}
        />
        {errors.initialMoney && <p>{errors.initialMoney.message}</p>}
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
          {...register("monthMoney")}
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
          {...register("interestPercentage")}
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
          {...register("period")}
        />
      </div>

      {/* <label
      htmlFor="checkbox"
      className="flex gap-3 items-center p-3 h-12 bg-zinc-800 rounded-lg"
    >
      <input
        type="checkbox"
        id="checkbox"
        name="checkbox"
        className="w-5 h-5"
      />
      <p className="font-semibold">Investir juros</p>
    </label> */}

      <button
        type="submit"
        className="bg-green-300 hover:bg-green-500 transition-colors rounded-lg h-12 text-zinc-900 font-semibold"
      >
        Calcular
      </button>
    </form>
  );
}
