"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  BookOpen,
  Calendar,
  Trophy,
  Star,
  ArrowLeft,
} from "lucide-react";
import { getEventById } from "@/redux/features/eventSlice";
import { getQuizzesByEventId } from "@/redux/features/quizSlice";
import { AppDispatch, RootState } from "@/store/store";
import ParticipateQuiz from "@/app/components/shared/ParticipateQuiz";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

export default function QuizzesBasedOnEvent() {
  const params = useParams();
  const eventId = params.eventId as string;

  const dispatch = useDispatch<AppDispatch>();

  // Selectors for event and quizzes
  const {
    selectedEvent: event,
    loading: eventLoading,
    error: eventError,
  } = useSelector((state: RootState) => state.events);
  const {
    quizzes,
    loading: quizzesLoading,
    error: quizzesError,
  } = useSelector((state: RootState) => state.quizzes);

  useEffect(() => {
    if (eventId) {
      console.log("Loading event and quizzes for eventId:", eventId);
      dispatch(getEventById(eventId));
      dispatch(getQuizzesByEventId(eventId));
    }
  }, [dispatch, eventId]);

  if (eventLoading || quizzesLoading) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Event...
          </h3>
          <p className="text-gray-500">
            Please wait while we fetch the event details
          </p>
        </div>
      </motion.div>
    );
  }

  if (eventError || quizzesError) {
    console.error("Event or Quiz loading error:", { eventError, quizzesError });
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-red-100">
          <motion.div
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Trophy className="w-8 h-8 text-red-500" />
          </motion.div>

          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Event
          </h2>
          <p className="text-gray-600 mb-4">{eventError || quizzesError}</p>
          <p className="text-sm text-gray-500 mb-6">Event ID: {eventId}</p>

          <motion.button
            onClick={() => {
              console.log("Retrying event load...");
              dispatch(getEventById(eventId));
              dispatch(getQuizzesByEventId(eventId));
            }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!event) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100">
          <motion.div
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Calendar className="w-8 h-8 text-gray-500" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you are looking for does not exist or has been removed.
          </p>

          <Link href="/">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
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

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <motion.button
                className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
            </Link>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {event.title}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                {event.description ||
                  "Join this exciting quiz event and test your knowledge!"}
              </p>
            </div>
          </div>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Event Date</h3>
              </div>
              <p className="text-gray-600">
                {format(new Date(event.startDate), "MMM dd, yyyy")} -{" "}
                {format(new Date(event.endDate), "MMM dd, yyyy")}
              </p>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Participants</h3>
              </div>
              <p className="text-gray-600">
                {event.participants.length} registered
              </p>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Quizzes</h3>
              </div>
              <p className="text-gray-600">{quizzes.length} available</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Quizzes Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Available Quizzes
              </h2>
              <p className="text-gray-600">
                Choose a quiz to start your journey
              </p>
            </div>
            {event.status === "ongoing" && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Create New Quiz
                </Button>
              </motion.div>
            )}
          </div>

          {quizzes.length === 0 ? (
            <motion.div
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <motion.div
                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen className="w-10 h-10 text-gray-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                No Quizzes Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                There are no quizzes for this event yet. Check back later or
                contact the event organizer.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz._id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl border-0 bg-white/90 backdrop-blur-sm group p-0 rounded-3xl">
                    {/* Header with gradient background */}
                    <div className="relative h-56 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>

                      {/* Quiz Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="text-2xl font-bold text-white line-clamp-2 mb-2">
                          {quiz.title}
                        </h3>
                        {quiz.instructions && (
                          <p className="text-white/90 text-sm line-clamp-2">
                            {quiz.instructions}
                          </p>
                        )}
                      </div>

                      {/* Decorative elements */}
                      <motion.div
                        className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BookOpen className="w-6 h-6 text-white" />
                      </motion.div>

                      {/* Status indicator */}
                      <div className="absolute top-4 right-4">
                        <motion.div
                          className="w-3 h-3 bg-green-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Duration */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {quiz.duration} Minutes
                            </p>
                            <p className="text-sm text-gray-600">Time limit</p>
                          </div>
                        </div>

                        {/* Total Marks */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Star className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {quiz.totalMarks} Total Marks
                            </p>
                            <p className="text-sm text-gray-600">
                              Maximum score
                            </p>
                          </div>
                        </div>

                        {/* Passing Marks */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {quiz.passingMarks} Passing Marks
                            </p>
                            <p className="text-sm text-gray-600">
                              Required to pass
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <ParticipateQuiz
                        quizId={quiz._id}
                        quizTitle={quiz.title}
                        duration={quiz.duration}
                        totalMarks={quiz.totalMarks}
                        passingMarks={quiz.passingMarks}
                        eventId={eventId}
                      />
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
