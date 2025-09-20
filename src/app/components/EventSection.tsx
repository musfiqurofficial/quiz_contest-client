"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "@/redux/features/eventSlice";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy } from "lucide-react";
import { format, isAfter, isBefore } from "date-fns";

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
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse p-0">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Events</h2>
        <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
          <p>Error loading events: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Active Events
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join ongoing quiz contests and compete with participants from around
          the world
        </p>
      </div>

      {activeEvents.length === 0 ? (
        <div className="text-center p-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No Active Events
          </h3>
          <p className="text-lg text-gray-600 mb-4">
            There are no events currently running.
          </p>
          <p className="text-muted-foreground">
            Check back later for new events!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {activeEvents.map((event) => (
            <Link key={event._id} href={`/${event._id}`} className="group">
              <Card className="h-full overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm p-0">
                {/* Header with gradient background */}
                <div className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      Live Now
                    </Badge>
                  </div>

                  {/* Event Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-2xl font-bold text-white line-clamp-2 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-2">
                      {event.description || "Join this exciting quiz contest!"}
                    </p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
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
                          {format(new Date(event.startDate), "MMM dd, yyyy")}
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
                  <div className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold text-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    Join Contest
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
