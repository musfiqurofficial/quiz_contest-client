// src/app/(all-dashboard)/student/dashboard/page.tsx
"use client";

import { motion } from "framer-motion";
import { BookOpen, Trophy, Clock, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDashboard() {
  const stats = [
    { label: "মোট কুইজ", value: "12", icon: BookOpen, color: "text-blue-600" },
    { label: "সম্পন্ন কুইজ", value: "8", icon: Trophy, color: "text-green-600" },
    { label: "গড় স্কোর", value: "85%", icon: Award, color: "text-amber-600" },
    { label: "মোট সময়", value: "4h 30m", icon: Clock, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">স্বাগতম!</h1>
        <p className="text-blue-100">আজকের কুইজ এটেম্পট করুন এবং আপনার জ্ঞান পরীক্ষা করুন</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>সাম্প্রতিক কার্যক্রম</CardTitle>
            <CardDescription>আপনার সাম্প্রতিক কুইজ এবং স্কোর</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium">গণিত কুইজ #{item}</p>
                    <p className="text-sm text-gray-500">সম্পন্ন: ২ দিন আগে</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">৮৫%</p>
                    <p className="text-sm text-gray-500">স্কোর</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}