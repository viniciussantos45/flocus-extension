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
    <div className="min-h-screen w-full bg-black text-amber-500 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left Box - Empty decorative */}
        <div className="hidden lg:block border-2 border-pink-500 rounded-3xl h-96"></div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-xl lg:text-2xl text-center font-light leading-relaxed px-4">
            {randomMessage}
          </p>

          {!showReasonInput ? (
            <Button
              onClick={handleAccessWithReason}
              variant="outline"
              className="border-2 border-amber-500 bg-transparent text-amber-500 hover:bg-amber-500 hover:text-black px-8 py-6 rounded-2xl text-lg font-normal">
              Quero acessar com motivo
            </Button>
          ) : (
            <div className="w-full max-w-md space-y-4">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Por que você precisa acessar este site agora?"
                className="w-full bg-transparent border-2 border-amber-500 rounded-2xl p-4 text-amber-500 placeholder:text-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-32 resize-none"
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowReasonInput(false)}
                  variant="outline"
                  className="flex-1 border-2 border-amber-500/50 bg-transparent text-amber-500/50 hover:bg-amber-500/10 rounded-2xl">
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitReason}
                  variant="outline"
                  className="flex-1 border-2 border-amber-500 bg-transparent text-amber-500 hover:bg-amber-500 hover:text-black rounded-2xl">
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Box - Incentives */}
        <div className="border-2 border-pink-500 rounded-3xl h-96 flex items-center justify-center p-8">
          <div className="text-center space-y-6">
            <p className="text-pink-500 text-lg lg:text-xl font-light">
              Imagens ou incentivos para
              <br />
              evitar o acesso
            </p>
            <div className="text-6xl">{randomIncentive.split(" ")[0]}</div>
            <p className="text-pink-500/80 text-base">
              {randomIncentive.split(" ").slice(1).join(" ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockContentPage
