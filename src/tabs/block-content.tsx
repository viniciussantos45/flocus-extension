import {
  BarbellIcon,
  BrainIcon,
  CrosshairIcon,
  RocketLaunchIcon,
  TimerIcon,
  XIcon
} from "@phosphor-icons/react"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

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
import { accessHistoryDB } from "~src/libs/access-history-db"

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

    // Celebration confetti effect on mount
    const celebrateBlock = () => {
      // First burst from center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Side bursts for extra dopamine
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        })
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        })
      }, 150)
    }

    celebrateBlock()

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

  const isContentCreationReason = (text: string): boolean => {
    const trimmed = text.toLowerCase()
    const contentCreationKeywords = [
      'criar',
      'gravar',
      'postar',
      'publicar',
      'editar',
      'video',
      'vídeo',
      'conteudo',
      'conteúdo',
      'thumbnail',
      'upload',
      'canal',
      'inscritos',
      'criar conteúdo',
      'produzir',
      'tutorial',
      'aula',
      'live',
      'transmissão',
      'streaming'
    ]

    return contentCreationKeywords.some(keyword => trimmed.includes(keyword))
  }

  const isValidReason = (text: string): boolean => {
    const trimmed = text.trim()

    // Check minimum length
    if (trimmed.length < 10) return false

    // Auto-accept if it's about content creation
    if (isContentCreationReason(text)) return true

    // Check for repeated characters (e.g., "aaaaaaaaaa")
    const hasRepeatedChars = /(.)\1{5,}/.test(trimmed)
    if (hasRepeatedChars) return false

    // Check for keyboard patterns (e.g., "asdfasdf", "qwertyqwerty")
    const keyboardPatterns = ['asdf', 'qwer', 'zxcv', '1234', 'abcd']
    const hasKeyboardPattern = keyboardPatterns.some(pattern =>
      trimmed.toLowerCase().includes(pattern.repeat(2))
    )
    if (hasKeyboardPattern) return false

    // Check for diverse characters (should have at least 5 different characters)
    const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, ''))
    if (uniqueChars.size < 5) return false

    // Check for at least 2 words
    const words = trimmed.split(/\s+/).filter(w => w.length > 0)
    if (words.length < 2) return false

    return true
  }

  const checkRecentAccess = async (domain: string): Promise<boolean> => {
    try {
      const domainHistory = await accessHistoryDB.getEntriesByDomain(domain)
      const oneHourAgo = Date.now() - 60 * 60 * 1000 // 1 hour ago

      // Check if any access was granted within the last hour
      const recentAccess = domainHistory.find(
        (entry) => entry.timestamp > oneHourAgo
      )

      return !!recentAccess
    } catch (error) {
      console.error("Failed to check recent access:", error)
      return false // Allow access if check fails
    }
  }

  const handleSubmitReason = async () => {
    if (!isValidReason(reason)) {
      alert("Por favor, forneça um motivo válido e significativo (mínimo 10 caracteres, sem padrões repetitivos)")
      return
    }

    console.log("Access reason:", reason)

    // Check for recent access within the last hour
    if (requestedDomain) {
      const hasRecentAccess = await checkRecentAccess(requestedDomain)
      if (hasRecentAccess) {
        alert("Você já solicitou acesso a este site na última hora. Aguarde antes de solicitar novamente.")
        return
      }
    }

    // Store temporary access with 10-minute expiration
    if (requestedDomain) {
      const expirationTime = Date.now() + 10 * 60 * 1000 // 10 minutes from now
      const tempAccess = await storage.get<Record<string, number>>("temporaryAccess") || {}
      tempAccess[requestedDomain] = expirationTime
      await storage.set("temporaryAccess", tempAccess)

      console.log(`Temporary access granted for ${requestedDomain} until ${new Date(expirationTime).toLocaleTimeString()}`)

      // Save to access history in IndexedDB
      try {
        await accessHistoryDB.addEntry({
          domain: requestedDomain,
          reason: reason.trim(),
          timestamp: Date.now(),
          expirationTime,
          wasContentCreation: isContentCreationReason(reason)
        })
        console.log("Access history saved to IndexedDB")
      } catch (error) {
        console.error("Failed to save access history:", error)
      }
    }

    // Cautious confetti - smaller celebration for getting access
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#fbbf24', '#f59e0b', '#d97706']
    })

    alert("Acesso temporário concedido por 10 minutos. Mantenha o foco!")

    // Redirect to the requested URL
    if (requestedUrl) {
      window.location.href = requestedUrl
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  }

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        className="container mx-auto px-4 py-12 max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Stats */}
        <motion.div
          className="flex items-center justify-between mb-12"
          variants={itemVariants}
        >
          <div className="space-y-1">
            <motion.h1
              className="text-3xl font-bold tracking-tight"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              Flocus
            </motion.h1>
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            >
              Protegendo seu foco
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              className="text-right"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            >
              <div className="text-2xl font-bold text-primary tabular-nums">
                {todayBlocks}
              </div>
              <div className="text-xs text-muted-foreground">
                {todayBlocks === 1 ? "bloqueio" : "bloqueios"}
              </div>
            </motion.div>
            <Separator orientation="vertical" className="h-10" />
            <motion.div
              className="text-right"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-2xl font-bold text-accent tabular-nums font-mono">
                {formatTime(blockedTime)}
              </div>
              <div className="text-xs text-muted-foreground">tempo salvo</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Block Message */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {siteRequestedInfo?.icon ? (
                        <siteRequestedInfo.icon
                          size={32}
                          weight="fill"
                          className="text-primary"
                        />
                      ) : (
                        <XIcon size={32} className="text-primary" />
                      )}
                    </motion.div>
                    <div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      >
                        <Badge variant="secondary" className="mb-2">
                          Bloqueado
                        </Badge>
                      </motion.div>
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
            </motion.div>

            {/* Action Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card>
                <CardContent>
                  {!showReasonInput ? (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-sm text-muted-foreground">
                        Precisa acessar este site urgentemente?
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleAccessWithReason}
                          variant="outline"
                          size="lg"
                          className="w-full">
                          Solicitar acesso com justificativa
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
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
                        <motion.p
                          className="text-xs text-muted-foreground"
                          animate={{
                            color: reason.length >= 10 ? "#22c55e" : "#94a3b8"
                          }}
                        >
                          Mínimo 10 caracteres • {reason.length}/10
                        </motion.p>
                      </div>
                      <div className="flex gap-3">
                        <motion.div
                          className="flex-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => setShowReasonInput(false)}
                            variant="ghost"
                            className="w-full">
                            Cancelar
                          </Button>
                        </motion.div>
                        <motion.div
                          className="flex-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button onClick={handleSubmitReason} className="w-full">
                            Enviar justificativa
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right: Motivation */}
          <motion.div
            className="lg:sticky lg:top-12 space-y-6"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="overflow-hidden pt-0">
                <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary animate-gradient" />
                <CardHeader className="text-center pb-8">
                  <motion.div
                    className="mx-auto mb-4 text-6xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {randomIncentive.emoji}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <CardTitle className="text-3xl mb-3">
                      {randomIncentive.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {randomIncentive.message}
                    </CardDescription>
                  </motion.div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dicas de foco</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {[
                      "Faça pausas regulares a cada 25-50 minutos",
                      "Mantenha-se hidratado e com boa postura",
                      "Uma tarefa por vez produz melhores resultados"
                    ].map((tip, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.span
                          className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium mt-0.5"
                          whileHover={{
                            scale: 1.2,
                            backgroundColor: "hsl(var(--primary))",
                            color: "hsl(var(--primary-foreground))"
                          }}
                        >
                          {index + 1}
                        </motion.span>
                        <span>{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default BlockContentPage
