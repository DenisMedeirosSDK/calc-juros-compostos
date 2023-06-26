import { zodResolver } from '@hookform/resolvers/zod';
import { CheckFat } from "@phosphor-icons/react";
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Slider from '@radix-ui/react-slider';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { Card } from '../components/Card';

type CurrencyData = {
  [currencyPair: string]: Currency;
};

type Currency = {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
};

const formSchema = z.object({
  money: z.coerce.number(),
  declareMoney: z.coerce.number().nullable().default(0),
  dollar: z.coerce.number().nullable().default(0)
})

type FormSchema = z.infer<typeof formSchema>;

export function TaxImport() {
  // const [money, setMoney] = useState(0);
  // const [dollar, setDollar] = useState(0);
  const [tax, setTax] = useState(60);
  const [taxICMS, setTaxICMS] = useState(17);

  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isDollarToday, setIsDollarToday] = useState(false);

  const [total, setTotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [prodTotal, setProdTotal] = useState(0);
  const [percentsTax, setPercentsTax] = useState(0);

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  })

  async function handleCalculateTax({ money, declareMoney, dollar, }: FormSchema) {
    if (dollar === null) {
      dollar = 0
    }
    if (declareMoney === null) {
      declareMoney = 0
    }

    if (isAdvanced === true) {
      const getDollarToday = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
      const dataDollarToday: CurrencyData = await getDollarToday.json()
      const dollarToday = Number(dataDollarToday['USDBRL'].ask)

      if (isDollarToday === true) {
        dollar = dollarToday
      }

      let VD = declareMoney * dollar;

      let taxa = (VD * ((tax / 100) + (taxICMS / 100))) / (1 - (taxICMS / 100))

      let percents = (taxa / VD) * 100

      const fixPercents = percents.toFixed(2)

      setTotalTax(taxa)
      setProdTotal(VD)
      setTotal(taxa + VD)
      setPercentsTax(Number(fixPercents))
    } else {
      const VD = money;

      let taxa = (VD * ((tax / 100) + (taxICMS / 100))) / (1 - (taxICMS / 100))

      let percents = (taxa / VD) * 100

      const fixPercents = percents.toFixed(2)

      setTotalTax(taxa)
      setProdTotal(VD)
      setTotal(taxa + VD)
      setPercentsTax(Number(fixPercents))
    }
  }

  return (
    <div className="bg-zinc-900 text-zinc-100 flex flex-col w-full min-h-screen h-full items-center pb-10">
      <main className="flex flex-col justify-center items-center w-full px-5 mx-auto gap-10">
        <form onSubmit={handleSubmit(handleCalculateTax)} className="grid md:grid-cols-2 gap-4 w-full max-w-5xl mt-10">
          <div className="flex flex-col">
            <label htmlFor="" className="font-semibold mb-2 text-white">
              Valor do produto
            </label>
            <input
              type="text"
              required
              disabled={isAdvanced}
              placeholder="R$500,00"
              className="p-3 bg-zinc-800 rounded-lg border-collapse
              outline-none focus:ring-2 ring-green-300 disabled:opacity-30"
              {...register('money')}
            />
          </div>
          <div className="flex flex-row justify-between md:flex-col max-h-[80px] ">
            <label className="font-semibold mb-2 text-white">
              Avançado
            </label>
            <div className='flex flex-row h-full items-center'>
              <Checkbox.Root id='advanced'
                defaultChecked
                checked={isAdvanced}
                onCheckedChange={(checked) => setIsAdvanced(checked === true ? true : false)}
                className="flex h-5 w-5 items-center justify-center rounded [data-state='checked']:bg-white 
                [data-state='unchecked']:bg-gray-100 dark:[data-state='unchecked']:bg-gray-900 focus:outline-none 
                focus-visible:ring focus-visible:ring-green-300 focus-visible:ring-opacity-75">
                <Checkbox.Indicator >
                  <CheckFat weight="fill" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label htmlFor='advanced'
                className="ml-3 select-none text-sm font-medium text-white dark:text-gray-100">opções avançadas</label>
            </div>
          </div>
          {isAdvanced && (
            <>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold mb-2 text-white">
                  Valor declarado em Dólar
                </label>
                <input
                  type="text"
                  disabled={!isAdvanced}
                  placeholder="$100.00"
                  className="p-3 bg-zinc-800 rounded-lg border-collapse
              outline-none focus:ring-2 ring-green-300 disabled:opacity-30"
                  {...register('declareMoney')}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-semibold mb-2 text-white flex flex-row justify-between">
                  Valor do Dólar R$
                  <div className='flex flex-row items-center'>
                    <Checkbox.Root id='dollarToday'
                      defaultChecked
                      checked={isDollarToday}
                      onCheckedChange={(checked) => setIsDollarToday(checked === true ? true : false)}
                      className='flex h-5 w-5 items-center justify-center rounded focus:outline-none disabled:cursor-not-allowed data-[state=checked]:bg-green-300'>

                      <div className="group-data-[state=checked]:bg-green-300 group-data-[state=unchecked]:bg-gray-100 
                      dark:group-data-[state=checked]:bg-green-900 focus:outline-none group-focus-visible:ring 
                      group-focus-visible:ring-green-300 group-focus-visible:ring-opacity-75 group-focus:ring-offset-2 group-focus:ring-offset-background">
                        {/* <div className='group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors'> */}
                        <Checkbox.Indicator>
                          <CheckFat weight="fill" />
                        </Checkbox.Indicator>
                      </div>
                    </Checkbox.Root>
                    <label htmlFor='dollarToday' className="ml-3 select-none text-sm font-medium text-white dark:text-gray-100">Dólar atual</label>
                  </div>
                </label>
                <input
                  type="text"
                  required={!isDollarToday}
                  disabled={!isAdvanced || isDollarToday}
                  placeholder="R$4,95"
                  className="p-3 bg-zinc-800 rounded-lg border-collapse
              outline-none focus:ring-2 ring-green-300 disabled:opacity-30"
                  {...register('dollar')}
                />
              </div>
            </>
          )}

          <div className="flex flex-col">
            <label htmlFor="" className="font-semibold mb-2 text-white flex justify-between">
              <p>Imposto</p><span>{tax}%</span>
            </label>

            <Slider.Root defaultValue={[tax]} min={0} max={100} step={1} aria-label="Volume"
              className="relative flex h-5 w-full touch-none items-center"

              onValueChange={(value) => setTax(value[0])}
            >
              <Slider.Track className="relative h-1 w-full grow rounded-full bg-zinc-800">
                <Slider.Range className="absolute h-full rounded-full bg-white" />
              </Slider.Track>
              <Slider.Thumb
                className="block h-5 w-5 rounded-full bg-white focus:outline-none 
                focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75"
              />
            </Slider.Root>
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="font-semibold mb-2 text-white flex justify-between">
              <p>Imposto de ICMS</p><span>{taxICMS}%</span>
            </label>
            <Slider.Root defaultValue={[taxICMS]} min={0} max={100} step={1} aria-label="Volume"
              className="relative flex h-5 w-full touch-none items-center"

              onValueChange={(value) => setTaxICMS(value[0])}
            >
              <Slider.Track className="relative h-1 w-full grow rounded-full bg-zinc-800">
                <Slider.Range className="absolute h-full rounded-full bg-white" />
              </Slider.Track>
              <Slider.Thumb
                className="block h-5 w-5 rounded-full bg-white focus:outline-none 
                focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75"
              />
            </Slider.Root>
          </div>

          <button
            type="submit"
            // onClick={handleCalculateTax}
            disabled={isSubmitting}
            className="bg-green-300 hover:bg-green-400 transition-colors rounded-lg h-12 text-gray-900 font-semibold focus:outline-none 
            focus-visible:ring focus-visible:ring-green-500"
          >
            Calcular
          </button>
        </form>

        <section className="w-full max-w-5xl">
          <div className="grid md:grid-cols-4 md:justify-between items-center gap-5">
            <Card title="Imposto de importação" currency={totalTax} />
            <Card title="Valor do produto" currency={prodTotal} />
            <Card title="Valor final" currency={total} />
            <Card title="Porcentagem" currency={percentsTax} isCurrency={false} />
          </div>
        </section>

      </main>

    </div>
  )
}
