import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 gap-4">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ganesh Glass Center. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
