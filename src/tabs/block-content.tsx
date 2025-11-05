import { useState } from "react"
import "~/src/global.css"

import { Button } from "~src/components/ui/button"

// Access using: chrome-extension://[id]/tabs/block-content.html
function BlockContentPage() {
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reason, setReason] = useState("")

  const motivationalMessages = [
    "Estamos trabalhando para recuperar sua mente, para você alcançar suas metas...",
    "Proteja seu foco. Seu futuro agradece.",
    "Cada distração custa mais do que você imagina.",
    "Seu tempo é precioso. Use-o com sabedoria.",
    "Grandes conquistas exigem foco profundo."
  ]

  const incentiveImages = [
    "🎯 Foco total",
    "💪 Força mental",
    "🚀 Produtividade",
    "⏰ Tempo é valioso",
    "🧠 Mente clara"
  ]

  const randomMessage =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ]

  const randomIncentive =
    incentiveImages[Math.floor(Math.random() * incentiveImages.length)]

  const handleAccessWithReason = () => {
    setShowReasonInput(true)
  }

  const handleSubmitReason = () => {
    if (reason.trim().length > 10) {
      // Log the reason and allow access
      console.log("Access reason:", reason)
      alert("Acesso temporário concedido. Mantenha o foco!")
      window.history.back()
    } else {
      alert("Por favor, forneça um motivo válido (mínimo 10 caracteres)")
    }
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left Box - Empty decorative */}
        <div className="hidden lg:block border-2 border-primary rounded-3xl h-96"></div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-xl lg:text-2xl text-center font-light leading-relaxed px-4 text-foreground">
            {randomMessage}
          </p>

          {!showReasonInput ? (
            <Button
              onClick={handleAccessWithReason}
              variant="outline"
              className="border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-6 rounded-2xl text-lg font-normal">
              Quero acessar com motivo
            </Button>
          ) : (
            <div className="w-full max-w-md space-y-4">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Por que você precisa acessar este site agora?"
                className="w-full bg-transparent border-2 border-accent rounded-2xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent min-h-32 resize-none"
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowReasonInput(false)}
                  variant="outline"
                  className="flex-1 border-2 border-muted bg-transparent text-muted-foreground hover:bg-muted rounded-2xl">
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitReason}
                  variant="outline"
                  className="flex-1 border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-accent-foreground rounded-2xl">
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Box - Incentives */}
        <div className="border-2 border-primary rounded-3xl h-96 flex items-center justify-center p-8">
          <div className="text-center space-y-6">
            <p className="text-primary text-lg lg:text-xl font-light">
              Imagens ou incentivos para
              <br />
              evitar o acesso
            </p>
            <div className="text-6xl">{randomIncentive.split(" ")[0]}</div>
            <p className="text-primary/80 text-base">
              {randomIncentive.split(" ").slice(1).join(" ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockContentPage
