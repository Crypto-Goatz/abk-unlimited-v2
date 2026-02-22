import Link from "next/link"
import Image from "next/image"
import { Facebook, Phone, Mail, MapPin } from "lucide-react"

const footerLinks = {
  Services: [
    { name: "Kitchen Remodeling", href: "/services/kitchen-remodeling" },
    { name: "Bathroom Remodeling", href: "/services/bathroom-remodeling" },
    { name: "Basement Finishing", href: "/services/basement-finishing" },
    { name: "Deck Building", href: "/services/deck-building" },
    { name: "Home Additions", href: "/services/home-additions" },
    { name: "Flooring Installation", href: "/services/flooring-installation" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Our Process", href: "/about/our-process" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Testimonials", href: "/reviews" },
    { name: "Service Areas", href: "/service-areas" },
  ],
  Resources: [
    { name: "Free Estimate", href: "/free-estimate" },
    { name: "Contact", href: "/contact" },
    { name: "Financing", href: "/financing" },
    { name: "Blog", href: "/resources/blog" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-secondary pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/abk-logo.png"
                alt="ABK Unlimited"
                width={200}
                height={54}
                className="h-12 w-auto"
              />
            </div>

            <p className="text-secondary-foreground/70 max-w-xs mb-8 leading-relaxed">
              Award-winning Pittsburgh general contractor specializing in kitchen & bathroom remodeling, basement
              finishing, and deck building. Licensed, insured, and committed to excellence.
            </p>

            <div className="space-y-4">
              <a
                href="tel:+14129441683"
                className="flex items-center gap-3 text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">(412) 944-1683</span>
              </a>
              <a
                href="mailto:abk.unlimited@gmail.com"
                className="flex items-center gap-3 text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>abk.unlimited@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-secondary-foreground/80">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>Pittsburgh, PA 15205</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=100065571905770"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center text-secondary-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.houzz.com/professionals/general-contractors/abk-unlimited-pfvwus-pf~222150373"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center text-secondary-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <span className="font-bold text-sm">Hz</span>
                <span className="sr-only">Houzz</span>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-secondary-foreground/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-secondary-foreground/60">
              &copy; {new Date().getFullYear()} ABK Unlimited. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-foreground/60">
              <span>PA HIC #PA163301</span>
              <span className="hidden md:inline">&bull;</span>
              <span>GC-2021-002697</span>
              <span className="hidden md:inline">&bull;</span>
              <span>Fully Insured & Licensed</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
