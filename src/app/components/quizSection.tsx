import Image from "next/image";

const quizInfo = {
  title: "প্রথম আলো পাঠক কুইজ",
  description: `প্রথম আলোর ২৬তম প্রতিষ্ঠাবার্ষিকী উপলক্ষে পাঠকদের জন্য অনলাইন কুইজের এই আয়োজন। 
  কুইজের প্রশ্ন থাকবে কুইজের দিন ও পূর্ববর্তী দিনের প্রথম আলোর ছাপা পত্রিকা ও অনলাইন থেকে।
  প্রতিদিন কুইজে অংশগ্রহণকারীদের মধ্য থেকে বিজয়ীদের নির্বাচন করা হবে এবং বিজয়ীদের জন্য থাকছে আকর্ষণীয় উপহার।`,
};

const competitionDetails = {
  title: "কুইজ প্রতিযোগিতা",
  description: `কুইজ প্রতিযোগিতা চলবে ১০ দিন এবং প্রথম আলো অনলাইন (www.prothomalo.com/quiz) এ অনুষ্ঠিত হবে। 
  প্রতিদিন সময়মতো কুইজ সঠিকভাবে সমাধানকারীদের মধ্য থেকে দৈবচয়ন পদ্ধতিতে বিজয়ী ঘোষণা করা হবে।`,
  icon: "/Asset/prducts/quiz-banner.png", // Replace with actual path
};

export default function QuizSection() {
  return (
    <section className="py-12 bg-white">
      {/* Quiz Intro */}
      <div className="max-w-4xl mx-auto text-center px-4 space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          {quizInfo.title}
        </h2>
        <p className="text-gray-600 text-md leading-relaxed whitespace-pre-line">
          {quizInfo.description}
        </p>
      </div>

      {/* Two Column Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch">
        {/* Left side with background image */}
        <div
          className="w-full md:w-1/2 bg-no-repeat bg-cover bg-center min-h-[300px]"
          style={{
            backgroundImage: "url('/Asset/prducts/quiz-banner.png')", // ← your image path
          }}
        >
          {/* Optional overlay or space if needed */}
        </div>

        {/* Right side with text */}
        <div className="w-full md:w-1/2 bg-[#f9f9f9] p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            কুইজ প্রতিযোগিতা
          </h2>
          <p className="text-gray-700 text-lg whitespace-pre-line leading-relaxed">
            {competitionDetails.description}
          </p>
        </div>
      </div>
    </section>
  );
}
