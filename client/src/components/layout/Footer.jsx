import React from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Foodie<span className="text-orange-400">Hub</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Delicious food, delivered with love. Order from your favorite restaurants and enjoy fresh meals at your doorstep.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-xl flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/menu', 'Menu'], ['/orders', 'My Orders'], ['/profile', 'Profile']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Delivery Info', 'Privacy Policy', 'Terms & Conditions', 'Refund Policy'].map(label => (
                <li key={label}>
                  <a href="#" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-orange-400 flex-shrink-0" />
                <span>123 Food Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>hello@foodiehub.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2024 FoodieHub. All rights reserved.</p>
          <p className="text-xs text-gray-500">Built in India</p>
        </div>
      </div>
    </footer>
  )
}
