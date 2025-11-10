import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  ListBulletsIcon,
  ShieldCheckIcon
} from "@phosphor-icons/react"
import { LazyMotion, m } from "framer-motion"
import { useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { Storage } from "@plasmohq/storage"

import "~/src/global.css"

import logo from "data-base64:../../assets/logo.png"

import { Badge } from "~src/components/ui/badge"
import { Button } from "~src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~src/components/ui/card"
import { Separator } from "~src/components/ui/separator"
import { AddUrlDialog } from "~src/components/AddUrlDialog"

const storage = new Storage({ area: "local" })

// Default blocked URLs from background.ts
const defaultBlockedUrls = [
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "reddit.com",
  "gupy.io",
  "linkedin.com"
]

// ⚠️ Loader dinâmico das features do DOM
const loadDomFeatures = async () => (await import("framer-motion")).domAnimation

function ManageBlockedUrls() {
  const [customBlockedUrls, setCustomBlockedUrls] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)

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

  // Load custom blocked URLs
  useEffect(() => {
    if (!isReady) return

    loadCustomUrls()
  }, [isReady])

  const loadCustomUrls = async () => {
    const urls = (await storage.get<string[]>("customBlockedUrls")) || []
    setCustomBlockedUrls(urls)
  }

  const handleUrlAdded = async () => {
    // Reload the custom URLs when a new one is added
    await loadCustomUrls()
  }

  const handleDeleteUrl = async (url: string) => {
    if (!confirm(`Tem certeza que deseja desbloquear: ${url}?`)) {
      return
    }

    try {
      const updatedUrls = customBlockedUrls.filter((u) => u !== url)
      await storage.set("customBlockedUrls", updatedUrls)
      setCustomBlockedUrls(updatedUrls)

      alert(`URL desbloqueada: ${url}`)
    } catch (error) {
      console.error("Failed to delete URL:", error)
      alert("Erro ao remover URL bloqueada")
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

  const totalBlocked = defaultBlockedUrls.length + customBlockedUrls.length

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
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <m.div
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="gap-2">
                  <ArrowLeftIcon size={16} weight="bold" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
              </m.div>

              <Separator orientation="vertical" className="h-12" />

              <div className="flex items-center gap-4">
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
                <div>
                  <m.h1
                    className="text-3xl font-bold tracking-tight"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}>
                    URLs Bloqueadas
                  </m.h1>

                  <m.p
                    className="text-sm text-muted-foreground"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 100 }}>
                    Gerencie suas URLs e domínios bloqueados
                  </m.p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Add URL Button */}
              <AddUrlDialog
                variant="default"
                size="default"
                showIcon={true}
                buttonText="Adicionar URL"
                onUrlAdded={handleUrlAdded}
              />

              <Separator orientation="vertical" className="h-12" />

              {/* Total Counter */}
              <m.div
                className="text-right relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" as const }}>
                <m.div
                  className="absolute inset-0 rounded-lg blur-xl opacity-20 bg-primary"
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
                    {totalBlocked}
                  </m.div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                    URLs bloqueadas
                  </div>
                </div>
              </m.div>
            </div>
          </m.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Default URLs */}
            <m.div
              className="space-y-6"
              variants={itemVariants}
              initial="hidden"
              animate="visible">
              <m.div
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)"
                }}
                transition={{
                  type: "spring" as const,
                  stiffness: 400,
                  damping: 25
                }}
                className="rounded-xl">
                <Card className="border-2 border-border/50 transition-colors hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <m.div
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                        animate={{
                          rotate: [0, 6, -6, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut" as const
                        }}>
                        <ShieldCheckIcon
                          size={28}
                          weight="fill"
                          className="text-primary"
                        />
                      </m.div>
                      <div>
                        <CardTitle className="text-2xl">
                          URLs Padrão
                        </CardTitle>
                        <CardDescription>
                          URLs bloqueadas por padrão
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {defaultBlockedUrls.map((url, index) => (
                        <m.div
                          key={url}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.05,
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ x: 4, scale: 1.02 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-sm font-medium font-mono">
                              {url}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Padrão
                          </Badge>
                        </m.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </m.div>
            </m.div>

            {/* Custom URLs */}
            <m.div
              className="space-y-6"
              variants={itemVariants}
              initial="hidden"
              animate="visible">
              <m.div
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)"
                }}
                transition={{
                  type: "spring" as const,
                  stiffness: 400,
                  damping: 25
                }}
                className="rounded-xl">
                <Card className="border-2 border-border/50 transition-colors hover:border-accent/30">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
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
                        <ListBulletsIcon
                          size={28}
                          weight="fill"
                          className="text-accent"
                        />
                      </m.div>
                      <div>
                        <CardTitle className="text-2xl">
                          URLs Personalizadas
                        </CardTitle>
                        <CardDescription>
                          URLs adicionadas por você
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {customBlockedUrls.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <m.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}>
                          <PlusIcon
                            size={48}
                            weight="thin"
                            className="mx-auto mb-4 opacity-30"
                          />
                          <p className="text-sm">
                            Nenhuma URL personalizada ainda.
                          </p>
                          <p className="text-xs mt-2">
                            Clique em "Adicionar URL" para começar
                          </p>
                        </m.div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {customBlockedUrls.map((url, index) => (
                          <m.div
                            key={url}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 200
                            }}
                            whileHover={{ x: 4, scale: 1.02 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30 group">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                              <span className="text-sm font-medium font-mono">
                                {url}
                              </span>
                            </div>
                            <m.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUrl(url)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive">
                                <TrashIcon size={16} weight="bold" />
                              </Button>
                            </m.div>
                          </m.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </m.div>
            </m.div>
          </div>
        </m.div>
      </div>
    </LazyMotion>
  )
}

function ManageBlockedUrlsPage() {
  return (
    <ErrorBoundary fallback={<div>Algo deu errado</div>}>
      <ManageBlockedUrls />
    </ErrorBoundary>
  )
}

export default ManageBlockedUrlsPage
