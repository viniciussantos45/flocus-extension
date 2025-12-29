import {
  BarbellIcon,
  BrainIcon,
  CheckCircleIcon,
  CrosshairIcon,
  GearIcon,
  LightbulbFilamentIcon,
  ListChecksIcon,
  RocketLaunchIcon,
  TimerIcon,
  XIcon
} from "@phosphor-icons/react"
import confetti from "canvas-confetti"
import { LazyMotion, m } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { Storage } from "@plasmohq/storage"

import "~/src/global.css"

import logo from "data-base64:../../assets/logo.png"

import { AddUrlDialog } from "~src/components/AddUrlDialog"
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
import { accessHistoryDB } from "~src/libs/access-history-db"
import { getDomain } from "~src/libs/utils"
import { todoistService, type TodoistTask } from "~src/services/todoist"

import { sitesInfo, type SitesInfo } from "./sites-info"

const storage = new Storage({ area: "local" })

// ⚠️ Loader dinâmico das features do DOM — impede tree-shaking indevido
const loadDomFeatures = async () => (await import("framer-motion")).domAnimation

function BlockContent() {
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reason, setReason] = useState("")
  const [blockedTime, setBlockedTime] = useState(0)
  const [todayBlocks, setTodayBlocks] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [todoistTasks, setTodoistTasks] = useState<TodoistTask[]>([])
  const [hasTodoistIntegration, setHasTodoistIntegration] = useState(false)

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  // Aguarda DOM pronto
  useEffect(() => {
    const onReady = () => setTimeout(() => setIsReady(true), 80)
    if (document.readyState === "complete") onReady()
    else window.addEventListener("load", onReady)
    return () => window.removeEventListener("load", onReady)
  }, [])

  // Load Todoist tasks
  useEffect(() => {
    if (!isReady) return

    const loadTodoistTasks = async () => {
      const hasKey = await todoistService.hasApiKey()
      setHasTodoistIntegration(hasKey)

      if (hasKey) {
        const tasks = await todoistService.getRecentTasks(5)
        setTodoistTasks(tasks)
      }
    }

    loadTodoistTasks()
  }, [isReady])

  // Métricas + confetti
  useEffect(() => {
    if (!isReady) return

    const timer = setInterval(() => setBlockedTime((p) => p + 1), 1000)

    const loadBlockCount = async () => {
      const currentCount = await storage.get<number>("todayBlocks")
      const newCount = (currentCount || 0) + 1
      setTodayBlocks(newCount)
      await storage.set("todayBlocks", newCount)
    }

    const celebrateBlock = () => {
      // Get theme colors from CSS variables
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim()
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim()

      // Convert HSL to usable format for confetti
      const colors = [
        `hsl(${primaryColor})`,
        `hsl(${accentColor})`,
        "#FF1744", // Keep some vibrant colors for variety
        "#00E676",
        "#FFD600",
        "#E040FB"
      ]

      // First burst - central explosion
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors,
        startVelocity: 45,
        gravity: 1.2,
        scalar: 1.2
      })

      // Second wave - side bursts
      setTimeout(() => {
        // Left side
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.7 },
          colors,
          startVelocity: 35
        })
        // Right side
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.7 },
          colors,
          startVelocity: 35
        })
      }, 200)

      // Third wave - Stars from top
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 360,
          origin: { y: 0.3 },
          colors,
          shapes: ["circle", "square"],
          gravity: 0.8,
          scalar: 0.8
        })
      }, 400)
    }

    loadBlockCount()
    celebrateBlock()
    return () => clearInterval(timer)
  }, [isReady])

  // Params
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

  // Textos
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

  const randomMessage = useMemo(
    () =>
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ],
    []
  )

  const randomIncentive = useMemo(
    () => incentives[Math.floor(Math.random() * incentives.length)],
    []
  )

  // Helpers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAccessWithReason = () => setShowReasonInput(true)

  const isContentCreationReason = (text: string): boolean => {
    const trimmed = text.toLowerCase()
    const contentCreationKeywords = [
      "criar",
      "gravar",
      "postar",
      "publicar",
      "editar",
      "video",
      "vídeo",
      "conteudo",
      "conteúdo",
      "thumbnail",
      "upload",
      "canal",
      "inscritos",
      "criar conteúdo",
      "produzir",
      "tutorial",
      "aula",
      "live",
      "transmissão",
      "streaming"
    ]
    return contentCreationKeywords.some((k) => trimmed.includes(k))
  }

  const isValidReason = (text: string): boolean => {
    const trimmed = text.trim()
    if (trimmed.length < 10) return false
    if (isContentCreationReason(text)) return true
    if (/(.)\1{5,}/.test(trimmed)) return false
    const keyboardPatterns = ["asdf", "qwer", "zxcv", "1234", "abcd"]
    if (
      keyboardPatterns.some((p) => trimmed.toLowerCase().includes(p.repeat(2)))
    )
      return false
    const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, ""))
    if (uniqueChars.size < 5) return false
    const words = trimmed.split(/\s+/).filter((w) => w.length > 0)
    if (words.length < 2) return false
    return true
  }

  const checkRecentAccess = async (domain: string): Promise<boolean> => {
    try {
      const domainHistory = await accessHistoryDB.getEntriesByDomain(domain)
      const oneHourAgo = Date.now() - 60 * 60 * 1000
      const recentAccess = domainHistory.find((e) => e.timestamp > oneHourAgo)
      return !!recentAccess
    } catch (e) {
      console.error("Failed to check recent access:", e)
      return false
    }
  }

  const handleSubmitReason = async () => {
    if (!isValidReason(reason)) {
      alert(
        "Por favor, forneça um motivo válido e significativo (mínimo 10 caracteres, sem padrões repetitivos)"
      )
      return
    }

    if (requestedDomain) {
      const hasRecentAccess = await checkRecentAccess(requestedDomain)
      if (hasRecentAccess) {
        alert(
          "Você já solicitou acesso a este site na última hora. Aguarde antes de solicitar novamente."
        )
        return
      }
    }

    if (requestedDomain) {
      const expirationTime = Date.now() + 10 * 60 * 1000
      const tempAccess =
        (await storage.get<Record<string, number>>("temporaryAccess")) || {}
      tempAccess[requestedDomain] = expirationTime
      await storage.set("temporaryAccess", tempAccess)

      try {
        await accessHistoryDB.addEntry({
          domain: requestedDomain,
          reason: reason.trim(),
          timestamp: Date.now(),
          expirationTime,
          wasContentCreation: isContentCreationReason(reason)
        })
      } catch (error) {
        console.error("Failed to save access history:", error)
      }
    }

    // Cautious confetti using theme colors
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim()

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: [`hsl(${accentColor})`, "#fbbf24", "#f59e0b"]
    })

    alert("Acesso temporário concedido por 10 minutos. Mantenha o foco!")

    if (requestedUrl) {
      window.location.href = requestedUrl
    }
  }

  if (!isReady) {
    return (
      <div className="p-8 text-center text-muted-foreground">Carregando...</div>
    )
  }

  // Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
        when: "beforeChildren"
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 15,
        mass: 0.8
      }
    }
  }

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.08, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: [0.4, 0, 0.2, 1] as any,
        repeatType: "reverse" as const
      }
    }
  }

  const SiteIcon = siteRequestedInfo?.icon

  return (
    <LazyMotion features={loadDomFeatures}>
      <div className="min-h-screen w-full bg-background text-foreground font-sans">
        <m.div
          className="container mx-auto px-4 py-12 max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible">
          {/* Header */}
          <m.div
            className="flex items-center justify-between mb-12"
            variants={itemVariants}
            initial="hidden"
            animate="visible">
            <div className="space-y-1">
              <div className="flex items-center flex-row-reverse">
                <div>
                  <m.h1
                    className="text-3xl font-bold tracking-tight"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}>
                    Flocus
                  </m.h1>

                  <m.p
                    className="text-sm text-muted-foreground"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 100 }}>
                    Protegendo seu foco
                  </m.p>
                </div>
                <m.img
                  className="text-3xl font-bold tracking-tight"
                  src={logo}
                  alt="Flocus Logo"
                  width={50}
                  height={50}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* Manage URLs Button */}
              <m.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href =
                      chrome.runtime.getURL("tabs/settings.html")
                  }}
                  className="gap-2 shadow-md hover:shadow-lg transition-shadow">
                  <GearIcon size={16} weight="bold" />
                  <span className="hidden sm:inline">Configurações</span>
                </Button>
              </m.div>

              <Separator orientation="vertical" className="h-12" />

              {/* Add URL Button */}
              <AddUrlDialog variant="default" size="sm" showIcon={true} />

              <Separator orientation="vertical" className="h-12" />

              {/* Block Counter with Glow */}
              <m.div
                className="text-right relative"
                variants={pulseVariants}
                initial="initial"
                animate="animate">
                <m.div
                  className="absolute inset-0 rounded-lg blur-xl opacity-30 bg-primary"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [0.8, 1.1, 0.8]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut" as const
                  }}
                />
                <div className="relative">
                  <m.div
                    className="text-3xl font-bold text-primary tabular-nums"
                    animate={{
                      textShadow: [
                        "0 0 0px hsl(var(--primary) / 0)",
                        "0 0 15px hsl(var(--primary) / 0.6)",
                        "0 0 0px hsl(var(--primary) / 0)"
                      ]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut" as const
                    }}>
                    {todayBlocks}
                  </m.div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                    {todayBlocks === 1 ? "bloqueio" : "bloqueios"}
                  </div>
                </div>
              </m.div>

              <Separator orientation="vertical" className="h-12" />

              {/* Time Counter with Progress Ring */}
              <m.div
                className="text-right relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" as const }}>
                <m.div
                  className="absolute inset-0 rounded-lg blur-xl opacity-20 bg-accent"
                  animate={{
                    opacity: [0.15, 0.35, 0.15],
                    scale: [0.9, 1.15, 0.9]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut" as const
                  }}
                />
                <div className="relative">
                  <m.div
                    className="text-3xl font-bold text-accent tabular-nums font-mono"
                    animate={{
                      opacity: [0.85, 1, 0.85]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut" as const
                    }}>
                    {formatTime(blockedTime)}
                  </m.div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                    tempo salvo
                  </div>
                </div>
              </m.div>
            </div>
          </m.div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Esquerda */}
            <m.div
              className="lg:sticky lg:top-12"
              variants={itemVariants}
              initial="hidden"
              animate="visible">
              {/* Card de Motivação Integrado */}
              <m.div
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0 25px 50px -15px rgba(0, 0, 0, 0.35)"
                }}
                transition={{
                  type: "spring" as const,
                  stiffness: 400,
                  damping: 25
                }}
                className="rounded-xl">
                <Card className="overflow-hidden pt-0 border-2 border-border/50 relative">
                  {/* Animated gradient bar */}
                  <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary animate-gradient relative overflow-hidden">
                    <m.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear" as const
                      }}
                    />
                  </div>

                  <CardHeader className="text-center pb-6 pt-6 relative">
                    {/* Glow background */}
                    <m.div
                      className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-20"
                      style={{
                        background:
                          "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)"
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut" as const
                      }}
                    />

                    {/* Emoji with enhanced animation */}
                    <m.div
                      className="mx-auto mb-6 text-7xl relative z-10"
                      animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, 8, -8, 0],
                        y: [0, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut" as const
                      }}
                      whileHover={{
                        scale: 1.3,
                        rotate: 0,
                        transition: { duration: 0.3 }
                      }}>
                      {randomIncentive.emoji}
                    </m.div>

                    {/* Text content */}
                    <m.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, type: "spring" as const }}>
                      <CardTitle className="text-3xl mb-4 font-bold">
                        {randomIncentive.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed px-4">
                        {randomIncentive.message}
                      </CardDescription>
                    </m.div>
                  </CardHeader>

                  {/* Separator with animated shine */}
                  <m.div
                    className="relative h-px bg-gradient-to-r from-transparent via-border to-transparent mx-8 mb-6"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}>
                    <m.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear" as const,
                        delay: 1.5
                      }}
                    />
                  </m.div>

                  {/* Tips Section Integrado */}
                  <CardContent className="pt-0 pb-8">
                    <m.div
                      className="flex items-center justify-center gap-2 mb-6"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, type: "spring" as const }}>
                      <m.span
                        className="text-2xl"
                        animate={{
                          rotate: [0, 10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut" as const
                        }}>
                        <LightbulbFilamentIcon
                          size={24}
                          weight="fill"
                          className="text-yellow-200"
                        />
                      </m.span>
                      <h3 className="text-lg font-semibold">Dicas de foco</h3>
                    </m.div>

                    <ul className="space-y-4 text-sm px-4">
                      {[
                        "Faça pausas regulares a cada 25-50 minutos",
                        "Mantenha-se hidratado e com boa postura",
                        "Uma tarefa por vez produz melhores resultados"
                      ].map((tip, index) => (
                        <m.li
                          key={index}
                          className="flex items-start gap-3 group cursor-default"
                          initial={{ opacity: 0, x: -30, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{
                            delay: 1.4 + index * 0.4,
                            type: "spring" as const,
                            stiffness: 200,
                            damping: 20
                          }}
                          whileHover={{ x: 8, scale: 1.02 }}>
                          <m.span
                            className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary text-xs font-bold mt-0.5 shadow-md"
                            initial={{ rotate: -180, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{
                              delay: 1.4 + index * 0.4 + 0.2,
                              type: "spring" as const,
                              stiffness: 300,
                              damping: 15
                            }}
                            whileHover={{
                              scale: 1.4,
                              rotate: 360,
                              background:
                                "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
                              boxShadow: "0 0 20px hsl(var(--primary) / 0.5)"
                            }}
                            transition={{
                              type: "spring" as const,
                              stiffness: 500,
                              damping: 20
                            }}>
                            {index + 1}
                          </m.span>
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                            {tip}
                          </span>
                        </m.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </m.div>
            </m.div>

            <m.div
              className="space-y-6"
              variants={itemVariants}
              initial="hidden"
              animate="visible">
              <m.div
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)"
                }}
                transition={{
                  type: "spring" as const,
                  stiffness: 400,
                  damping: 25
                }}
                initial="hidden"
                animate="visible"
                className="rounded-xl">
                <Card className="border-2 border-border/50 transition-colors hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <m.div
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden"
                        animate={{
                          rotate: [0, 6, -6, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut" as const
                        }}
                        whileHover={{ scale: 1.15, rotate: 0 }}>
                        <m.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            rotate: [0, 180, 360]
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear" as const
                          }}
                        />
                        {SiteIcon ? (
                          <SiteIcon
                            size={32}
                            weight="fill"
                            className="text-primary"
                          />
                        ) : (
                          <XIcon size={32} className="text-primary" />
                        )}
                      </m.div>
                      <div>
                        <m.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.3,
                            type: "spring",
                            stiffness: 200
                          }}>
                          <Badge variant="secondary" className="mb-2">
                            Bloqueado
                          </Badge>
                        </m.div>
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
              </m.div>

              {/* Ações */}
              <m.div
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)"
                }}
                transition={{
                  type: "spring" as const,
                  stiffness: 400,
                  damping: 25
                }}
                initial="hidden"
                animate="visible"
                className="rounded-xl">
                <Card className="border-2 border-border/50 transition-colors hover:border-accent/30">
                  <CardContent>
                    {!showReasonInput ? (
                      <m.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, type: "spring" as const }}>
                        <p className="text-sm text-muted-foreground text-center">
                          Precisa acessar este site urgentemente?
                        </p>
                        <Button
                          onClick={handleAccessWithReason}
                          variant="ghost"
                          size="lg"
                          className="w-full font-medium shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                          <m.span
                            className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                          <span className="relative">
                            Solicitar acesso com justificativa
                          </span>
                        </Button>
                      </m.div>
                    ) : (
                      <m.div
                        className="space-y-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}>
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
                          {/* Character counter with theme colors */}
                          <p
                            className={
                              "text-xs font-medium transition-colors " +
                              (reason.length >= 10
                                ? "text-accent"
                                : "text-muted-foreground")
                            }>
                            Mínimo 10 caracteres • {reason.length}/10
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <m.div
                            className="flex-1"
                            whileHover={{ scale: 1.06, y: -2 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{
                              type: "spring" as const,
                              stiffness: 500,
                              damping: 30
                            }}>
                            <Button
                              onClick={() => setShowReasonInput(false)}
                              variant="ghost"
                              className="w-full shadow-md hover:shadow-lg transition-shadow">
                              Cancelar
                            </Button>
                          </m.div>
                          <m.div
                            className="flex-1"
                            whileHover={{
                              scale: 1.06,
                              y: -2,
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                            }}
                            whileTap={{ scale: 0.94 }}
                            transition={{
                              type: "spring" as const,
                              stiffness: 500,
                              damping: 30
                            }}>
                            <Button
                              onClick={handleSubmitReason}
                              className="w-full font-medium shadow-lg relative overflow-hidden group"
                              disabled={!isValidReason(reason)}>
                              <m.div
                                className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/20 to-primary-foreground/0"
                                initial={{ x: "-100%" }}
                                animate={{ x: "200%" }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear" as const
                                }}
                              />
                              <span className="relative">
                                Enviar justificativa
                              </span>
                            </Button>
                          </m.div>
                        </div>
                      </m.div>
                    )}
                  </CardContent>
                </Card>
              </m.div>

              {/* Todoist Tasks Card */}
              {hasTodoistIntegration && todoistTasks.length > 0 && (
                <m.div
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)"
                  }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 400,
                    damping: 25
                  }}
                  className="rounded-xl mt-8">
                  <Card className="border-2 border-border/50 transition-colors hover:border-accent/30">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <m.div
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center"
                          animate={{
                            rotate: [0, -6, 6, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut" as const
                          }}>
                          <ListChecksIcon
                            size={28}
                            weight="fill"
                            className="text-accent"
                          />
                        </m.div>
                        <div>
                          <CardTitle className="text-xl">
                            Suas Tarefas
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Pendências do Todoist
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-3">
                        {todoistTasks.map((task, index) => (
                          <m.li
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.6 + index * 0.1,
                              type: "spring",
                              stiffness: 200
                            }}
                            whileHover={{ x: 4, scale: 1.02 }}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30 group cursor-default">
                            <m.div
                              className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5"
                              whileHover={{
                                scale: 1.3,
                                backgroundColor: "hsl(var(--accent))"
                              }}>
                              <CheckCircleIcon
                                size={14}
                                weight="bold"
                                className="text-accent group-hover:text-accent-foreground transition-colors"
                              />
                            </m.div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-relaxed break-words">
                                {task.content}
                              </p>
                              {task.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            {task.priority > 1 && (
                              <Badge
                                variant="secondary"
                                className="text-xs flex-shrink-0">
                                P{task.priority}
                              </Badge>
                            )}
                          </m.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </m.div>
              )}
            </m.div>
          </div>
        </m.div>
      </div>
    </LazyMotion>
  )
}

function BlockContentPage() {
  return (
    <ErrorBoundary fallback={<div>Algo deu errado</div>}>
      <BlockContent />
    </ErrorBoundary>
  )
}

export default BlockContentPage
