import {
  BarbellIcon,
  BrainIcon,
  CrosshairIcon,
  RocketLaunchIcon,
  TimerIcon,
  XIcon
} from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react"

import { Storage } from "@plasmohq/storage"

import "~/src/global.css"

import { Badge } from "~src/components/ui/badge"
import { Button } from "~src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~src/components/ui/card"
import { Label } from "~src/components/ui/label"
import { Separator } from "~src/components/ui/separator"
import { Textarea } from "~src/components/ui/textarea"
import { getDomain } from "~src/libs/utils"

import { sitesInfo, type SitesInfo } from "./sites-info"

const storage = new Storage({
  area: "local"
})

// Access using: chrome-extension://[id]/tabs/block-content.html
function BlockContentPage() {
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reason, setReason] = useState("")
  const [blockedTime, setBlockedTime] = useState(0)
  const [todayBlocks, setTodayBlocks] = useState(0)

  useEffect(() => {
    // Track time since page loaded
    const timer = setInterval(() => {
      setBlockedTime((prev) => prev + 1)
    }, 1000)

    // Load and increment today's block count
    const loadBlockCount = async () => {
      const currentCount = await storage.get<number>("todayBlocks")
      const newCount = (currentCount || 0) + 1
      setTodayBlocks(newCount)
      await storage.set("todayBlocks", newCount)
    }

    loadBlockCount()

    return () => clearInterval(timer)
  }, [])

  const requestedUrl: string | null = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get("requestedUrl")
  }, [])

  const requestedDomain: string | null = useMemo(() => {
    if (!requestedUrl) return null
    return getDomain(requestedUrl)
  }, [requestedUrl])

  const siteRequestedInfo: SitesInfo | null = useMemo(() => {
    if (!requestedDomain) return null

    return sitesInfo[requestedDomain] ?? null
  }, [requestedDomain])

  console.log("Site Info:", siteRequestedInfo)

  const motivationalMessages = [
    "Estamos trabalhando para recuperar sua mente, para você alcançar suas metas...",
    "Proteja seu foco. Seu futuro agradece.",
    "Cada distração custa mais do que você imagina.",
    "Seu tempo é precioso. Use-o com sabedoria.",
    "Grandes conquistas exigem foco profundo."
  ]

  const incentives = [
    {
      emoji: <CrosshairIcon size={32} weight="fill" />,
      title: "Foco total",
      message: "Mantenha-se na zona de produtividade máxima"
    },
    {
      emoji: <BarbellIcon size={32} weight="fill" />,
      title: "Força mental",
      message: "Cada 'não' fortalece sua disciplina"
    },
    {
      emoji: <RocketLaunchIcon size={32} weight="fill" />,
      title: "Produtividade",
      message: "Seus objetivos estão mais próximos agora"
    },
    {
      emoji: <TimerIcon size={32} weight="fill" />,
      title: "Tempo é valioso",
      message: "Use cada minuto para o que realmente importa"
    },
    {
      emoji: <BrainIcon size={32} weight="fill" />,
      title: "Mente clara",
      message: "Sem distrações, apenas resultados"
    }
  ]

  const randomMessage = useMemo(() => {
    return motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ]
  }, [])

  const randomIncentive = useMemo(() => {
    return incentives[Math.floor(Math.random() * incentives.length)]
  }, [])

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
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header Stats */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Flocus</h1>
            <p className="text-sm text-muted-foreground">Protegendo seu foco</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary tabular-nums">
                {todayBlocks}
              </div>
              <div className="text-xs text-muted-foreground">
                {todayBlocks === 1 ? "bloqueio" : "bloqueios"}
              </div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-right">
              <div className="text-2xl font-bold text-accent tabular-nums font-mono">
                {formatTime(blockedTime)}
              </div>
              <div className="text-xs text-muted-foreground">tempo salvo</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Block Message */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    {siteRequestedInfo?.icon ? (
                      <siteRequestedInfo.icon
                        size={32}
                        weight="fill"
                        className="text-primary"
                      />
                    ) : (
                      <XIcon size={32} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Bloqueado
                    </Badge>
                    <CardTitle className="text-2xl">
                      {siteRequestedInfo?.name || requestedDomain}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {randomMessage}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Action Card */}
            <Card>
              <CardContent>
                {!showReasonInput ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Precisa acessar este site urgentemente?
                    </p>
                    <Button
                      onClick={handleAccessWithReason}
                      variant="outline"
                      size="lg"
                      className="w-full">
                      Solicitar acesso com justificativa
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reason">
                        Por que você precisa acessar agora?
                      </Label>
                      <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Descreva o motivo do acesso..."
                        rows={4}
                        autoFocus
                      />
                      <p className="text-xs text-muted-foreground">
                        Mínimo 10 caracteres • {reason.length}/10
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setShowReasonInput(false)}
                        variant="ghost"
                        className="flex-1">
                        Cancelar
                      </Button>
                      <Button onClick={handleSubmitReason} className="flex-1">
                        Enviar justificativa
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Motivation */}
          <div className="lg:sticky lg:top-12 space-y-6">
            <Card className="overflow-hidden pt-0">
              <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4 text-6xl">
                  {randomIncentive.emoji}
                </div>
                <CardTitle className="text-3xl mb-3">
                  {randomIncentive.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {randomIncentive.message}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dicas de foco</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium mt-0.5">
                      1
                    </span>
                    <span>Faça pausas regulares a cada 25-50 minutos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium mt-0.5">
                      2
                    </span>
                    <span>Mantenha-se hidratado e com boa postura</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium mt-0.5">
                      3
                    </span>
                    <span>Uma tarefa por vez produz melhores resultados</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockContentPage
