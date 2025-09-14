import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IQuiz, IQuestion } from '@/redux/features/questionSlice';

interface QuestionsTabProps {
  quizzes: IQuiz[];
  questions: IQuestion[];
  questionsLoading: boolean;
  newQuestion: Partial<IQuestion>;
  setNewQuestion: React.Dispatch<React.SetStateAction<Partial<IQuestion>>>;
  handleCreateQuestion: () => void;
  handleOptionChange: (index: number, value: string) => void;
  setEditItem: React.Dispatch<React.SetStateAction<{type: string, data: any} | null>>;
  setDeleteDialog: React.Dispatch<React.SetStateAction<{type: string, id: string} | null>>;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ 
  quizzes, 
  questions, 
  questionsLoading, 
  newQuestion, 
  setNewQuestion, 
  handleCreateQuestion,
  handleOptionChange,
  setEditItem,
  setDeleteDialog 
}) => {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge variant="outline" className="bg-green-50 text-green-800">Easy</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Medium</Badge>;
      case 'hard':
        return <Badge variant="outline" className="bg-red-50 text-red-800">Hard</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Questions Management</CardTitle>
          <CardDescription>Create and manage quiz questions</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={quizzes.length === 0}>
              <Plus className="mr-2 h-4 w-4" /> New Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Question</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new question.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="questionQuiz">Quiz *</Label>
                <Select
                  value={newQuestion.quizId || ''}
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, quizId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a quiz" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizzes.filter(q => q.isActive !== false).map((quiz) => (
                      <SelectItem key={quiz._id} value={quiz._id}>
                        {quiz.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="questionText">Question Text *</Label>
                <Textarea
                  id="questionText"
                  value={newQuestion.text || ''}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Enter your question"
                  rows={3}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Options *</Label>
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={newQuestion.options?.[index] || ''}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        required
                      />
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newQuestion.correctAnswer === newQuestion.options?.[index]}
                        onChange={() => setNewQuestion({ 
                          ...newQuestion, 
                          correctAnswer: newQuestion.options?.[index] || '' 
                        })}
                        className="rounded"
                        required
                      />
                      <Label className="text-sm">Correct</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="questionMarks">Marks *</Label>
                  <Input
                    id="questionMarks"
                    type="number"
                    min="1"
                    value={newQuestion.marks || 0}
                    onChange={(e) => setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })}
                    placeholder="Marks"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="questionDifficulty">Difficulty</Label>
                  <Select
                    value={newQuestion.difficulty || ''}
                    onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreateQuestion} disabled={questionsLoading}>
                {questionsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Question
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {questionsLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500">Create your first question to get started.</p>
            {quizzes.length === 0 && (
              <p className="text-sm text-amber-600 mt-2">
                You need to create a quiz first before creating questions.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => {
                  const quiz = quizzes.find(q => q._id === question.quizId);
                  
                  return (
                    <TableRow key={question._id}>
                      <TableCell className="font-medium max-w-md truncate">
                        {question.text}
                      </TableCell>
                      <TableCell>
                        {quiz ? (
                          <Badge variant="outline">{quiz.title}</Badge>
                        ) : (
                          <Badge variant="secondary">Unknown Quiz</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getDifficultyBadge(question.difficulty)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{question.marks}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditItem({type: 'question', data: question})}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setDeleteDialog({type: 'question', id: question._id})}
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

export default QuestionsTab;