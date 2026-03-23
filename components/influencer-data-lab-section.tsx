"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

const reels = [
  { src: "/influencer/reel-skincare-1.webp", alt: "일본 인플루언서 스킨케어 콘텐츠", username: "@tokyo_skin_lab", caption: "敏感肌でも使いやすい保湿レビュー。", profile: "/influencer/profile-1.webp" },
  { src: "/influencer/reel-desk-1.webp", alt: "일본 데스크 라이프스타일 콘텐츠", username: "@jp_desk_style", caption: "仕事中でも使いやすい新作紹介。", profile: "/influencer/profile-2.webp" },
  { src: "/influencer/reel-cafe-1.webp", alt: "일본 카페 라이프스타일 콘텐츠", username: "@osaka_cafe_log", caption: "週末カフェで映えるアイテム。", profile: "/influencer/profile-1.webp" },
  { src: "/influencer/reel-unboxing-1.webp", alt: "일본 제품 언박싱 숏폼", username: "@unbox_japan", caption: "開封から使用感まで一気にチェック。", profile: "/influencer/profile-2.webp" },
  { src: "/influencer/reel-fitness-1.webp", alt: "일본 피트니스 콘텐츠", username: "@fit_tokyo_daily", caption: "運動後ルーティン向け 제품 소개。", profile: "/influencer/profile-1.webp" },
  { src: "/influencer/reel-product-1.webp", alt: "일본 제품 소개 콘텐츠", username: "@product_focus_jp", caption: "比較ポイントを30秒で理解。", profile: "/influencer/profile-2.webp" },
]

function ReelCaseCard({ item }: { item: (typeof reels)[number] }) {
  return (
    <div className="group relative aspect-[9/16] overflow-hidden rounded-2xl border shadow-lg transition duration-300 hover:scale-[1.03] hover:shadow-2xl">
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
          <p className="line-clamp-2 text-[11px] text-white/90">{item.caption}</p>
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
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#00B140]">Real Campaign Cases</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">실제 운영 중인 인플루언서 콘텐츠 사례</h2>
          <p className="mt-4 text-muted-foreground">노출만이 아니라 전환까지 고려한 숏폼 운영 구조를 직접 확인하세요.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reels.map((item) => (
            <ReelCaseCard key={item.src} item={item} />
          ))}
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
