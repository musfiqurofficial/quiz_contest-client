"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "@/redux/features/eventSlice";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";
import { motion } from "framer-motion";

export default function EventSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading, error } = useSelector(
    (state: RootState) => state.events
  );

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  // Filter events to show only active/started events
  const activeEvents = useMemo(() => {
    const now = new Date();
    return events.filter((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      // Show events that have started but not ended yet
      return isAfter(now, startDate) && isBefore(now, endDate);
    });
  }, [events]);

  if (loading) {
    return (
      <motion.section
        className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl shadow-lg p-0 animate-pulse"
              >
                <div className="h-56 bg-gray-200 rounded-t-3xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  if (error) {
    return (
      <motion.section
        className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-12">
            <p className="text-lg text-red-500">
              Error loading events: {error}
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">
              Active Events
            </h2>
          </div>

          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Join ongoing quiz contests and compete with participants from around
            the world
          </motion.p>
        </motion.div>

        {activeEvents.length === 0 ? (
          <motion.div
            className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Active Events
            </h3>
            <p className="text-lg text-gray-600 mb-4">
              There are no events currently running.
            </p>
            <p className="text-gray-500">Check back later for new events!</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {activeEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Link href={`/${event._id}`} className="group block">
                  <Card className="h-full overflow-hidden transition-all duration-500 group-hover:shadow-2xl border-0 bg-white/90 backdrop-blur-sm p-0 rounded-3xl">
                    {/* Header with gradient background */}
                    <div className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>

                      {/* Status Badge */}
                      <motion.div
                        className="absolute top-4 right-4"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 shadow-lg rounded-full">
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full mr-2"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          Live Now
                        </Badge>
                      </motion.div>

                      {/* Event Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="text-2xl font-bold text-white line-clamp-2 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-white/90 text-sm line-clamp-2">
                          {event.description ||
                            "Join this exciting quiz contest!"}
                        </p>
                      </div>

                      {/* Decorative elements */}
                      <motion.div
                        className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Trophy className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Date and Time */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {format(
                                new Date(event.startDate),
                                "MMM dd, yyyy"
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(event.startDate), "h:mm a")} -{" "}
                              {format(new Date(event.endDate), "h:mm a")}
                            </p>
                          </div>
                        </div>

                        {/* Participants */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {event.participants.length} Participants
                            </p>
                            <p className="text-sm text-gray-600">
                              Currently active
                            </p>
                          </div>
                        </div>

                        {/* Quizzes */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {event.quizzes.length} Quiz
                              {event.quizzes.length !== 1 ? "zes" : ""}
                            </p>
                            <p className="text-sm text-gray-600">
                              Available to play
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <motion.div
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold text-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Join Contest
                      </motion.div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
