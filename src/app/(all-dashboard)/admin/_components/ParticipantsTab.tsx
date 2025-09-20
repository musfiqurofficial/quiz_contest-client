import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Eye, Download, Search, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { IParticipation, IStudent } from "@/redux/features/participationSlice";
import { Event } from "@/redux/features/eventSlice";
import { Quiz } from "@/redux/features/quizSlice";

interface ParticipantsTabProps {
  participations: IParticipation[];
  events: Event[];
  quizzes: Quiz[];
  participationsLoading: boolean;
  selectedQuiz: string;
  setSelectedQuiz: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  onViewDetails: (participation: IParticipation) => void;
  onExportResults: () => void;
  onUpdateParticipation: (id: string, data: Partial<IParticipation>) => void;
  onDeleteParticipation: (id: string) => void;
}

const ParticipantsTab: React.FC<ParticipantsTabProps> = ({
  participations,
  events,
  quizzes,
  participationsLoading,
  selectedQuiz,
  setSelectedQuiz,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onViewDetails,
  onExportResults,
  onUpdateParticipation,
  onDeleteParticipation,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number, totalMarks: number) => {
    const percentage = (score / totalMarks) * 100;
    if (percentage >= 80) return "text-green-600 font-semibold";
    if (percentage >= 60) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const getStudentInfo = (studentId: string | IStudent) => {
    if (typeof studentId === "string") {
      return {
        id: studentId,
        name: "Unknown Student",
        contact: "N/A",
      };
    }
    return {
      id: studentId._id,
      name:
        studentId.fullNameEnglish ||
        studentId.fullNameBangla ||
        "Unknown Student",
      contact: studentId.contact || "N/A",
    };
  };

  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find((q) => q._id === quizId);
    return quiz?.title || "Unknown Quiz";
  };

  const getEventTitle = (quizId: string) => {
    const quiz = quizzes.find((q) => q._id === quizId);
    const event = events.find((e) => e._id === quiz?.eventId);
    return event?.title || "Unknown Event";
  };

  const getTotalMarks = (quizId: string) => {
    const quiz = quizzes.find((q) => q._id === quizId);
    return quiz?.totalMarks || 0;
  };

  const filteredParticipations = participations.filter((participation) => {
    const quiz = quizzes.find((q) => q._id === participation.quizId);
    const event = events.find((e) => e._id === quiz?.eventId);
    const studentInfo = getStudentInfo(participation.studentId);

    const matchesQuiz =
      selectedQuiz === "all" || participation.quizId === selectedQuiz;
    const matchesStatus =
      statusFilter === "all" || participation.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      studentInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentInfo.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event?.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesQuiz && matchesStatus && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants Management
              </CardTitle>
              <CardDescription>
                View and manage quiz participants and their results
              </CardDescription>
            </div>
            <Button onClick={onExportResults} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quizFilter">Quiz</Label>
              <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                <SelectTrigger>
                  <SelectValue placeholder="All Quizzes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quizzes</SelectItem>
                  {quizzes.map((quiz) => (
                    <SelectItem key={quiz._id} value={quiz._id}>
                      {quiz.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Total Participants</Label>
              <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-gray-50">
                <span className="text-sm font-medium">
                  {filteredParticipations.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {participationsLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredParticipations.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No participants found
            </h3>
            <p className="text-gray-500">
              {participations.length === 0
                ? "No one has participated in any quiz yet."
                : "No participants match your current filters."}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipations.map((participation) => {
                  const totalMarks = getTotalMarks(participation.quizId);
                  const percentage =
                    totalMarks > 0
                      ? (participation.totalScore / totalMarks) * 100
                      : 0;
                  const studentInfo = getStudentInfo(participation.studentId);

                  return (
                    <TableRow key={participation._id}>
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {studentInfo.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {studentInfo.contact}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {studentInfo.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getQuizTitle(participation.quizId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getEventTitle(participation.quizId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div
                            className={`text-sm ${getScoreColor(
                              participation.totalScore,
                              totalMarks
                            )}`}
                          >
                            {participation.totalScore} / {totalMarks}
                          </div>
                          <div className="text-xs text-gray-500">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(participation.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(
                            participation.createdAt
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(
                            participation.createdAt
                          ).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewDetails(participation)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              onUpdateParticipation(participation._id, {
                                status: "completed",
                              })
                            }
                            title="Mark as Completed"
                            disabled={participation.status === "completed"}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              onDeleteParticipation(participation._id)
                            }
                            title="Delete Participation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParticipantsTab;