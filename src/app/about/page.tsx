import Link from "next/link";

export const metadata = {
  title: "About",
  description: "RicoCheese에 대하여",
};

const INTERESTS = ["Game Development", "Web Dev", "System Design", "UI/UX", "DevOps"];
const STACK = ["TypeScript", "React", "Next.js", "C++", "Python", "Unreal Engine"];

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-32">
      {/* Header */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block w-8 h-px bg-accent" />
          <span className="font-mono text-xs tracking-[0.25em] text-text-3 uppercase">
            Who am I
          </span>
        </div>
        <h1 className="font-serif font-black text-[clamp(3rem,8vw,6rem)] leading-none tracking-tight text-text">
          About
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main bio */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4 text-text-2 leading-relaxed text-lg">
            <p>
              안녕하세요, <span className="text-accent font-semibold">RicoCheese</span>입니다.
            </p>
            <p>
              게임과 웹을 오가며 개발하는 것을 좋아합니다.
              이 블로그에는 개발하면서 배우고 느낀 것들, 기술 뉴스, 프로젝트 회고 등을 기록합니다.
            </p>
            <p>
              완성된 무언가보다 만들어가는 과정에 더 관심이 많습니다.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <span className="flex-1 h-px bg-border" />
            <span className="text-accent text-xs font-mono">▸</span>
          </div>

          {/* Interests */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] text-text-3 uppercase mb-4">Interests</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((item) => (
                <span
                  key={item}
                  className="text-sm text-text-2 bg-surface border border-border rounded-sm px-3 py-1.5 font-mono"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] text-text-3 uppercase mb-4">Stack</p>
            <div className="flex flex-wrap gap-2">
              {STACK.map((item) => (
                <span
                  key={item}
                  className="text-sm font-mono font-medium px-3 py-1.5 rounded-sm border"
                  style={{
                    color: "#C8FF00",
                    borderColor: "rgba(200,255,0,0.2)",
                    backgroundColor: "rgba(200,255,0,0.05)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Card */}
          <div className="bg-surface border border-border rounded-lg p-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-surface-2 border border-border-2 flex items-center justify-center">
              <span className="font-serif font-black text-2xl text-accent">R</span>
            </div>
            <div>
              <p className="font-serif font-bold text-xl text-text">RicoCheese</p>
              <p className="text-sm text-text-3 font-mono mt-0.5">Developer & Creator</p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/smc5720"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-text-2 hover:text-accent transition-colors"
              >
                <span className="font-mono text-text-3">GH</span>
                github.com/smc5720
              </a>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/blog"
            className="group flex items-center justify-between bg-accent/5 border border-accent/20 rounded-sm px-5 py-4 hover:bg-accent/10 transition-colors"
          >
            <span className="text-sm font-bold text-accent">블로그 글 읽기</span>
            <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
