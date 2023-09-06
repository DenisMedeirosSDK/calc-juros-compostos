'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AlertCircle } from 'lucide-react'

import { GoogleAdSense } from '@/components/google-adsense'
import { useImportTaxesStore } from '@/store/import-taxes-store'
import { formattedCurrency, formattedPercent } from '@/utils/formatted-numbers'
import { calculateImportTaxes } from '../../utils/calculate-import'

const formSchema = z.object({
  price: z.string().min(2, {
    message: 'Adicione o valor do produto',
  }),
})

type FormSchema = z.infer<typeof formSchema>

export default function InternacionalImport() {
  const [tax, setTax] = useState(60)
  const [taxICMS, setTaxICMS] = useState(17)

  const [percentage, setPercentage] = useState('')
  const [onlyTaxes, setOnlyTaxes] = useState('')
  const [onlyTaxICMS, setOnlyTaxICMS] = useState('')
  const [importTax, setImportTax] = useState('')
  const [valueTotal, setValueTotal] = useState('')

  const { addCalculation, history } = useImportTaxesStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  async function handleCalculate({ price }: FormSchema) {
    const formattedPrice = parseFloat(
      price.replace(/[^\d,]/g, '').replace(',', '.'),
    )

    const { percentage, onlyTaxes, onlyTaxICMS, importTax, valueTotal } =
      calculateImportTaxes(formattedPrice, tax, taxICMS)

    setPercentage(percentage)
    setOnlyTaxes(onlyTaxes)
    setOnlyTaxICMS(onlyTaxICMS)
    setImportTax(importTax)
    setValueTotal(valueTotal)

    addCalculation({
      price: formattedCurrency(formattedPrice),
      percentage,
      onlyTaxes,
      onlyTaxICMS,
      importTax,
      importTaxPercent: formattedPercent(tax / 100),
      importTaxICMSPercent: formattedPercent(taxICMS / 100),
      valueTotal,
    })
  }

  return (
    <main className="flex flex-col w-full p-5 min-h-screen md:max-w-screen-xl mx-auto">
      <div className="mb-5 flex flex-col w-full">
        <h1 className="font-bold text-2xl">
          Quanto vai ficar minhas compras internacionais?
        </h1>
        <span className="font-light text-sm italic opacity-75">
          Shein, Shopee, Aliexpress
        </span>
      </div>
      <form
        onSubmit={handleSubmit(handleCalculate)}
        className="grid gap-5 md:grid-cols-2 w-full"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="productPrice" title="Preço do Produto">
              Preço do Produto
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger type="button" disabled>
                  <AlertCircle size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Utilize virgula para pontuação de decimal. Ex: R$1.997,00
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Input
            id="productPrice"
            placeholder="R$ 1.500,00"
            data-onError={!!errors.price}
            required
            className="data-[onError=true]:focus-visible:ring-red-500"
            {...register('price')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tax" title="Imposto">
              Imposto
            </Label>
            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
              {tax}%
            </span>
          </div>
          <Slider
            id="tax"
            defaultValue={[tax]}
            onValueChange={(value) => setTax(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="taxICMS" title="Imposto de ICMS">
              Imposto de ICMS
            </Label>
            <p className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
              {taxICMS}%
            </p>
          </div>
          <Slider
            id="taxICMS"
            defaultValue={[taxICMS]}
            onValueChange={(value) => setTaxICMS(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          Calcular
        </Button>
      </form>

      <section className="mt-20">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Imposto de importação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{importTax}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Imposto de ICMS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{onlyTaxICMS}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Imposto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{onlyTaxes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor final</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{valueTotal}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Preço original - imposto (%)
                </CardTitle>
              </div>

              <CardDescription>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button" disabled>
                      <AlertCircle size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Você esta pagando {percentage} de imposto do valor
                        original do produto.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{percentage}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-10 w-full">
        <div className="max-h-[620px] h-full overflow-auto">
          <Table>
            <TableCaption>Histórico</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Preço do Produto</TableHead>
                <TableHead>Imposto</TableHead>
                <TableHead>Imposto %</TableHead>
                <TableHead>Imposto ICMS</TableHead>
                <TableHead>Imposto ICMS %</TableHead>
                <TableHead>Total de impostos</TableHead>
                <TableHead>Valor Final</TableHead>
                <TableHead>Preço original - com imposto (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {history
                .map((cell, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{cell.price}</TableCell>
                      <TableCell>{cell.importTaxPercent}</TableCell>
                      <TableCell>{cell.importTax}</TableCell>
                      <TableCell>{cell.importTaxICMSPercent}</TableCell>
                      <TableCell>{cell.onlyTaxICMS}</TableCell>
                      <TableCell>{cell.onlyTaxes}</TableCell>
                      <TableCell>{cell.valueTotal}</TableCell>
                      <TableCell>{cell.percentage}</TableCell>
                    </TableRow>
                  )
                })
                .slice()
                .reverse()}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className="mt-5">
        <GoogleAdSense adSlot="5984875372" />
      </section>
    </main>
  )
}
