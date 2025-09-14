"use client";

import { Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-indigo-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              কুইজ প্রতিযোগিতা
            </h3>
            <p className="text-gray-600 text-sm">
              শিক্ষার্থীদের জন্য একটি ইন্টারেক্টিভ কুইজ প্ল্যাটফর্ম। জ্ঞান পরীক্ষা করুন এবং পুরস্কার জিতুন।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2">
              <li><a href="/rules" className="text-gray-600 hover:text-indigo-600 text-sm">নিয়মবলি</a></li>
              <li><a href="/result" className="text-gray-600 hover:text-indigo-600 text-sm">ফলাফল</a></li>
              <li><a href="/ask-question" className="text-gray-600 hover:text-indigo-600 text-sm">জিঙ্গাসা</a></li>
              <li><a href="/faq" className="text-gray-600 hover:text-indigo-600 text-sm">সচরাচর প্রশ্ন</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">যোগাযোগ</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span className="text-gray-600 text-sm">support@quizcontest.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span className="text-gray-600 text-sm">+৮৮০ ১৭XX-XXXXXX</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 mt-1" />
                <span className="text-gray-600 text-sm">ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">আপডেট থাকুন</h4>
            <p className="text-gray-600 text-sm mb-3">নতুন কুইজ এবং আপডেট সম্পর্কে জানতে সাবস্ক্রাইব করুন</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="আপনার ইমেইল" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
                পাঠান
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm flex items-center gap-1">
            © {new Date().getFullYear()} কুইজ প্রতিযোগিতা. তৈরি with <Heart className="w-4 h-4 text-red-500" /> বাংলাদেশে
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">গোপনীয়তা নীতি</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">সেবার শর্তাবলী</a>
          </div>
        </div>
      </div>
    </footer>
  );
}