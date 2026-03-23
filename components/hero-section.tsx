"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, Send } from "lucide-react"

import { Button } from "@/components/ui/button"

type HeroReel = {
  src: string
  alt: string
  username: string
  caption: string
  profile: string
}

const heroReels: HeroReel[] = [
  {
    src: "/influencer/reel-skincare-1.webp",
    alt: "일본 인플루언서 스킨케어 콘텐츠",
    username: "@tokyo_skin_lab",
    caption: "使用感まで短くわかりやすく紹介。",
    profile: "/influencer/profile-1.webp",
  },
  {
    src: "/influencer/reel-cafe-1.webp",
    alt: "일본 라이프스타일 카페 콘텐츠",
    username: "@osaka_life_note",
    caption: "週末カフェで話題のアイテムレビュー。",
    profile: "/influencer/profile-2.webp",
  },
  {
    src: "/influencer/reel-product-1.webp",
    alt: "일본 제품 언박싱 콘텐츠",
    username: "@jp_product_pick",
    caption: "開封から比較ポイントまで30秒で確認。",
    profile: "/influencer/profile-1.webp",
  },
]

function HeroReelCard({ reel, className }: { reel: HeroReel; className?: string }) {
  return (
    <div
      className={`group relative aspect-[9/16] w-full overflow-hidden rounded-2xl border shadow-lg transition duration-300 hover:scale-[1.03] hover:shadow-2xl ${className || ""}`}
    >
      <Image src={reel.src} alt={reel.alt} fill className="object-cover" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 text-white">
        <div className="min-w-0 pr-2">
          <div className="mb-1 flex items-center gap-2">
            <div className="relative size-6 overflow-hidden rounded-full border border-white/80">
              <Image src={reel.profile} alt="인플루언서 프로필" fill className="object-cover" />
            </div>
            <span className="truncate text-xs font-semibold">{reel.username}</span>
          </div>
          <p className="line-clamp-2 text-[11px] text-white/90">{reel.caption}</p>
        </div>

        <div className="flex flex-col items-center gap-2 text-white/95">
          <Heart className="size-4" />
          <MessageCircle className="size-4" />
          <Send className="size-4" />
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#00B140]">Japan Growth Partner</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            일본 진출,
            <br />
            실행 구조를 먼저 설계합니다.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground md:text-lg">
            체험단, 인플루언서, SNS 운영, 법인·물류까지.
            캠페인이 아니라 실제 운영 가능한 구조를 함께 만듭니다.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild className="rounded-xl bg-[#00B140] px-8 text-white shadow-lg transition hover:bg-[#009C38]">
              <Link href="/contact">일본 진출 상담 신청</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-8">
              <Link href="/influencers">운영 사례 보기</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <HeroReelCard reel={heroReels[0]} className="translate-y-2" />
          <HeroReelCard reel={heroReels[1]} className="-translate-y-3" />
          <HeroReelCard reel={heroReels[2]} className="translate-y-1" />
        </div>
      </div>
    </section>
  )
}
