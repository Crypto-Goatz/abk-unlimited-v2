import Image from "next/image"
import Link from "next/link"
import { Users, Zap, MapPin, Wrench, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const values = [
  {
    icon: Wrench,
    title: "Master Craftsmanship",
    description:
      "Every nail, every seam, every finish receives our full attention. Our skilled craftsmen bring decades of combined experience to your project, ensuring results that look stunning and stand the test of time.",
  },
  {
    icon: Users,
    title: "Transparent Communication",
    description:
      "No surprises, no hidden costs, no unreturned calls. From your first consultation through final walkthrough, you'll have direct access to your project manager and real-time updates on progress.",
  },
  {
    icon: MapPin,
    title: "Local Pittsburgh Expertise",
    description:
      "We understand Pittsburgh homes\u2014from century-old craftsman bungalows in Mt. Lebanon to modern builds in Moon Township. Our team knows local codes, permits, and Western PA's unique challenges.",
  },
  {
    icon: Zap,
    title: "Comprehensive Services",
    description:
      "One contractor for your entire project means seamless coordination, consistent quality, and a single point of accountability. Whether structural, electrical, plumbing, or finishing\u2014we handle it all.",
  },
]

export function WhyUs() {
  return (
    <section id="why-us" className="py-16 sm:py-24 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-sm font-semibold tracking-wider text-primary uppercase mb-4">Why Choose Us</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
              Why Pittsburgh Families Trust ABK Unlimited
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              For years, homeowners across Greater Pittsburgh have trusted ABK Unlimited to transform their houses into
              dream homes. Our commitment to exceptional craftsmanship, transparent communication, and genuine care for
              every project has earned us a 5-star reputation and the Best of Houzz 2025 award.
            </p>

            <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6">
              {values.slice(0, 2).map((value) => (
                <div key={value.title} className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <value.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about">
              <Button className="mt-8 sm:mt-10 bg-primary text-primary-foreground hover:bg-primary/90">
                Learn About Our Process
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/shadyside-pittsburgh-renovated-home.jpg"
                alt="Beautiful renovated Shadyside-style home in Pittsburgh"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating card - hidden on mobile for cleaner layout */}
            <div className="hidden sm:block absolute -bottom-6 -left-6 bg-card p-4 sm:p-6 rounded-xl shadow-xl border border-border max-w-xs">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg sm:text-xl">
                  A+
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">BBB Rated</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Serving Pittsburgh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 grid sm:grid-cols-2 gap-6 sm:gap-8">
          {values.slice(2).map((value) => (
            <div key={value.title} className="bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <value.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">{value.title}</h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
