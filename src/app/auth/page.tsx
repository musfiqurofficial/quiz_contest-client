"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  BookOpen,
  MapPin,
  Calendar,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  loginUser,
  registerUser,
  checkUserExists,
  fetchUserProfile,
  logoutUser,
} from "@/redux/features/auth/authSlice";
import { RootState, AppDispatch } from "@/store/store";
import { toast } from "sonner";

export default function AuthPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    isLoading,
    error,
    isAuthenticated,
    user,
    userCheckLoading,
    userCheckError,
  } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState(1);
  const [contactType, setContactType] = useState<"phone" | "email">("phone");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    fullNameBangla: "",
    fullNameEnglish: "",
    age: "",
    grade: "",
    address: "",
    bloodGroup: "",
    parentContact: "",
    interests: [] as string[],
    futureGoals: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboardPath =
        user.role === "admin" ? "/admin/dashboard" : "/student/dashboard";
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
    setIsExistingUser(null);
  };

  const checkUserExistence = async () => {
    try {
      const result = await dispatch(
        checkUserExists({ contact, contactType })
      ).unwrap();
      setIsExistingUser(result.exists);
      setStep(2);
    } catch (err: any) {
      toast.error(err || "ব্যবহারকারী খুঁজে পেতে সমস্যা হয়েছে");
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (step === 1) {
      await checkUserExistence();
    } else if (step === 2 && isExistingUser) {
      const result = await dispatch(loginUser({ contact, password })).unwrap();
      
      // Check if user is a student
      if (result.user.role !== "student") {
        toast.error("শুধুমাত্র শিক্ষার্থী অ্যাকাউন্ট দিয়ে লগইন করা যাবে");
        await dispatch(logoutUser());
        return;
      }
      
      toast.success("লগইন সফল হয়েছে!");
      await dispatch(fetchUserProfile()).unwrap();
      router.push("/student/dashboard");
    } else if (step === 2 && !isExistingUser) {
      const result = await dispatch(
        registerUser({
          ...formData,
          age: Number(formData.age),
          contact,
          contactType,
          password,
        })
      ).unwrap();
      toast.success("নিবন্ধন সফল হয়েছে!");
      await dispatch(fetchUserProfile()).unwrap();
      router.push("/student/dashboard");
    }
  } catch (err: any) {
    toast.error(err || "একটি ত্রুটি ঘটেছে");
  }
};

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const resetForm = () => {
    setStep(1);
    setContact("");
    setPassword("");
    setIsExistingUser(null);
    setFormData({
      fullNameBangla: "",
      fullNameEnglish: "",
      age: "",
      grade: "",
      address: "",
      bloodGroup: "",
      parentContact: "",
      interests: [],
      futureGoals: "",
    });
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };

  // লোডিং স্টেট প্রদর্শন
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-emerald-100 py-[50px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-t-8 border-indigo-500 bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3"
            >
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </motion.div>

            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              কুইজ প্রতিযোগিতা
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              {step === 1
                ? "লগইন অথবা রেজিস্ট্রেশন করুন"
                : isExistingUser
                ? "আপনার অ্যাকাউন্টে লগইন করুন"
                : "নতুন অ্যাকাউন্ট তৈরি করুন"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label
                        className="text-gray-700 mb-3 block font-medium"
                      >
                        যোগাযোগের মাধ্যম নির্বাচন করুন
                      </Label>
                      <Tabs
                        value={contactType}
                        onValueChange={(value) =>
                          setContactType(value as "phone" | "email")
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
                          <TabsTrigger
                            value="phone"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                          >
                            <Phone size={16} /> ফোন
                          </TabsTrigger>
                          <TabsTrigger
                            value="email"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                          >
                            <Mail size={16} /> ইমেইল
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="phone" className="mt-5">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700">
                              মোবাইল নম্বর
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <Phone size={18} />
                              </div>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="০১৭১২-৩৪৫৬৭৮"
                                value={contact}
                                onChange={handleContactChange}
                                className="pl-10 text-lg h-12 rounded-xl"
                                required
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="email" className="mt-5">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">
                              ইমেইল ঠিকানা
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <Mail size={18} />
                              </div>
                              <Input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                value={contact}
                                onChange={handleContactChange}
                                className="pl-10 text-lg h-12 rounded-xl"
                                required
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-lg py-3 h-12 rounded-xl shadow-md"
                      disabled={!contact || userCheckLoading}
                    >
                      {userCheckLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          যাচাই করা হচ্ছে...
                        </>
                      ) : (
                        "পরবর্তী ধাপ"
                      )}
                    </Button>
                  </motion.div>
                )}

                {step === 2 && isExistingUser && (
                  <motion.div
                    key="step2-login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 shadow-inner">
                          <User size={14} />
                        </div>
                        <p className="text-gray-600 font-medium">
                          {contactType === "phone"
                            ? `ফোন: ${contact}`
                            : `ইমেইল: ${contact}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleBack}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto"
                      >
                        <ChevronLeft size={16} /> পরিবর্তন করুন
                      </button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700">
                        পাসওয়ার্ড
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <Lock size={18} />
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="পাসওয়ার্ড লিখুন"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 text-lg h-12 rounded-xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <a
                        href="#"
                        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </a>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-lg py-3 h-12 rounded-xl shadow-md"
                        disabled={!password || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            প্রক্রিয়া চলছে...
                          </>
                        ) : (
                          "লগইন করুন"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && !isExistingUser && (
                  <motion.div
                    key="step2-register"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <p className="text-gray-600 font-medium">
                        {contactType === "phone"
                          ? `ফোন: ${contact}`
                          : `ইমেইল: ${contact}`}
                      </p>
                      <button
                        type="button"
                        onClick={handleBack}
                        className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto"
                      >
                        <ChevronLeft size={16} /> পরিবর্তন করুন
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullNameBangla"
                          className="text-gray-700"
                        >
                          পূর্ণ নাম (বাংলায়)
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <User size={18} />
                          </div>
                          <Input
                            id="fullNameBangla"
                            placeholder="আপনার নাম লিখুন"
                            value={formData.fullNameBangla}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fullNameBangla: e.target.value,
                              })
                            }
                            className="pl-10 h-11 rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="fullNameEnglish"
                          className="text-gray-700"
                        >
                          পূর্ণ নাম (ইংরেজিতে)
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <User size={18} />
                          </div>
                          <Input
                            id="fullNameEnglish"
                            placeholder="Your full name"
                            value={formData.fullNameEnglish}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fullNameEnglish: e.target.value,
                              })
                            }
                            className="pl-10 h-11 rounded-xl"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-gray-700">
                          বয়স
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <Calendar size={18} />
                          </div>
                          <Input
                            id="age"
                            type="number"
                            placeholder="বয়স"
                            value={formData.age}
                            onChange={(e) =>
                              setFormData({ ...formData, age: e.target.value })
                            }
                            className="pl-10 h-11 rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="grade" className="text-gray-700">
                          শ্রেণি
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setFormData({ ...formData, grade: value })
                          }
                        >
                          <SelectTrigger className="!h-11 rounded-xl w-full">
                            <SelectValue placeholder="শ্রেণি নির্বাচন" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">৬ষ্ঠ শ্রেণি</SelectItem>
                            <SelectItem value="7">৭ম শ্রেণি</SelectItem>
                            <SelectItem value="8">৮ম শ্রেণি</SelectItem>
                            <SelectItem value="9">৯ম শ্রেণি</SelectItem>
                            <SelectItem value="10">১০ম শ্রেণি</SelectItem>
                            <SelectItem value="11">১১শ শ্রেণি</SelectItem>
                            <SelectItem value="12">১২শ শ্রেণি</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-700">
                        ঠিকানা
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <MapPin size={18} />
                        </div>
                        <Input
                          id="address"
                          placeholder="গ্রাম/পাড়া, উপজেলা, জেলা"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          className="pl-10 h-11 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="parentContact"
                        className="text-gray-700"
                      >
                        অভিভাবকের মোবাইল নম্বর
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <Phone size={18} />
                        </div>
                        <Input
                          id="parentContact"
                          type="tel"
                          placeholder="অভিভাবকের মোবাইল নম্বর"
                          value={formData.parentContact}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              parentContact: e.target.value,
                            })
                          }
                          className="pl-10 h-11 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-700">
                        আগ্রহের বিষয় (এক বা একাধিক নির্বাচন করুন)
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "গণিত",
                          "বিজ্ঞান",
                          "ইতিহাস",
                          "বাংলা",
                          "ইংরেজি",
                          "সাধারণ জ্ঞান",
                        ].map((subject) => (
                          <motion.div
                            key={subject}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleInterest(subject)}
                            className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                              formData.interests.includes(subject)
                                ? "bg-indigo-100 border border-indigo-300 shadow-inner"
                                : "bg-gray-100 hover:bg-gray-200 border border-transparent"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center ${
                                formData.interests.includes(subject)
                                  ? "bg-indigo-600 text-white"
                                  : "bg-white text-transparent border border-gray-300"
                              }`}
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-sm">{subject}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700">
                        পাসওয়ার্ড তৈরি করুন
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <Lock size={18} />
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="পাসওয়ার্ড লিখুন"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 text-lg h-12 rounded-xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg py-3 h-12 rounded-xl shadow-md"
                        disabled={
                          !formData.fullNameBangla ||
                          !formData.fullNameEnglish ||
                          !formData.age ||
                          !formData.grade ||
                          !formData.address ||
                          isLoading
                        }
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            প্রক্রিয়া চলছে...
                          </>
                        ) : (
                          "নিবন্ধন করুন"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-600 bg-white/70 p-4 rounded-xl backdrop-blur-sm"
        >
          <p className="font-medium">তথ্য সুরক্ষা নিশ্চিত</p>
          <p className="mt-1">
            এই তথ্য শুধুমাত্র কুইজ প্রতিযোগিতা ও শিক্ষার্থী উন্নয়নের কাজে
            ব্যবহৃত হবে।
          </p>
          <p>তৃতীয় পক্ষের সাথে শেয়ার করা হবে না।</p>
        </motion.div>
      </motion.div>
    </div>
  );
}