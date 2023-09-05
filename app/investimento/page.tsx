'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Slider from '@radix-ui/react-slider'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface ResponseTable {
  month: number
  fees: number
  totalInvested: number
  totalInterest: number
  totalAccumulated: number
}

function formattedCurrency(amount: number) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(amount)
}

const formSchema = z.object({
  initialMoney: z.coerce.number().min(0),
  monthMoney: z.coerce.number().min(0),
  period: z.coerce.number().min(1),
})

type FormSchema = z.infer<typeof formSchema>

export default function Investment() {
  const [interestPercentage, setInterestPercentage] = useState(0.9)

  const [finalTotalAmount, setFinalTotalAmount] = useState(0)
  const [finalTotalInvested, setFinalTotalInvested] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [isCalculate, setIsCalculate] = useState(false)

  const [result, setResult] = useState<ResponseTable[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  function handleCalculate(data: FormSchema) {
    const convInitialMoney = data.initialMoney
    const convMonthMoney = data.monthMoney
    const convInterestPercentage = interestPercentage / 100
    const convPeriod = data.period

    let totalInvested = convInitialMoney
    let totalInterest = 0
    let totalAccumulated = convInitialMoney
    const results: ResponseTable[] = []

    const sumFinalTotalAmount =
      convInitialMoney * Math.pow(1 + convInterestPercentage, convPeriod) +
      (convMonthMoney *
        (Math.pow(1 + convInterestPercentage, convPeriod) - 1)) /
        convInterestPercentage

    const sumTotalInvested = convInitialMoney + convMonthMoney * convPeriod

    setFinalTotalInvested(sumTotalInvested)
    setTotalInterest(sumFinalTotalAmount - sumTotalInvested)
    setFinalTotalAmount(sumFinalTotalAmount)

    for (let i = 1; i <= convPeriod; i++) {
      const fees = totalAccumulated * convInterestPercentage

      const amount = totalAccumulated + fees

      totalInvested = totalInvested + convMonthMoney
      totalInterest = totalInterest + fees
      totalAccumulated = amount + convMonthMoney

      results.push({
        month: i,
        fees,
        totalInvested,
        totalInterest,
        totalAccumulated,
      })
    }

    setResult(results)
    setIsCalculate(true)
  }

  function handleValueChange(newValue: number) {
    setInterestPercentage(newValue)
  }

  return (
    <div className="bg-zinc-900 text-zinc-100 flex flex-col w-full min-h-screen h-full items-center pb-10">
      <main className="flex flex-col justify-center items-center w-full px-5 mx-auto gap-10">
        <form
          className="grid md:grid-cols-2 gap-4 w-full max-w-5xl mt-10"
          onSubmit={handleSubmit(handleCalculate)}
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
              // value={initialMoney}
              // onChange={(event: FormEvent<HTMLInputElement>) =>
              //   setInitialMoney(event.currentTarget.value)
              // }
              {...register('initialMoney')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handleCalculate)()
                }
              }}
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
              // value={monthMoney}
              // onChange={(event: FormEvent<HTMLInputElement>) =>
              //   setMonthMoney(event.currentTarget.value)
              // }

              {...register('monthMoney')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handleCalculate)()
                }
              }}
            />
          </div>
          <div className="flex flex-col justify-between">
            <label
              htmlFor=""
              className="font-semibold mb-2 flex flex-row justify-between"
            >
              <p>
                Taxa de juros <i>(a.m)</i>
              </p>
              <span className="">{interestPercentage}%</span>
            </label>

            <Slider.Root
              defaultValue={[0.9]}
              min={0.1}
              max={2}
              step={0.01}
              aria-label="Volume"
              className="relative flex h-5 w-full touch-none items-center"
              onValueChange={(value) => handleValueChange(value[0])}
            >
              <Slider.Track className="relative h-1 w-full grow rounded-full bg-zinc-800">
                <Slider.Range className="absolute h-full rounded-full bg-white" />
              </Slider.Track>
              <Slider.Thumb
                className="block h-5 w-5 rounded-full bg-white focus:outline-none 
                focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75"
              />
            </Slider.Root>

            {/* 
            <input
              type="text"
              placeholder="10%"
              className="p-3 bg-zinc-800 rounded-lg border-collapse
            outline-none focus:ring-2 ring-green-300"
              value={interestPercentage}
            // onChange={(event: FormEvent<HTMLInputElement>) =>
            //   setInterestPercentage(event.currentTarget.value)
            // }
            /> */}
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="font-semibold mb-2">
              Período <i>(meses)</i>
            </label>
            <input
              type="text"
              placeholder="10"
              className="p-3 bg-zinc-800 rounded-lg border-collapse
            outline-none focus:ring-2 ring-green-300"
              // value={period}
              // onChange={(event: FormEvent<HTMLInputElement>) =>
              //   setPeriod(event.currentTarget.value)
              // }
              {...register('period')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handleCalculate)()
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-300 hover:bg-green-500 transition-colors rounded-lg h-12 text-zinc-900 font-semibold disabled:bg-zinc-500"
          >
            Calcular
          </button>
        </form>
        <section className="w-full max-w-5xl">
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
                )
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}
