import { Link } from 'wouter'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="font-[Fraunces] font-bold text-lg text-white">FlooringHub</span>
            </div>
            <p className="text-sm">Connecting flooring contractors with quality suppliers.</p>
          </div>

          {/* For Contractors */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Contractors</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/directory" className="hover:text-primary transition-colors">Find Suppliers</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Get Quotes</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* For Stores */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Stores</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">List Your Store</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Premium Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@flooringhub.com" className="hover:text-primary transition-colors">info@flooringhub.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:1-800-FLOORING" className="hover:text-primary transition-colors">1-800-FLOORING</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2026 FlooringHub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
