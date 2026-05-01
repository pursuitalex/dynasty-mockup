import { Hero } from "@/components/sections/Hero";
import { Description } from "@/components/sections/Description";
import { Goals } from "@/components/sections/Goals";
import { TabletsCarousel } from "@/components/sections/TabletsCarousel";
import { Approach } from "@/components/sections/Approach";
import { HomepageBreakdown } from "@/components/sections/HomepageBreakdown";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-bg text-white">
      <Hero />
      <Description />
      <Goals />
      <TabletsCarousel />
      <Approach />
      <HomepageBreakdown />
      {/* Sections 7–13 will follow */}
    </main>
  );
}
