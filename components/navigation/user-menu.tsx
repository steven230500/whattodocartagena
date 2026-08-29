"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Heart, LogOut, Trophy, Store } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutUser } from "@/app/actions/auth"

interface SessionUser {
  id: string
  email: string
}

export function UserMenu() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUser(data.user ?? null)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (user === undefined) {
    return <div className="w-9 h-9" />
  }

  if (user === null) {
    return (
      <a
        href="/login"
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2"
      >
        Iniciar sesión
      </a>
    )
  }

  const initial = user.email.charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={pending} className="rounded-full">
        <Avatar className="w-9 h-9 cursor-pointer">
          <AvatarFallback className="bg-coral/15 text-coral font-semibold">{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/favorites" className="flex items-center gap-2 cursor-pointer">
            <Heart className="w-4 h-4" />
            Favoritos
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/achievements" className="flex items-center gap-2 cursor-pointer">
            <Trophy className="w-4 h-4" />
            Logros
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/my-business" className="flex items-center gap-2 cursor-pointer">
            <Store className="w-4 h-4" />
            Mi negocio
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await logoutUser()
              setUser(null)
              router.push("/")
              router.refresh()
            })
          }}
          className="flex items-center gap-2 cursor-pointer text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
