"use client";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SectionKicker } from "@/components/layout/section-kicker";
import { WordReveal } from "@/components/animations/word-reveal";
import { Reveal } from "@/components/animations/reveal";
import type { TeamMemberView } from "@/sanity/lib/adapters";

/**
 * "Команда" section on /about — a grid of people, each a round photo with
 * name + role underneath. Content comes from Sanity (teamMember docs), so
 * the roaster adds/removes/reorders people without touching code. Renders
 * nothing until at least one member is published.
 */
export function AboutTeam({ members }: { members: TeamMemberView[] }) {
  if (members.length === 0) return null;

  return (
    <section className="relative py-[var(--section-gap)] bg-[var(--color-bg-primary)] overflow-hidden">
      <Container size="wide">
        <div className="mb-14 lg:mb-20 max-w-3xl">
          <Reveal>
            <SectionKicker label="Команда" />
          </Reveal>
          <h2 className="font-display font-semibold text-[clamp(2rem,4.5vw,4rem)] leading-[1] tracking-[-0.045em] mt-10">
            <WordReveal duration={1} stagger={0.07}>
              Люди за кавою.
            </WordReveal>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-y-16">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={(i % 4) * 0.08} y={30} duration={0.9}>
              <figure className="flex flex-col items-center text-center">
                <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-full bg-[var(--color-bg-secondary)]">
                  {m.photoUrl ? (
                    <Image
                      src={m.photoUrl}
                      alt={m.name}
                      fill
                      sizes="(min-width: 1024px) 220px, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(ellipse at 50% 40%, #D4A574 0%, #8B5A3C 55%, #3D2417 100%)",
                      }}
                    />
                  )}
                </div>
                <figcaption className="mt-5">
                  <div className="font-display font-semibold text-lg lg:text-xl leading-tight">
                    {m.name}
                  </div>
                  {m.role && (
                    <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {m.role}
                    </div>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
