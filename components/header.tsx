'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

type MenuItem = {
  label: string
  path: string
}

const MENU_LIST: MenuItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Importação', path: '/importacao' },
  { label: 'Investimento', path: '/investimento' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full mx-auto flex max-w-screen-xl p-5">
      <NavigationMenu>
        <NavigationMenuList>
          {MENU_LIST.map((link) => {
            const isActive = pathname === link.path
            return (
              <NavigationMenuItem key={link.path}>
                <Button asChild variant="link">
                  <Link
                    href={link.path}
                    data-active={isActive}
                    className={'data-[active=true]:text-slate-600'}
                  >
                    {link.label}
                  </Link>
                </Button>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
