"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type LucideIcon, ArrowRight } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  color?: string
  href?: string
  onClick?: () => void
  buttonText?: string
  image?: string
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  color = "bg-coral",
  href,
  onClick,
  buttonText = "Explorar",
  image,
}: FeatureCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden h-full">
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div
            className={`absolute top-4 right-4 w-10 h-10 ${color} rounded-full flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      )}

      <CardHeader className={!image ? "pt-8" : ""}>
        {!image && (
          <div
            className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        <CardTitle className="font-serif text-xl group-hover:text-coral transition-colors text-balance">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <p className="text-muted-foreground text-pretty mb-6 flex-1">{description}</p>

        <Button
          variant="outline"
          className="bg-transparent hover:bg-coral hover:text-white hover:border-coral transition-all group/btn w-full"
          onClick={onClick}
        >
          {buttonText}
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}
