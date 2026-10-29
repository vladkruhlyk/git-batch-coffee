import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomeAbout } from "@/components/home/about";
import { AboutTeam } from "@/components/about/team";
import { fetchTeamMembers } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Про нас — BATCH Coffee",
  description: "BATCH — маленька ростерія у Полтаві з великою уважністю до кави.",
};

// Content (the team list) comes from Sanity; the webhook revalidates the
// "teamMember" tag on edits, so a long interval here is just a safety net.
export const revalidate = 3600;

export default async function AboutPage() {
  const team = await fetchTeamMembers();
  return (
    <>
      <Header overlay />
      <main className="flex-1">
        <HomeAbout />
        <AboutTeam members={team} />
      </main>
      <Footer />
    </>
  );
}
