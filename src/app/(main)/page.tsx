import type { Metadata } from "next";
import Banner from "../components/banner";
import Gift from "../components/gift";
import QuizSection from "../components/quizSection";
import QuizTimelineAndInstructions from "../components/QuizTimelineAndInstructions";
import FaqSection from "../components/FaqItem";
import JudgeSection from "../components/JudgeSection";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home | কুইজ প্রতিযোগীতা",
    description:
      "Browse a wide variety of Cosmetics products including phones, accessories, and more at কুইজ প্রতিযোগীতা.",
  };
}
export default async function Home() {
  return (
    <>
      <Banner />
      <Gift />
      <QuizSection />
      <JudgeSection />
      <QuizTimelineAndInstructions />
      <FaqSection />
    </>
  );
}
