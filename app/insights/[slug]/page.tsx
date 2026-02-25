import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { notFound } from "next/navigation"
import { marked } from "marked"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), "content", "blog")

  try {
    const files = await fs.readdir(blogDir)

    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({
        slug: file.replace(".md", ""),
      }))
  } catch {
    return []
  }
}

export default async function Page({ params }: PageProps) {
  const filePath = path.join(
    process.cwd(),
    "content",
    "blog",
    `${params.slug}.md`
  )

  try {
    const fileContent = await fs.readFile(filePath, "utf-8")
    const { data, content } = matter(fileContent)

    const html = marked.parse(content)

    return (
      <main className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-4xl font-bold mb-6">
          {data.title}
        </h1>

        {data.description && (
          <p className="text-lg text-muted-foreground mb-10">
            {data.description}
          </p>
        )}

        {data.image && (
          <img
            src={data.image}
            alt={data.title}
            className="mb-12 rounded-xl"
          />
        )}

        <article
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    )
  } catch {
    notFound()
  }
}