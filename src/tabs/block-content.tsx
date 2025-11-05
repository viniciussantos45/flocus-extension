import { useEffect, useState } from "react"

import "~/src/global.css"

import { Badge } from "~src/components/ui/badge"
import { Button } from "~src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~src/components/ui/card"
import { Label } from "~src/components/ui/label"
import { Separator } from "~src/components/ui/separator"
import { Textarea } from "~src/components/ui/textarea"

// Access using: chrome-extension://[id]/tabs/block-content.html
function BlockContentPage() {
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reason, setReason] = useState("")
  const [blockedTime, setBlockedTime] = useState(0)
  const [todayBlocks, setTodayBlocks] = useState(0)

  useEffect(() => {
    // Track time since page loaded
    // const timer = setInterval(() => {
    //   setBlockedTime((prev) => prev + 1)
    // }, 1000)
    // // Load today's block count
    // chrome.storage.local.get(["todayBlocks"], (result) => {
    //   const newCount = (result.todayBlocks || 0) + 1
    //   setTodayBlocks(newCount)
    //   chrome.storage.local.set({ todayBlocks: newCount })
    // })
    // return () => clearInterval(timer)
  }, [])

  const motivationalMessages = [
    "Estamos trabalhando para recuperar sua mente, para você alcançar suas metas...",
    "Proteja seu foco. Seu futuro agradece.",
    "Cada distração custa mais do que você imagina.",
    "Seu tempo é precioso. Use-o com sabedoria.",
    "Grandes conquistas exigem foco profundo."
  ]

  const incentives = [
    {
      emoji: "🎯",
      title: "Foco total",
      message: "Mantenha-se na zona de produtividade máxima"
    },
    {
      emoji: "💪",
      title: "Força mental",
      message: "Cada 'não' fortalece sua disciplina"
    },
    {
      emoji: "🚀",
      title: "Produtividade",
      message: "Seus objetivos estão mais próximos agora"
    },
    {
      emoji: "⏰",
      title: "Tempo é valioso",
      message: "Use cada minuto para o que realmente importa"
    },
    {
      emoji: "🧠",
      title: "Mente clara",
      message: "Sem distrações, apenas resultados"
    }
  ]

  const randomMessage =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ]

  const randomIncentive =
    incentives[Math.floor(Math.random() * incentives.length)]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAccessWithReason = () => {
    setShowReasonInput(true)
  }

  const handleSubmitReason = () => {
    if (reason.trim().length > 10) {
      console.log("Access reason:", reason)
      alert("Acesso temporário concedido. Mantenha o foco!")
      window.history.back()
    } else {
      alert("Por favor, forneça um motivo válido (mínimo 10 caracteres)")
    }
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {/* Left Card - Stats */}
        <Card className="hidden lg:flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm uppercase">Seu Foco Hoje</CardTitle>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-5xl font-bold text-primary">
                {todayBlocks}
              </span>
              <span className="text-lg text-muted-foreground">
                {todayBlocks === 1 ? "bloqueio" : "bloqueios"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Separator />

            <div className="space-y-2">
              <p className="text-sm uppercase">Tempo Salvo</p>
              <div className="text-3xl font-bold text-accent font-mono">
                {formatTime(blockedTime)}
              </div>
              <p className="text-xs text-muted-foreground">
                desde este bloqueio
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Badge variant="outline" className="w-full justify-center">
              Continue focado!
            </Badge>
          </CardFooter>
        </Card>

        {/* Center Card - Main Content */}
        <Card className="flex flex-col items-center justify-center border-none shadow-none">
          <CardHeader className="space-y-8 items-center">
            <div className="space-y-4 max-w-md text-center">
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl">
                Site Bloqueado
              </CardTitle>
              <CardDescription className="text-base md:text-lg">
                {randomMessage}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="w-full max-w-md">
            {!showReasonInput ? (
              <div className="space-y-4">
                <Button
                  onClick={handleAccessWithReason}
                  variant="outline"
                  size="lg"
                  className="w-full">
                  Quero acessar com motivo
                </Button>

                {/* Mobile stats */}
                <div className="lg:hidden flex items-center gap-6 text-sm text-muted-foreground justify-center pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {todayBlocks}
                    </span>
                    <span>bloqueios hoje</span>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-mono font-bold text-accent">
                      {formatTime(blockedTime)}
                    </span>
                    <span>salvo</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Justifique seu acesso</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Por que você precisa acessar este site agora?"
                    className="min-h-32 resize-none"
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 10 caracteres • {reason.length}/10
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowReasonInput(false)}
                    variant="outline"
                    className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmitReason} className="flex-1">
                    Enviar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Right Card - Incentives */}
        <Card>
          <CardHeader className="items-center text-center">
            <div className="text-7xl md:text-8xl pb-4">
              {randomIncentive.emoji}
            </div>
            <CardTitle className="text-xl md:text-2xl">
              {randomIncentive.title}
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              {randomIncentive.message}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Badge variant="outline">Você consegue!</Badge>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default BlockContentPage
