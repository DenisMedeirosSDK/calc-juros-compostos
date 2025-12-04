import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AirConditioning } from "./components/air-conditioning"
import { FullHouse } from "./components/full-house"


export default function SolarEnergy() {

  return (
    <main className="flex flex-col w-full p-5 min-h-screen md:max-w-screen-xl mx-auto">

      <Tabs defaultValue="home" className="">
        <TabsList>
          <TabsTrigger value="home">Sistema Solar para a Casa Toda</TabsTrigger>
          <TabsTrigger value="airConditioning">Sistema Solar Apenas para o Ar-Condicionado</TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <FullHouse />
        </TabsContent>

        <TabsContent value="airConditioning">
          <AirConditioning />
        </TabsContent>
      </Tabs>

    </main >
  )
}