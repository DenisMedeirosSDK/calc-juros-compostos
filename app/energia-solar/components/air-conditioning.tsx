"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { zodResolver } from "@hookform/resolvers/zod"
import { AirVent, AlertCircle, Sun } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from 'zod'

const formSchema = z.object({
  consumption: z.coerce.number().default(300),
  solarPanelWp: z.coerce.number().default(555),
  solarIrradiation: z.number().min(3.755).max(7.289).default(5.04),
  days: z.number().min(1).max(30).default(30),
  hours: z.number().min(1).max(24).default(24),

})

type FormSchema = z.infer<typeof formSchema>

export function AirConditioning() {

  const [solarPanels, setSolarPanels] = useState<number | null>(null)


  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const { formState: { isSubmitting }, handleSubmit, } = form

  async function handleCalculate({ consumption, solarPanelWp, solarIrradiation, days, hours }: FormSchema) {

    let consumptionHour = consumption / 2080
    let consumptionMonth = consumptionHour * hours * 30
    let solar = (solarPanelWp * solarIrradiation * 0.75 * 30) / 1000
    let TotalSolarPanels = consumptionMonth / solar

    setSolarPanels(TotalSolarPanels)
  }

  return (
    <main className="flex flex-col w-full p-5 mx-auto" >
      <div className="mb-5 flex flex-col w-full">
        <h1 className="font-bold text-2xl">
          Quantos painéis solares eu preciso para meu Ar-Condicionado?
        </h1>
        {/* <span className="font-light text-sm italic opacity-75">
          Geralmente uma casa que consome 300kWh/mês precisa de 5 paineis de 555W.
        </span> */}
      </div>
      <Form {...form}>

        <form
          onSubmit={handleSubmit(handleCalculate)}
          className="grid gap-5 md:grid-cols-2 w-full"
        >

          <FormField
            name="solarIrradiation"
            control={form.control}
            defaultValue={5.04}
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="solarIrradiation">Irradiação Solar Média da Sua Região (kWh/m²/dia)</FormLabel>
                  {error && <span>{error.message}</span>}
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row items-center gap-2">
                      <span>{field.value}</span>
                      <Sun size={24} />
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <AlertCircle size={16} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Atualmente você pode consultar a Irradiação Solar atravês do <a className="underline underline-offset-4" target="_blank" href="https://cresesb.cepel.br/index.php?section=sundata">Cresesb</a>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <FormControl>
                  <Slider
                    name="solarIrradiation"
                    onValueChange={(v) => field.onChange(v[0])}
                    defaultValue={[field.value]}
                    min={3.755}
                    max={7.289}
                    step={0.01}
                  />
                </FormControl>
              </FormItem>
            )}
          />


          <FormField
            name="hours"
            control={form.control}
            defaultValue={12}
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="hours">Horas de Uso do Ar-Condicionado por Dia</FormLabel>
                  {error && <span>{error.message}</span>}
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row items-center gap-2">
                      <span>{field.value}</span>
                      <AirVent size={24} />
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <AlertCircle size={16} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Quantidade média de horas que o ar-condicionado fica ligado diariamente.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <FormControl>
                  <Slider
                    name="hours"
                    onValueChange={(v) => field.onChange(v[0])}
                    defaultValue={[field.value]}
                    min={1}
                    max={24}
                    step={1}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consumption"
            // defaultValue={488}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel htmlFor="consumption" title="Consumo em kWh/ano">Consumo do Ar-Condicionado (kWh/ano)</FormLabel>
                  {error && <span>{error.message}</span>}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <AlertCircle size={16} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Valor informado na Etiqueta de Energia do aparelho.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input type="number" placeholder="488 kWh/ano" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="solarPanelWp"
            // defaultValue={600}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel htmlFor="solarPanelWp" title="Potência do Painel solar em Watts(W)">Potência do Painel Solar em Watts(W)</FormLabel>
                  {error && <span>{error.message}</span>}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <AlertCircle size={16} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Painéis populares possuem potências entre 550W e 600W.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input type="number" placeholder="555W" {...field} />
                </FormControl>
              </FormItem>
            )}
          />


          <Button type="submit" disabled={isSubmitting}>
            Calcular
          </Button>
        </form>
      </Form>
      {solarPanels !== null && (
        <section className="mt-20">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Calculado de Painéis Necessários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {solarPanels?.toFixed(2)}
                </p>

              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Quantidade Real (Arredondada para Instalação)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {Math.ceil(solarPanels)}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </main>
  )
}