'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
// import * as Slider from '@radix-ui/react-slider'
import { Slider } from '@/components/ui/slider'
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
  initialMoney: z
    .string()
    .transform((value) => value.replace(/[^\d,]/g, '').replace(',', '.')),
  monthMoney: z
    .string()
    .transform((value) => value.replace(/[^\d,]/g, '').replace(',', '.')),
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
    const convInitialMoney = Number(data.initialMoney)
    const convMonthMoney = Number(data.monthMoney)
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
    <div className="flex flex-col w-full min-h-screen h-full items-center pb-10">
      <main className="flex flex-col justify-center items-center w-full px-5 mx-auto gap-10">
        <form
          className="grid md:grid-cols-2 gap-4 w-full max-w-5xl mt-10"
          onSubmit={handleSubmit(handleCalculate)}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="initialMoney">Valor inicial</Label>
            <Input
              id="initialMoney"
              type="text"
              required
              placeholder="R$1.000,00"
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="monthMoney">Valor mensal</Label>
            <Input
              id="monthMoney"
              type="text"
              required
              placeholder="R$100,00"
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
          <div className="flex flex-col justify-between gap-2">
            <Label
              htmlFor=""
              className="font-semibold mb-2 flex flex-row justify-between"
            >
              <p>
                Taxa de juros <i>(a.m)</i>
              </p>
              <span className="">{interestPercentage}%</span>
            </Label>

            <Slider
              defaultValue={[0.9]}
              min={0.1}
              max={2}
              step={0.01}
              aria-label="Volume"
              className="w-full"
              onValueChange={(value) => handleValueChange(value[0])}
            />

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
          <div className="flex flex-col gap-2">
            <Label htmlFor="">
              Período <i>(meses)</i>
            </Label>
            <Input
              type="text"
              placeholder="10"
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

          <Button type="submit" disabled={isSubmitting}>
            Calcular
          </Button>
        </form>
        <section className="w-full max-w-5xl">
          <div className="grid md:grid-cols-3 md:justify-between items-center gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formattedCurrency(finalTotalAmount)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor investido
                </CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formattedCurrency(finalTotalInvested)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total em juros
                </CardTitle>
                <CardDescription>Valor recebido</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formattedCurrency(totalInterest)}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="w-full max-w-5xl">
          <ScrollArea className="w-full h-[620px]">
            <Table className="min-w-full">
              <TableHeader className="">
                <TableRow className="capitalize">
                  <TableHead className="p-3 tracking-wide text-center rounded-tl-lg">
                    Mês
                  </TableHead>
                  <TableHead className="p-3 tracking-wide text-center">
                    Juros
                  </TableHead>
                  <TableHead className="p-3 tracking-wide text-center">
                    Total investido
                  </TableHead>
                  <TableHead className="p-3 tracking-wide text-center">
                    Total juros
                  </TableHead>
                  <TableHead className="p-3 tracking-wide text-center rounded-tr-lg">
                    Total acumulado
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.map((data) => {
                  return (
                    <TableRow key={data.month} className=" last:rounded-b-lg">
                      <TableCell className="p-3 text-center ">
                        {data.month}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {formattedCurrency(data.fees)}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {formattedCurrency(data.totalInvested)}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {formattedCurrency(data.totalInterest)}
                      </TableCell>
                      <TableCell className="p-3 text-center">
                        {formattedCurrency(data.totalAccumulated)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </section>
      </main>
    </div>
  )
}
