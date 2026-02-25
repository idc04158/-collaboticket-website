import { Separator } from "@/components/ui/separator"

const footerLinks = [
  {
    label: "개인정보처리방침",
    href: "https://docs.google.com/document/d/1m-BzQlt-8e2Uo3htd9P7KiDeuX1w61o2-y2jVOfND2I/view",
  },
  {
    label: "이용약관",
    href: "https://docs.google.com/document/d/1m-BzQlt-8e2Uo3htd9P7KiDeuX1w61o2-y2jVOfND2I/view",
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <Separator />
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          <div className="flex flex-col gap-4 lg:col-span-2">
            <span className="font-sans text-lg font-bold text-foreground">
              CollaboTicket
            </span>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              콜라보티켓
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              연락처
            </h4>
            <p className="text-sm text-muted-foreground">
              contact@collaboticket.com
            </p>
            <p className="text-sm text-muted-foreground">
              사업자등록번호 436-36-00682
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              법적 고지
            </h4>

            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2024 CollaboTicket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}