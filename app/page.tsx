import { SearchForm } from '@/components/search-form';
import { SearchResults } from '@/components/search-results';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { TracingBeam } from '@/components/ui/tracing-beam';
import { SparklesCore } from '@/components/ui/sparkles';
import { StatsCounter } from '@/components/stats-counter';

const words = [
  {
    text: "Find",
  },
  {
    text: "your",
  },
  {
    text: "perfect",
  },
  {
    text: "app",
    className: "text-blue-500 dark:text-blue-500",
  },
  {
    text: "today.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background/95 antialiased relative overflow-hidden">
      <BackgroundBeams />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10">
        <div className="space-y-12">
          <div className="text-center space-y-6 relative">
            <div className="h-[40vh] w-full bg-transparent flex flex-col items-center justify-center overflow-hidden rounded-md">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#2563eb"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <TypewriterEffect words={words} className="text-4xl sm:text-5xl font-bold" />
              </div>
            </div>

            <div className="mx-auto max-w-2xl">
              <TracingBeam className="px-6">
                <p className="text-muted-foreground text-lg mb-8">
                  Describe your ideal app&apos;s features and requirements. Our AI will analyze thousands 
                  of apps from Product Hunt and Hacker News to find your perfect match.
                </p>
                <SearchForm />
              </TracingBeam>
            </div>
          </div>
          
          <StatsCounter />
          <SearchResults />
        </div>
      </div>
    </main>
  );
}