"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form, FormControl, FormField, FormItem, FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { zodResolver } from "@hookform/resolvers/zod"
import { Activity, AlertCircle, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  monthlyConsumption: z.coerce.number().default(300),
  solarPanelWp: z.coerce.number().default(555),
  solarIrradiation: z.number().min(3.755).max(7.289).default(5.04),
  efficiency: z.number().min(0.1).max(1).default(0.75),
})

type FormSchema = z.infer<typeof formSchema>

export function FullHouse() {
  const [solarPanels, setSolarPanels] = useState<number | null>(null)

  // useEffect para observar mudanças em solarPanels
  useEffect(() => {
    // Verifica se solarPanels não é null para garantir que a renderização ocorra apenas após a primeira atualização
    if (solarPanels !== null) {
      // Aqui você pode realizar qualquer ação necessária após a atualização de solarPanels
      console.log("Solar panels updated:", solarPanels);
    }
  }, [solarPanels]); // Array de dependências, useEffect será chamado sempre que solarPanels mudar

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const { formState: { isSubmitting }, handleSubmit, } = form

  async function handleCalculate({ monthlyConsumption, solarPanelWp, efficiency, solarIrradiation }: FormSchema) {
    console.log(monthlyConsumption)

    let powerkWpPerDay = monthlyConsumption / 30.4
    console.log("PerDay" + powerkWpPerDay)

    let power = powerkWpPerDay / (solarIrradiation * 0.75)
    console.log('Wp' + power)

    let powerWp = power * 1000
    console.log('powerWp' + powerWp)

    let suport = powerWp / solarPanelWp
    let solarPanels = Math.ceil(suport)

    setSolarPanels(solarPanels)
    console.log('Solar' + solarPanels)
  }

  return (
    <main className="flex flex-col w-full p-5 mx-auto">
      <div className="mb-5 flex flex-col w-full">
        <h1 className="font-bold text-2xl">
          Quantos painéis eu preciso para minha casa?
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
            control={form.control}
            name="monthlyConsumption"
            // defaultValue={300}
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel htmlFor="monthlyConsumption" title="Consumo em kWh/mês">Seu consumo médio mensal em kWh/mês</FormLabel>
                  {error && <span>{error.message}</span>}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <AlertCircle size={16} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Utilize a média dos últimos 12 meses do seu consumo de energia.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input type="number" placeholder="350 kWh" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="solarIrradiation"
            control={form.control}
            defaultValue={5.04}
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="solarIrradiation">Irradiação Solar</FormLabel>
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
          {/* <FormField
            name="efficiency"
            control={form.control}
            defaultValue={0.75}
            render={({ field, fieldState: { error } }) => (
              <FormItem className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="efficiency">Eficiência do sistema</FormLabel>
                  {error && <span>{error.message}</span>}
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-row items-center gap-2">
                      <span>{field.value * 100}%</span>
                      <Activity size={24} />
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <AlertCircle size={16} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Todo sistema eletrico existe perdas
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <FormControl>
                  <Slider
                    name="efficiency"
                    onValueChange={(v) => field.onChange(v[0])}
                    defaultValue={[field.value]}
                    min={0.1}
                    max={1}
                    step={0.01}
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}


          <FormField
            control={form.control}
            name="solarPanelWp"
            // defaultValue={555}
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
          <div></div>

          <Button type="submit" disabled={isSubmitting}>
            Calcular
          </Button>
        </form>
      </Form>

      {solarPanels !== null && (
        <section className="mt-20">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Seu consumo mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{form.getValues("monthlyConsumption")}kWh/mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de paineis solares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{solarPanels}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Potência da placa solar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{form.getValues("solarPanelWp")}W</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Dias utilizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">30.4 Dias</p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Eficiência do sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{form.getValues("efficiency") * 100}%</p>
                <p className="text-2xl font-bold">{0.75 * 100}%</p>
              </CardContent>
            </Card> */}
          </div>
        </section>
      )}
    </main>
  )
}