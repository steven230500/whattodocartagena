"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface InfoCardProps {
  title: string
  content: string | React.ReactNode
  icon?: LucideIcon
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
    color?: string
  }
  color?: string
  className?: string
}

export function InfoCard({ title, content, icon: Icon, badge, color = "bg-coral", className = "" }: InfoCardProps) {
  return (
    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            )}
            <CardTitle className="font-serif text-lg">{title}</CardTitle>
          </div>
          {badge && (
            <Badge
              variant={badge.variant || "outline"}
              className={badge.color ? `${badge.color} text-white border-0` : ""}
            >
              {badge.text}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {typeof content === "string" ? <p className="text-muted-foreground text-pretty">{content}</p> : content}
      </CardContent>
    </Card>
  )
}
