"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"

export function NewsletterSection() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-purple-600 text-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-white/10 border-white/20">
          <CardContent className="p-6 sm:p-8 text-center">
            <Mail className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4 text-white" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{t("home.newsletter.title")}</h2>
            <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base max-w-lg mx-auto">
              {t("home.newsletter.subtitle")}
            </p>

            {isSubscribed ? (
              <div className="text-green-300 font-semibold text-sm sm:text-base">{t("home.newsletter.thanks")}</div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder={t("home.newsletter.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm sm:text-base"
                />
                <Button type="submit" className="bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto">
                  {t("home.newsletter.subscribe")}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
