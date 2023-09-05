import Link from 'next/link'
import { Button } from './ui/button'

export function Footer() {
  return (
    <footer className="flex flex-col md:flex-row w-full mx-auto my-10 justify-center items-center">
      <p>copyright ©{new Date().getFullYear()}</p>
      <Button variant="link" asChild>
        <Link href="https://denis-medeiros.vercel.app/" target="_blank">
          Feito com ❤ por Denis Medeiros
        </Link>
      </Button>
    </footer>
  )
}
