'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="text-slate-900 dark:text-slate-100 w-full mx-auto flex max-w-screen-xl p-5">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Button asChild variant="link">
              <Link href="/">Home</Link>
            </Button>
            {/* <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link> */}
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button asChild variant="link">
              <Link href="/importacao">Importação</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button asChild variant="link">
              <Link href="/investimento">Investimento</Link>
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
