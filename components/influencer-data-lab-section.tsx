"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

const reels = [
  {
    src: "/influencer/reel-skincare-1.webp",
    alt: "일본 인플루언서 스킨케어 콘텐츠",
    username: "@tokyo_skin_lab",
    caption: "朝の保湿にちょうどいい軽さ…🤍 #スキンケア #保湿ケア",
    profile: "/influencer/profile-1.webp",
  },
  {
    src: "/influencer/reel-desk-1.webp",
    alt: "일본 데스크 라이프스타일 콘텐츠",
    username: "@jp_desk_style",
    caption: "仕事中の気分転換にぴったり…☕ #デスク周り #在宅ワーク",
    profile: "/influencer/profile-2.webp",
  },
  {
    src: "/influencer/reel-cafe-1.webp",
    alt: "일본 카페 라이프스타일 콘텐츠",
    username: "@osaka_cafe_log",
    caption: "週末カフェに連れて行きたい可愛さ…📸 #カフェ巡り #バッグの中身",
    profile: "/influencer/profile-1.webp",
  },
  {
    src: "/influencer/reel-unboxing-1.webp",
    alt: "일본 제품 언박싱 숏폼",
    username: "@unbox_japan",
    caption: "開封した瞬間からテンション上がる…✨ #購入品紹介 #開封動画",
    profile: "/influencer/profile-2.webp",
  },
  {
    src: "/influencer/reel-fitness-1.webp",
    alt: "일본 피트니스 콘텐츠",
    username: "@fit_tokyo_daily",
    caption: "運動後のリセット時間にちょうどいい…🧘 #ボディケア #習慣化",
    profile: "/influencer/profile-1.webp",
  },
  {
    src: "/influencer/reel-product-1.webp",
    alt: "일본 제품 소개 콘텐츠",
    username: "@product_focus_jp",
    caption: "迷った時に見たい比較ポイントまとめ…📝 #レビュー #買う前に見て",
    profile: "/influencer/profile-2.webp",
  },
]

const sliderReels = [...reels, ...reels]

function ReelCaseCard({ item }: { item: (typeof reels)[number] }) {
  return (
    <div className="group relative aspect-[9/16] w-[220px] flex-none overflow-hidden rounded-2xl border shadow-lg transition duration-300 hover:scale-[1.03] hover:shadow-2xl sm:w-[240px] lg:w-[260px]">
      <Image src={item.src} alt={item.alt} fill className="object-cover" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 text-white">
        <div className="min-w-0 pr-2">
          <div className="mb-1 flex items-center gap-2">
            <div className="relative size-6 overflow-hidden rounded-full border border-white/80">
              <Image src={item.profile} alt="인플루언서 프로필" fill className="object-cover" />
            </div>
            <span className="truncate text-xs font-semibold">{item.username}</span>
          </div>
          <p className="line-clamp-2 text-[11px] leading-snug text-white/90">{item.caption}</p>
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

export function InfluencerDataLabSection() {
  return (
    <section className="bg-[#f8f9fa] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] py-16 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="influencer-reel-track flex w-max gap-4 py-2">
            {sliderReels.map((item, index) => (
              <ReelCaseCard key={`${item.src}-${index}`} item={item} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.42)_34%,rgba(255,255,255,0)_68%)]" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-widest text-[#00B140] [text-shadow:0_2px_12px_rgba(255,255,255,0.9)]">Influencer Trust Framework</p>
              <h2 className="mx-auto mt-3 max-w-3xl text-balance text-3xl font-black tracking-tight text-foreground [text-shadow:0_2px_18px_rgba(255,255,255,0.95)] md:text-5xl">
                인플루언서를 활용한 최고의 마케팅은 판매가 아닌 신뢰를 쌓는 것입니다
              </h2>
              <p className="mt-4 font-medium text-muted-foreground [text-shadow:0_2px_12px_rgba(255,255,255,0.95)]">
                일본 소비자가 자연스럽게 믿고 확인하는 콘텐츠
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-xl bg-[#00B140] px-10 text-white shadow-lg transition hover:bg-[#009C38]">
            <Link href="/contact">일본 진출 상담 신청</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
