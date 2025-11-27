import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Zap, Phone, ArrowRight, Menu, DollarSign, Users, TrendingUp } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container px-4 md:px-6 mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Joy Data Bundles" className="h-9 w-9 rounded-lg" />
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:inline-block">
              Joy Data Bundles
            </span>
            <span className="font-bold text-xl tracking-tight text-slate-900 sm:hidden">JoyBundle</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors"
              href="/auth/login"
            >
              Login
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                Become a Reseller
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="font-bold text-lg">
                    Home
                  </Link>
                  <Link href="/auth/login" className="font-medium text-lg">
                    Login
                  </Link>
                  <Link href="/auth/register" className="font-medium text-lg text-cyan-600">
                    Become a Reseller
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/50 to-white -z-10" />
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-cyan-100 text-cyan-800 border-cyan-200">
                <DollarSign className="h-3.5 w-3.5 mr-2" /> Start earning today
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl text-slate-900">
                Sell Data Bundles & <span className="text-cyan-500">Earn Commission</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl leading-relaxed">
                Join our reseller network and start earning. Get your unique link, share with customers, and earn on every sale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 rounded-lg bg-cyan-500 hover:bg-cyan-600"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 rounded-lg border-slate-300 hover:bg-slate-100 text-slate-700 bg-transparent"
                  >
                    I have an account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Start earning in 3 simple steps</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6">
                <div className="w-12 h-12 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900">Sign Up Free</h3>
                <p className="text-slate-600 leading-relaxed">
                  Create your reseller account in minutes. No fees, no commitments.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6">
                <div className="w-12 h-12 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900">Share Your Link</h3>
                <p className="text-slate-600 leading-relaxed">
                  Get your unique referral link and share it with your customers via WhatsApp, social media, or anywhere.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6">
                <div className="w-12 h-12 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900">Earn Commission</h3>
                <p className="text-slate-600 leading-relaxed">
                  Earn on every sale. Set your own prices and withdraw your earnings anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="w-full py-16 md:py-24 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Resellers Love Us</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
                <div className="p-4 bg-cyan-100 rounded-full text-cyan-600">
                  <DollarSign className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Set Your Own Prices</h3>
                <p className="text-slate-600 leading-relaxed">
                  You control your margins. Add your commission on top of our base prices.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
                <div className="p-4 bg-emerald-100 rounded-full text-emerald-600">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Fast Delivery</h3>
                <p className="text-slate-600 leading-relaxed">
                  Your customers receive their data bundles within 2-3 hours. Happy customers, repeat sales.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-slate-100 shadow-sm bg-white">
                <div className="p-4 bg-purple-100 rounded-full text-purple-600">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Track Everything</h3>
                <p className="text-slate-600 leading-relaxed">
                  Monitor your sales, earnings, and customer orders from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-16 md:py-24 bg-cyan-500">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Earning?</h2>
            <p className="text-cyan-100 mb-8 max-w-xl mx-auto">
              Join hundreds of resellers already earning with Joy Data Bundles.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-slate-100 h-12 px-8">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      {/* ... existing footer ... */}
      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="h-6 w-6 opacity-80 rounded" />
          <p className="text-xs text-slate-500">© 2025 Joy Data Bundles. All rights reserved.</p>
        </div>
        {/* ... existing nav ... */}
      </footer>
    </div>
  )
}
