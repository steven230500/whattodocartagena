"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipForward, SkipBack, MapPin, Clock, Volume2 } from "lucide-react"

interface RoutePlayerProps {
  route: {
    title: string
    description: string
    duration: string
    distance: string
    steps: Array<{
      id: number
      title: string
      description: string
      audioUrl: string
      duration: string
      image: string
    }>
  }
}

export function RoutePlayer({ route }: RoutePlayerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentStepData = route.steps[currentStep]

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextStep = () => {
    if (currentStep < route.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setIsPlaying(false)
      setProgress(0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setIsPlaying(false)
      setProgress(0)
    }
  }

  return (
    <div className="p-6 bg-background overflow-y-auto">
      {/* Route Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">{route.title}</h1>
        <p className="text-muted-foreground mb-4">{route.description}</p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{route.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{route.distance}</span>
          </div>
        </div>
      </div>

      {/* Current Step */}
      <Card className="mb-6 border-0 shadow-lg">
        <div className="relative h-48">
          <img
            src={currentStepData.image || "/placeholder.svg"}
            alt={currentStepData.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-coral text-white border-0">
              Paso {currentStep + 1} de {route.steps.length}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="font-serif text-xl">{currentStepData.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-6 text-pretty">{currentStepData.description}</p>

          {/* Audio Player */}
          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Audio Guía</span>
              </div>
              <span className="text-sm text-muted-foreground">{currentStepData.duration}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div
                className="bg-coral h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Audio Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                size="sm"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="bg-transparent"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                onClick={togglePlay}
                className="bg-coral hover:bg-coral-dark text-white w-12 h-12 rounded-full"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={nextStep}
                disabled={currentStep === route.steps.length - 1}
                className="bg-transparent"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={currentStepData.audioUrl}
            onTimeUpdate={() => {
              if (audioRef.current) {
                const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
                setProgress(progress)
              }
            }}
            onEnded={() => {
              setIsPlaying(false)
              setProgress(0)
            }}
          />
        </CardContent>
      </Card>

      {/* Steps List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground mb-4">Pasos de la Ruta</h3>
        {route.steps.map((step, index) => (
          <Card
            key={step.id}
            className={`cursor-pointer transition-all duration-200 border-0 ${
              index === currentStep ? "bg-coral/10 ring-2 ring-coral/20" : "hover:bg-muted/50"
            }`}
            onClick={() => {
              setCurrentStep(index)
              setIsPlaying(false)
              setProgress(0)
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === currentStep ? "bg-coral text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.duration}</p>
                </div>
                {index === currentStep && isPlaying && <div className="w-2 h-2 bg-coral rounded-full animate-pulse" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
