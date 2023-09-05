'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
import { calculateImportTaxes } from '../../utils/calculate-import'

const formSchema = z.object({
  // price: z.string().transform((value) =>
  //   value
  //     .replace(/[^\d,.]/g, '')
  //     .replace(/(R|\$|\s)/g, '')
  //     .replace(/[^0-9,.]/g, '')
  //     .replace(',', '.'),
  // ),
  price: z
    .string()
    .transform((value) => value.replace(/[^\d,]/g, '').replace(',', '.')),
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  async function handleCalculate({ price }: FormSchema) {
    console.log(price)
    const { percentage, onlyTaxes, onlyTaxICMS, importTax, valueTotal } =
      calculateImportTaxes(parseFloat(price), tax, taxICMS)

    setPercentage(percentage)
    setOnlyTaxes(onlyTaxes)
    setOnlyTaxICMS(onlyTaxICMS)
    setImportTax(importTax)
    setValueTotal(valueTotal)

    addCalculation({
      price: price.replace('.', ',').replace(/[^\d,]/g, ''),
      percentage,
      onlyTaxes,
      onlyTaxICMS,
      importTax,
      importTaxPercent: tax.toFixed(2),
      importTaxICMSPercent: taxICMS.toFixed(2),
      valueTotal,
    })
  }

  return (
    <main className="flex flex-col w-full p-5 min-h-screen md:max-w-screen-xl mx-auto ">
      <form
        onSubmit={handleSubmit(handleCalculate)}
        className="grid gap-5 md:grid-cols-2 w-full text-slate-900 dark:text-slate-100"
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
            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
              {taxICMS}%
            </span>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Imposto de importação
              </CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ {importTax}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Imposto de ICMS
              </CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ {onlyTaxICMS}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Imposto
              </CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ {onlyTaxes}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor final</CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ {valueTotal}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Porcentagem</CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{percentage}%</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-5">
        <GoogleAdSense adSlot="5984875372" />
      </section>

      <section className="mt-20 text-slate-900 dark:text-slate-100">
        <Table>
          <TableCaption>Histórico</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Preço do Produto - R$</TableHead>
              <TableHead>Imposto %</TableHead>
              <TableHead>Imposto - R$</TableHead>
              <TableHead>Imposto ICMS - %</TableHead>
              <TableHead>Imposto ICMS - R$</TableHead>
              <TableHead>Total de impostos - R$</TableHead>
              <TableHead>Valor Final - R$</TableHead>
              <TableHead>Porcentagem - %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
      </section>
    </main>
  )
}