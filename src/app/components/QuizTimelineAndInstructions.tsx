// components/QuizTimelineAndInstructions.tsx

interface SectionProps {
  title: string;
  points: string[];
}

function InfoBlock({ title, points }: SectionProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 md:p-8 w-full">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        {title}
      </h3>
      <ul className="list-disc list-inside text-gray-700 space-y-3 text-base leading-relaxed">
        {points.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default function QuizTimelineAndInstructions() {
  const timeline = {
    title: "সময়",
    points: [
      "নিবন্ধন চলবে: ২৫ অক্টোবর থেকে ১৪ নভেম্বর ২০২৪ পর্যন্ত",
      "মহড়া কুইজ: ২ ও ৩ নভেম্বর ২০২৪, সন্ধ্যা ৭টা থেকে ৭টা ১০ মিনিট",
      "মূল পর্বের কুইজ: ৫ থেকে ১৪ নভেম্বর ২০২৪, প্রতিদিন সন্ধ্যা ৭টা থেকে ৭টা ১০ মিনিট",
    ],
  };

  const instructions = {
    title: "অংশগ্রহণের পদ্ধতি",
    points: [
      "নিবন্ধন লিংকে ক্লিক করলে নিবন্ধন ফরম আসবে। সেখানে জাতীয় পরিচয়পত্র/ জন্মসনদ অনুসারে নিজের দরকারি সব তথ্য দিয়ে ও নিজের পছন্দমতো পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) দিয়ে সাবমিট করতে হবে। এ সময় কুইজের নিয়মাবলি মেনে চলার অঙ্গীকার ব্যক্ত করতে হবে।",
      "সাবমিট করার পর একটি লিংক আপনার ই-মেইলে যাবে। সেই লিংকে ক্লিক করে নিবন্ধন সম্পন্ন করতে হবে।",
      "নিবন্ধনের সময় অংশগ্রহণকারীর নাম অবশ্যই বাংলায় দিতে হবে।",
      "মূল কুইজ পর্ব শুরুর আগে সবার প্রস্তুতি নেওয়ার জন্য দুই দিন মহড়া কুইজ অনুষ্ঠিত হবে।",
      "মূল কুইজ পর্বে একইভাবে হোমপেজের ‘কুইজ শুরু করুন’ বাটনে ক্লিক করে কুইজে অংশ নিতে হবে।",
      "নিবন্ধনের তথ্য প্রথম আলো সংরক্ষণ করবে।",
    ],
  };

  return (
    <section className="bg-[#f9f9f9] py-12 ">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-orange-400 text-white">
          <InfoBlock title={timeline.title} points={timeline.points} />
        </div>
        <InfoBlock title={instructions.title} points={instructions.points} />
      </div>
    </section>
  );
}
