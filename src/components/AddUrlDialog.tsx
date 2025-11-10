import { PlusIcon } from "@phosphor-icons/react"
import confetti from "canvas-confetti"
import { m } from "framer-motion"
import { useState } from "react"

import { Storage } from "@plasmohq/storage"

import { Button } from "~src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~src/components/ui/dialog"
import { Input } from "~src/components/ui/input"
import { Label } from "~src/components/ui/label"
import { getDomain } from "~src/libs/utils"

const storage = new Storage({ area: "local" })

interface AddUrlDialogProps {
  onUrlAdded?: (url: string) => void
  trigger?: React.ReactNode
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  buttonText?: string
  className?: string
}

export function AddUrlDialog({
  onUrlAdded,
  trigger,
  variant = "default",
  size = "sm",
  showIcon = true,
  buttonText = "Adicionar URL",
  className = ""
}: AddUrlDialogProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [newUrl, setNewUrl] = useState("")
  const [blockType, setBlockType] = useState<"domain" | "url">("domain")

  const handleAddBlockedUrl = async () => {
    const trimmedUrl = newUrl.trim()

    if (!trimmedUrl) {
      alert("Por favor, insira uma URL válida")
      return
    }

    try {
      // Get current blocked URLs from storage
      const customBlockedUrls =
        (await storage.get<string[]>("customBlockedUrls")) || []

      let urlToBlock = trimmedUrl

      // If blocking domain, extract domain from URL
      if (blockType === "domain") {
        try {
          const domain = getDomain(
            trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`
          )
          if (!domain) {
            alert("Não foi possível extrair o domínio da URL fornecida")
            return
          }
          urlToBlock = domain
        } catch (error) {
          alert("URL inválida. Por favor, insira uma URL válida")
          return
        }
      }

      // Check if URL/domain is already blocked
      if (customBlockedUrls.includes(urlToBlock)) {
        alert("Esta URL/domínio já está bloqueada")
        return
      }

      // Add to blocked list
      customBlockedUrls.push(urlToBlock)
      await storage.set("customBlockedUrls", customBlockedUrls)

      // Confetti celebration
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim()

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [`hsl(${primaryColor})`, "#00E676", "#FFD600"]
      })

      alert(`URL bloqueada com sucesso: ${urlToBlock}`)

      // Notify parent component
      if (onUrlAdded) {
        onUrlAdded(urlToBlock)
      }

      // Reset form
      setNewUrl("")
      setBlockType("domain")
      setShowDialog(false)
    } catch (error) {
      console.error("Failed to add blocked URL:", error)
      alert("Erro ao adicionar URL bloqueada")
    }
  }

  const defaultTrigger = (
    <m.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}>
      <Button
        variant={variant}
        size={size}
        className={`gap-2 shadow-md hover:shadow-lg transition-shadow ${className}`}>
        {showIcon && <PlusIcon size={16} weight="bold" />}
        <span className="hidden sm:inline">{buttonText}</span>
      </Button>
    </m.div>
  )

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="text-foreground">
        <DialogHeader>
          <DialogTitle>Bloquear nova URL</DialogTitle>
          <DialogDescription>
            Adicione uma nova URL ou domínio para bloquear e manter o foco.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url-input">URL ou Domínio</Label>
            <Input
              id="url-input"
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="exemplo.com ou https://exemplo.com/pagina"
              autoFocus
            />
          </div>
          <div className="space-y-3">
            <Label>Tipo de bloqueio</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={blockType === "domain" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setBlockType("domain")}>
                Domínio inteiro
              </Button>
              <Button
                type="button"
                variant={blockType === "url" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setBlockType("url")}>
                URL específica
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {blockType === "domain"
                ? "Bloqueará todas as páginas deste domínio"
                : "Bloqueará apenas esta URL específica"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setShowDialog(false)
              setNewUrl("")
              setBlockType("domain")
            }}>
            Cancelar
          </Button>
          <Button onClick={handleAddBlockedUrl} disabled={!newUrl.trim()}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
