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
import { GoogleAdSense } from '@/components/google-adsense'
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
    <main className="flex flex-col w-full p-5 min-h-screen md:max-w-screen-xl mx-auto">
      <div className="mb-5 flex flex-col">
        <h1 className="font-bold text-2xl">
          Quanto tempo leva para receber um salário mínimo?
        </h1>
        <span className="font-light text-sm italic opacity-75">
          Começando com um investimento inicial de R$ 0 e contribuindo
          mensalmente por 95 meses (oito anos) com R$ 1.000, você receberá uma
          renda passiva mensal de R$ 1.321,51, com uma taxa de juros de 0,9% ao
          mês.
        </span>
      </div>
      <form
        className="grid md:grid-cols-2 gap-5 w-full"
        onSubmit={handleSubmit(handleCalculate)}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="initialMoney">Valor inicial</Label>
          <Input
            id="initialMoney"
            type="text"
            required
            placeholder="R$ 1.500,00"
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
            placeholder="R$ 100,00"
            {...register('monthMoney')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(handleCalculate)()
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="taxICMS" title="Imposto de ICMS">
              Taxa de juros (a.m)
            </Label>
            <p className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
              {interestPercentage}%
            </p>
          </div>

          <Slider
            defaultValue={[0.9]}
            min={0.1}
            max={2}
            step={0.01}
            className="w-full"
            onValueChange={(value) => handleValueChange(value[0])}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="">
            Período <i>(meses)</i>
          </Label>
          <Input
            type="text"
            placeholder="120 -> 10 anos"
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
      <section className="mt-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                Total de juros
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
      <section className="mt-10">
        <ScrollArea className="w-full h-[620px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead>Juros</TableHead>
                <TableHead>Total investido</TableHead>
                <TableHead>Total juros</TableHead>
                <TableHead>Total acumulado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.map((data) => {
                return (
                  <TableRow key={data.month}>
                    <TableCell>{data.month}</TableCell>
                    <TableCell>{formattedCurrency(data.fees)}</TableCell>
                    <TableCell>
                      {formattedCurrency(data.totalInvested)}
                    </TableCell>
                    <TableCell>
                      {formattedCurrency(data.totalInterest)}
                    </TableCell>
                    <TableCell>
                      {formattedCurrency(data.totalAccumulated)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </section>
      <section className="mt-5">
        <GoogleAdSense adSlot="5984875372" />
      </section>
    </main>
  )
}
