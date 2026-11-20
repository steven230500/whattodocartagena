"use client"

import { useEffect, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
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
  const t = useTranslations("nav")
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
      <Link
        href="/login"
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2"
      >
        {t("login")}
      </Link>
    )
  }

  const initial = user.email.charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={pending} className="rounded-full">
        <Avatar className="w-9 h-9 cursor-pointer">
          <AvatarFallback className="bg-coral/15 text-coral-ink font-semibold">{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="flex items-center gap-2 cursor-pointer">
            <Heart className="w-4 h-4" />
            {t("favorites")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/achievements" className="flex items-center gap-2 cursor-pointer">
            <Trophy className="w-4 h-4" />
            {t("achievements")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-business" className="flex items-center gap-2 cursor-pointer">
            <Store className="w-4 h-4" />
            {t("myBusiness")}
          </Link>
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
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
