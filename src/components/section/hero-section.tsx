import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      className="relative min-h-[600px] flex items-center justify-center text-white"
      style={{
        backgroundImage: `url('/assets/images/hero.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 ">Discover Quality Products for Every Space</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          {'High-quality products for every need - Indoor & Outdoor"High-quality products for every'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
         <Link href={"/sign-up"}> <Button className="bg-primary rounded-full hover:bg-primary/90 text-white px-8 py-5 text-lg">Register Now</Button></Link>
         <Link href={"/contact-us"}>
          <Button
            variant="outline"
            className="border-white rounded-full text-white hover:bg-white hover:text-black px-8 py-5 text-lg bg-transparent"
          >
            Contact Us
          </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
