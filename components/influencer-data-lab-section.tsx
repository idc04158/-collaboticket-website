"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, Send, Users, Eye, TrendingUp } from "lucide-react"

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

const dataMetrics = [
  { icon: Users, label: "인플루언서 DB", value: "2,400+" },
  { icon: Eye, label: "평균 참여율", value: "4.2%" },
  { icon: TrendingUp, label: "캠페인 ROI", value: "3.1x" },
]

const sliderReels = [...reels, ...reels]

function ReelCaseCard({ item }: { item: (typeof reels)[number] }) {
  return (
    <div className="group relative aspect-[9/16] w-[200px] flex-none overflow-hidden rounded-2xl border border-white/10 shadow-xl transition duration-300 hover:scale-[1.03] sm:w-[220px] lg:w-[240px]">
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
    <section className="relative overflow-hidden bg-[var(--surface-dark)] py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-0 dot-bg opacity-[0.04]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-label">인플루언서 데이터랩</p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-4xl">
              데이터로 선별하는
              <br />
              일본 인플루언서
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-white/65">
              팔로워 수가 아닌 참여율·콘텐츠 적합도·전환 데이터로 후보를 좁힙니다.
              실제 캠페인 성과가 축적된 DB를 기반으로 매칭합니다.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {dataMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <metric.icon className="size-4 text-brand" />
                  <p className="mt-2 font-mono text-xl font-bold">{metric.value}</p>
                  <p className="mt-0.5 text-[11px] text-white/50">{metric.label}</p>
                </div>
              ))}
            </div>

            <Link href="/influencers" className="btn-brand mt-8 inline-flex gap-2">
              매칭 데모 보기
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl py-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="influencer-reel-track flex w-max gap-4">
              {sliderReels.map((item, index) => (
                <ReelCaseCard key={`${item.src}-${index}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
