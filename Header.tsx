import { Link } from 'wouter'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-[Fraunces] font-bold text-xl text-primary">FlooringHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/directory" className="text-gray-600 hover:text-primary transition-colors">
            Find Suppliers
          </Link>
          <Link href="/messages" className="text-gray-600 hover:text-primary transition-colors">
            Messages
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
            Contractor Tools
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/directory" className="btn-primary">
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container py-4 space-y-3">
            <Link href="/directory" className="block text-gray-600 hover:text-primary py-2">
              Find Suppliers
            </Link>
            <Link href="/messages" className="block text-gray-600 hover:text-primary py-2">
              Messages
            </Link>
            <Link href="/dashboard" className="block text-gray-600 hover:text-primary py-2">
              Contractor Tools
            </Link>
            <Link href="/pricing" className="block text-gray-600 hover:text-primary py-2">
              Pricing
            </Link>
            <Link href="/directory" className="block btn-primary text-center">
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
