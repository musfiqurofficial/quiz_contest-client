"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getEvents } from "@/redux/features/eventSlice";
import { getQuizzes } from "@/redux/features/quizSlice";
import { fetchParticipations } from "@/redux/features/participationSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, Trophy, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";
import RewardPoints from "@/components/ui/reward-points";

const StudentDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events } = useSelector((state: RootState) => state.events);
  const { quizzes } = useSelector((state: RootState) => state.quizzes);
  const { participations } = useSelector(
    (state: RootState) => state.participations
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("events");

  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(getEvents()),
        dispatch(getQuizzes()),
        dispatch(fetchParticipations()),
      ]);
    } catch {
      toast.error("Failed to load data");
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getEventStatus = (event: { startDate: string; endDate: string }) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now < startDate) return "upcoming";
    if (now > endDate) return "ended";
    return "live";
  };

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-green-100 text-green-800">Live</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "ended":
        return <Badge className="bg-gray-100 text-gray-800">Ended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getParticipationStatus = (quizId: string) => {
    const participation = participations.find((p) => p.quizId === quizId);
    if (!participation) return "not-started";
    return participation.status;
  };

  const getParticipationBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Review
          </Badge>
        );
      case "not-started":
        return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description &&
        event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const filteredQuizzes = quizzes.filter((quiz) => {
    const event = events.find((e) => e._id === quiz.eventId);
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event?.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const myParticipations = participations
    .map((participation) => {
      const quiz = quizzes.find((q) => q._id === participation.quizId);
      const event = events.find((e) => e._id === quiz?.eventId);
      return {
        ...participation,
        quiz,
        event,
      };
    })
    .filter((p) => p.quiz && p.event);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600">
            Participate in quizzes and track your progress
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <RewardPoints size="lg" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="events">Live Events</TabsTrigger>
          <TabsTrigger value="quizzes">All Quizzes</TabsTrigger>
          <TabsTrigger value="my-quizzes">My Participations</TabsTrigger>
        </TabsList>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events or quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live Events</SelectItem>
              <SelectItem value="upcoming">Upcoming Events</SelectItem>
              <SelectItem value="ended">Ended Events</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Tab */}
        <TabsContent value="events">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event);
              const eventQuizzes = quizzes.filter(
                (q) => q.eventId === event._id
              );

              return (
                <Card
                  key={event._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {event.description}
                        </CardDescription>
                      </div>
                      {getEventStatusBadge(status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString()} -{" "}
                          {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{eventQuizzes.length} Quizzes Available</span>
                      </div>
                      <div className="pt-2">
                        <Link href={`/student/events/${event._id}`}>
                          <Button
                            className="w-full"
                            disabled={status === "ended"}
                          >
                            {status === "ended"
                              ? "Event Ended"
                              : "View Quizzes"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* All Quizzes Tab */}
        <TabsContent value="quizzes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => {
              const event = events.find((e) => e._id === quiz.eventId);
              const participationStatus = getParticipationStatus(quiz._id);

              return (
                <Card
                  key={quiz._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {event?.title}
                        </CardDescription>
                      </div>
                      {getParticipationBadge(participationStatus)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{quiz.duration} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Trophy className="h-4 w-4 mr-2" />
                        <span>{quiz.totalMarks} total marks</span>
                      </div>
                      <div className="pt-2">
                        <Link href={`/student/quiz/${quiz._id}`}>
                          <Button
                            className="w-full"
                            disabled={
                              participationStatus === "completed" ||
                              participationStatus === "pending"
                            }
                          >
                            {participationStatus === "completed"
                              ? "Completed"
                              : participationStatus === "pending"
                              ? "Under Review"
                              : "Start Quiz"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* My Participations Tab */}
        <TabsContent value="my-quizzes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myParticipations.map((participation) => (
              <Card
                key={participation._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {participation.quiz?.title}
                      </h3>
                      <p className="text-gray-600">
                        {participation.event?.title}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Score: {participation.totalScore}
                        </span>
                        <span className="text-sm text-gray-500">
                          Submitted:{" "}
                          {new Date(
                            participation.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getParticipationBadge(participation.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={`/student/result/${participation.quizId}`}>
                    <Button size="sm" className="w-full">
                      View Result
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
