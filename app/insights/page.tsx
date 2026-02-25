import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Link from "next/link"

interface Post {
  slug: string
  title: string
  description: string
}

export default function InsightsPage() {
  const postsDirectory = path.join(process.cwd(), "content", "blog")

  let posts: Post[] = []

  try {
    const fileNames = fs.readdirSync(postsDirectory)

    posts = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(".md", "")
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const { data } = matter(fileContents)

        return {
          slug,
          title: data.title || slug,
          description: data.description || "",
        }
      })
  } catch {
    posts = []
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold mb-12">인사이트 자료</h1>

      {posts.length === 0 && (
        <p className="text-muted-foreground">
          아직 등록된 인사이트가 없습니다.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/insights/${post.slug}`}
            className="border p-6 rounded-xl hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-4">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-sm">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}