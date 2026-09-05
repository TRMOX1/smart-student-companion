"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Plus,
  Smartphone,
  Monitor,
  Code2,
  Copy,
  Check,
  Award,
  TrendingUp,
  AlertCircle,
  FileText,
  BrainCircuit,
  ChevronLeft,
  HelpCircle,
  Download,
} from "lucide-react";
import { FLUTTER_ANDROID_FILES, FlutterCodeFile } from "@/lib/flutterAndroidCode";

interface Subject {
  id: number;
  name: string;
  teacherName: string;
  color: string;
  difficultyLevel: string;
  weeklyClasses: number;
  targetGrade: string;
  notes: string;
}

interface TaskItem {
  id: number;
  subjectId: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  steps: { text: string; done: boolean }[];
}

interface StudySession {
  id: number;
  subjectId: number;
  title: string;
  studyDate: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  status: string;
  priorityScore: number;
  notes: string;
}

interface Exam {
  id: number;
  subjectId: number;
  title: string;
  examDate: string;
  examTime: string;
  location: string;
  examType: string;
  importanceLevel: string;
  topics: { title: string; completed: boolean }[];
  readinessPercent: number;
}

interface Flashcard {
  id: number;
  subjectId: number;
  question: string;
  answer: string;
  difficulty: string;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string;
  correctCount: number;
  wrongCount: number;
}

interface NoteItem {
  id: number;
  subjectId: number;
  title: string;
  content: string;
  tags: string[];
}

interface QuizItem {
  id: number;
  subjectId: number;
  title: string;
  difficulty: string;
  lastScore: number;
  totalQuestions: number;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export default function SmartStudentCompanionPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "schedule" | "pomodoro" | "flashcards" | "analytics" | "flutterCode"
  >("dashboard");

  const [isAndroidFrame, setIsAndroidFrame] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // App State from DB
  const [profile, setProfile] = useState({
    fullName: "أحمد محمد العلمي",
    educationLevel: "المرحلة الجامعية",
    gradeOrMajor: "هندسة البرمجيات - السنة الثالثة",
    xpPoints: 1480,
    level: 4,
    streakDays: 14,
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);

  // Modals state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddFlashcardModal, setShowAddFlashcardModal] = useState(false);

  // New Task Form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubjectId, setNewTaskSubjectId] = useState<number>(1);
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("عالية");

  // New Subject Form
  const [newSubName, setNewSubName] = useState("");
  const [newSubTeacher, setNewSubTeacher] = useState("");
  const [newSubDifficulty, setNewSubDifficulty] = useState("صعبة");
  const [newSubColor, setNewSubColor] = useState("#2563EB");

  // New Flashcard Form
  const [newCardQuestion, setNewCardQuestion] = useState("");
  const [newCardAnswer, setNewCardAnswer] = useState("");
  const [newCardSubjectId, setNewCardSubjectId] = useState<number>(1);

  // Pomodoro State
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "short" | "long">("focus");
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(3);

  // Flashcard 3D Flip State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Quiz State
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Flutter Code Studio State
  const [selectedFlutterFile, setSelectedFlutterFile] = useState<FlutterCodeFile>(
    FLUTTER_ANDROID_FILES[1] // main.dart default
  );
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Load initial state
  const fetchCompanionData = async () => {
    try {
      const res = await fetch("/api/companion");
      const data = await res.json();
      if (data.profile) setProfile(data.profile);
      if (data.subjects) {
        setSubjects(data.subjects);
        if (data.subjects[0]) {
          setNewTaskSubjectId(data.subjects[0].id);
          setNewCardSubjectId(data.subjects[0].id);
        }
      }
      if (data.tasks) setTasks(data.tasks);
      if (data.studySessions) setStudySessions(data.studySessions);
      if (data.exams) setExams(data.exams);
      if (data.flashcards) setFlashcards(data.flashcards);
      if (data.notes) setNotes(data.notes);
      if (data.quizzes) setQuizzes(data.quizzes);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanionData();
  }, []);

  // Pomodoro timer effect
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          setCompletedPomodoros((c) => c + 1);
          triggerConfetti();
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleToggleTaskStatus = async (task: TaskItem) => {
    const newStatus = task.status === "مكتمل" ? "قيد العمل" : "مكتمل";
    if (newStatus === "مكتمل") {
      triggerConfetti();
      setProfile((p) => ({ ...p, xpPoints: p.xpPoints + 15 }));
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
    await fetch("/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "TOGGLE_TASK_STATUS",
        payload: { id: task.id, newStatus },
      }),
    });
  };

  const handleGenerateSmartSchedule = async () => {
    const res = await fetch("/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "GENERATE_SMART_SCHEDULE" }),
    });
    const data = await res.json();
    if (data.generated) {
      setStudySessions((prev) => [...data.generated, ...prev]);
      triggerConfetti();
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const res = await fetch("/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "ADD_SUBJECT",
        payload: {
          name: newSubName,
          teacherName: newSubTeacher || "د. أستاذ المادة",
          color: newSubColor,
          difficultyLevel: newSubDifficulty,
        },
      }),
    });
    const data = await res.json();
    if (data.subject) {
      setSubjects((prev) => [...prev, data.subject]);
      setNewSubName("");
      setNewSubTeacher("");
      setShowAddSubjectModal(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const due = newTaskDueDate || new Date().toISOString().split("T")[0];
    const res = await fetch("/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "ADD_TASK",
        payload: {
          subjectId: newTaskSubjectId,
          title: newTaskTitle,
          dueDate: due,
          priority: newTaskPriority,
        },
      }),
    });
    const data = await res.json();
    if (data.task) {
      setTasks((prev) => [data.task, ...prev]);
      setNewTaskTitle("");
      setShowAddTaskModal(false);
    }
  };

  const handleAddFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardQuestion.trim() || !newCardAnswer.trim()) return;
    const res = await fetch("/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "ADD_FLASHCARD",
        payload: {
          subjectId: newCardSubjectId,
          question: newCardQuestion,
          answer: newCardAnswer,
        },
      }),
    });
    const data = await res.json();
    if (data.card) {
      setFlashcards((prev) => [...prev, data.card]);
      setNewCardQuestion("");
      setNewCardAnswer("");
      setShowAddFlashcardModal(false);
    }
  };

  const handleReviewFlashcard = async (rating: "easy" | "good" | "hard") => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    await fetch("/api/companion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "REVIEW_FLASHCARD",
        payload: { id: currentCard.id, rating },
      }),
    });

    setProfile((p) => ({ ...p, xpPoints: p.xpPoints + 10 }));
    setIsCardFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 180);
  };

  const handleCopyFlutterCode = () => {
    navigator.clipboard.writeText(selectedFlutterFile.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadFlutterFile = (file: FlutterCodeFile) => {
    const blob = new Blob([file.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculations
  const completedTasksCount = tasks.filter((t) => t.status === "مكتمل").length;
  const totalTasksCount = tasks.length || 1;
  const dailyCompletionPercent = Math.round((completedTasksCount / totalTasksCount) * 100);

  const getSubjectById = (id: number) =>
    subjects.find((s) => s.id === id) || {
      name: "مادة عامة",
      color: "#2563EB",
      difficultyLevel: "متوسطة",
    };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-xl animate-pulse">
          <GraduationCap className="w-9 h-9" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 font-cairo">
          جاري تشغيل رفيق الطالب الذكي...
        </h2>
        <p className="text-sm text-slate-500">
          تجهيز جدول المذاكرة الذكي وبطاقات المراجعة SRS
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Top Action Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 border-b border-slate-200 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg lg:text-xl font-extrabold text-slate-900 font-cairo">
                  رفيق الطالب الذكي
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Android & Web v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Smart Student Companion • مساعدك الدراسي الذكي لتنظيم الوقت والتفوق
              </p>
            </div>
          </div>

          {/* Gamification & Android Simulator Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{profile.streakDays} يوم التزام</span>
            </div>

            {/* XP & Level Badge */}
            <div className="flex items-center gap-2 bg-violet-50 border border-violet-200/80 text-violet-800 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <Award className="w-4 h-4 text-violet-600" />
              <span>{profile.xpPoints} XP</span>
              <span className="bg-violet-600 text-white px-2 py-0.5 rounded-full text-[10px]">
                مستوى {profile.level}
              </span>
            </div>

            {/* Toggle Android Mobile Simulator Frame */}
            <button
              onClick={() => setIsAndroidFrame(!isAndroidFrame)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                isAndroidFrame
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
              title="تبديل عرض شاشة هاتف الأندرويد المحاكي"
            >
              {isAndroidFrame ? (
                <>
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span>عرض الشاشة الكاملة</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>محاكي هاتف الأندرويد</span>
                </>
              )}
            </button>

            {/* Quick CTA to Flutter Android Code */}
            <button
              onClick={() => setActiveTab("flutterCode")}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm hover:opacity-95 transition"
            >
              <Code2 className="w-4 h-4" />
              <span>كود Flutter للأندرويد</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
          {[
            { id: "dashboard", label: "الرئيسية Dashboard", icon: LayoutDashboard },
            { id: "schedule", label: "الجدول الذكي والمهام", icon: Calendar },
            { id: "pomodoro", label: "بومودورو والملخصات", icon: Clock },
            { id: "flashcards", label: "بطاقات SRS والاختبارات", icon: Layers },
            { id: "analytics", label: "الإحصائيات والتقدم", icon: TrendingUp },
            {
              id: "flutterCode",
              label: "كود تطبيق الأندرويد Flutter (Dart)",
              icon: Code2,
              highlight: true,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600 shadow-xs"
                    : tab.highlight
                    ? "text-violet-700 bg-violet-50/60 hover:bg-violet-100/70"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Wrapper: Either Full Web Workspace OR Android Smartphone Simulator Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        <div
          className={
            isAndroidFrame
              ? "max-w-[430px] mx-auto bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden relative min-h-[790px] flex flex-col"
              : "w-full"
          }
        >
          {/* Optional Android Status Bar when in phone simulator mode */}
          {isAndroidFrame && (
            <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-[11px] font-mono-numbers select-none">
              <span>09:41 AM</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>100% 🔋</span>
              </div>
            </div>
          )}

          <div className={isAndroidFrame ? "p-4 flex-1 overflow-y-auto" : ""}>
            {/* ============================================================== */}
            {/* TAB 1: DASHBOARD (الرئيسية) */}
            {/* ============================================================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Welcome Hero Banner + Daily Progress Gauge */}
                <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-violet-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>مساعدك الشخصي نحو التفوق الدراسي</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo">
                      مرحباً بك، {profile.fullName} 👋
                    </h2>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      لديك اليوم <strong>{studySessions.length} جلسات مذاكرة ذكية</strong> و{" "}
                      <strong>
                        {tasks.filter((t) => t.status !== "مكتمل").length} واجبات
                      </strong>{" "}
                      تحتاج متابعة. تذكر أن خطوة صغيرة منظمة اليوم تصنع تفوقاً كبيراً غداً!
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setShowAddTaskModal(true)}
                        className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة واجب سريع</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("pomodoro")}
                        className="bg-blue-500/30 hover:bg-blue-500/40 border border-white/25 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Clock className="w-4 h-4" />
                        <span>بدء جلسة تركيز بومودورو</span>
                      </button>
                    </div>
                  </div>

                  {/* Daily Completion Circular Card */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-5 min-w-[240px]">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-white/20"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-400 transition-all duration-500"
                          strokeDasharray={`${dailyCompletionPercent}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-lg font-extrabold font-mono-numbers">
                        {dailyCompletionPercent}%
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-blue-100">نسبة إنجاز اليوم</p>
                      <p className="text-lg font-bold">
                        {completedTasksCount} / {tasks.length} مهام
                      </p>
                      <span className="inline-block mt-1 text-[11px] bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-md">
                        +15 XP لكل مهمة مكتملة
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3-Column Bento Grid: Today's Smart Schedule | Urgent Tasks | Upcoming Exams */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Column 1: Today's Smart Study Schedule (4 cols) */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 font-cairo text-base">
                              جدول المذاكرة الذكي اليوم
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              مرتب حسب أولوية المواد والاختبارات
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleGenerateSmartSchedule}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2.5 py-1.5 rounded-lg"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>توليد ذكي</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {studySessions.slice(0, 4).map((session) => {
                          const sub = getSubjectById(session.subjectId);
                          return (
                            <div
                              key={session.id}
                              className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 transition bg-slate-50/50 flex items-center justify-between gap-3"
                              style={{ borderRightWidth: "4px", borderRightColor: sub.color }}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-900">
                                    {session.title}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {session.notes}
                                </p>
                              </div>
                              <div className="text-left shrink-0">
                                <span className="text-xs font-bold font-mono-numbers text-slate-800 block">
                                  {session.startTime} - {session.endTime}
                                </span>
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 mt-1">
                                  أولوية: {session.priorityScore} نقاط
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("schedule")}
                      className="mt-4 w-full py-2 text-center text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition"
                    >
                      عرض الجدول الأسبوعي الكامل وإدارة المواد ←
                    </button>
                  </div>

                  {/* Column 2: Urgent Assignments & Tasks (4 cols) */}
                  <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 font-cairo text-base">
                              الواجبات والمهام القادمة
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              اضغط على المهمة لإكمالها وكسب +15 XP
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowAddTaskModal(true)}
                          className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100"
                        >
                          + واجب
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {tasks.map((task) => {
                          const sub = getSubjectById(task.subjectId);
                          const isDone = task.status === "مكتمل";
                          return (
                            <div
                              key={task.id}
                              onClick={() => handleToggleTaskStatus(task)}
                              className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                                isDone
                                  ? "bg-slate-50 border-slate-200 opacity-75"
                                  : "bg-white border-slate-200 hover:border-blue-400"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => {}}
                                className="mt-1 w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                              />
                              <div className="flex-1">
                                <p
                                  className={`text-xs sm:text-sm font-bold ${
                                    isDone ? "line-through text-slate-400" : "text-slate-800"
                                  }`}
                                >
                                  {task.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                  <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white"
                                    style={{ backgroundColor: sub.color }}
                                  >
                                    {sub.name}
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    التسليم: {task.dueDate}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                      task.priority === "عالية"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Upcoming Exams Countdown & Readiness (3 cols) */}
                  <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 font-cairo text-base">
                            الاختبارات القادمة
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            مؤشر الجاهزية والعد التنازلي
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {exams.map((exam) => {
                          const sub = getSubjectById(exam.subjectId);
                          return (
                            <div
                              key={exam.id}
                              className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                                  style={{ backgroundColor: sub.color }}
                                >
                                  {exam.examType}
                                </span>
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                  التاريخ: {exam.examDate}
                                </span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-900">
                                {exam.title}
                              </h4>
                              <p className="text-xs text-slate-500">
                                📍 {exam.location} • ⏰ {exam.examTime}
                              </p>

                              {/* Readiness Progress Bar */}
                              <div className="pt-1">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-slate-600 font-semibold">
                                    نسبة الجاهزية للمادة:
                                  </span>
                                  <span className="font-bold text-blue-600 font-mono-numbers">
                                    {exam.readinessPercent}%
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full"
                                    style={{ width: `${exam.readinessPercent}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Flashcard Review CTA */}
                    <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200/70">
                      <p className="text-xs font-bold text-violet-950">
                        💡 لديك {flashcards.length} بطاقات مراجعة مستحقة اليوم!
                      </p>
                      <button
                        onClick={() => setActiveTab("flashcards")}
                        className="mt-2 w-full py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition"
                      >
                        ابدأ مراجعة البطاقات الآن
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: SMART SCHEDULE & SUBJECTS (الجدول الذكي والمواد) */}
            {/* ============================================================== */}
            {activeTab === "schedule" && (
              <div className="space-y-6">
                {/* Algorithm Explanation Banner */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-extrabold text-slate-900 font-cairo">
                        خوارزمية جدول المذاكرة الذكي (Smart Priority Algorithm)
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600">
                      يقوم النظام بحساب نقاط الأولوية لكل مادة تلقائياً: (صعوبة المادة + قرب الاختبار + وجود واجبات عاجلة) لتوزيع ساعات الدراسة بذكاء.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowAddSubjectModal(true)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة مادة</span>
                    </button>
                    <button
                      onClick={handleGenerateSmartSchedule}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>إعادة توليد الجدول الذكي</span>
                    </button>
                  </div>
                </div>

                {/* Subjects List Grid */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-3 font-cairo">
                    المواد الدراسية المسجلة ({subjects.length} مواد)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition"
                        style={{ borderTopWidth: "4px", borderTopColor: sub.color }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{sub.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              👨‍🏫 {sub.teacherName}
                            </p>
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              sub.difficultyLevel === "صعبة"
                                ? "bg-red-100 text-red-700"
                                : sub.difficultyLevel === "متوسطة"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {sub.difficultyLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-xl">
                          📌 {sub.notes || "لا توجد ملاحظات إضافية"}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
                          <span>عدد الحصص: {sub.weeklyClasses}/أسبوع</span>
                          <span className="font-bold text-slate-800">
                            الهدف: {sub.targetGrade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Schedule Timeline Table */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-4 font-cairo">
                    خطة جلسات الدراسة المجدولة
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-xs">
                          <th className="pb-3 font-bold">المادة والجلسة</th>
                          <th className="pb-3 font-bold">الوقت</th>
                          <th className="pb-3 font-bold">نوع النشاط</th>
                          <th className="pb-3 font-bold">نقاط الأولوية</th>
                          <th className="pb-3 font-bold">ملاحظات الخوارزمية</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studySessions.map((s) => {
                          const sub = getSubjectById(s.subjectId);
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/70">
                              <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full shrink-0"
                                  style={{ backgroundColor: sub.color }}
                                />
                                <span>{s.title}</span>
                              </td>
                              <td className="py-3.5 font-mono-numbers text-xs font-bold text-slate-700">
                                {s.startTime} - {s.endTime}
                              </td>
                              <td className="py-3.5">
                                <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-lg font-semibold">
                                  {s.sessionType}
                                </span>
                              </td>
                              <td className="py-3.5">
                                <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full">
                                  {s.priorityScore} نقاط
                                </span>
                              </td>
                              <td className="py-3.5 text-xs text-slate-500">{s.notes}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: POMODORO TIMER & NOTES (بومودورو والملخصات) */}
            {/* ============================================================== */}
            {activeTab === "pomodoro" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Pomodoro Focus Timer Widget (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>تقنية بومودورو للدراسة بدون تشتت</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-cairo">
                    مؤقت التركيز الدراسي
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    أكمل جلسة 25 دقيقة للحصول على +25 نقطة خبرة XP
                  </p>

                  {/* Mode Selector */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl mt-5">
                    {[
                      { id: "focus", label: "تركيز (25 د)", sec: 25 * 60 },
                      { id: "short", label: "راحة قصيرة (5 د)", sec: 5 * 60 },
                      { id: "long", label: "راحة طويلة (15 د)", sec: 15 * 60 },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setTimerRunning(false);
                          setPomodoroMode(m.id as typeof pomodoroMode);
                          setSecondsLeft(m.sec);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          pomodoroMode === m.id
                            ? "bg-white text-blue-600 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Circular Countdown Display */}
                  <div className="my-8 relative w-56 h-56 rounded-full border-[10px] border-blue-50 flex flex-col items-center justify-center shadow-inner bg-slate-50/50">
                    <span className="text-5xl font-extrabold font-mono-numbers text-slate-900 tracking-wider">
                      {formatTimer(secondsLeft)}
                    </span>
                    <span className="text-xs font-bold text-blue-600 mt-2">
                      {timerRunning ? "🔥 جاري التركيز..." : "مستعد للبدء"}
                    </span>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center gap-3 w-full max-w-xs justify-center">
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white shadow-md transition ${
                        timerRunning
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {timerRunning ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>إيقاف مؤقت</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>ابدأ الجلسة الآن</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setSecondsLeft(25 * 60);
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
                      title="إعادة ضبط"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-600">
                    <span>الجلسات المكتملة اليوم:</span>
                    <span className="font-bold text-slate-900">
                      {completedPomodoros} جلسات ({completedPomodoros * 25} دقيقة)
                    </span>
                  </div>
                </div>

                {/* Golden Summaries & Study Notes (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-violet-600" />
                        <h3 className="text-lg font-extrabold text-slate-900 font-cairo">
                          الملخصات الذهبية والملاحظات الدراسية
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {notes.map((n) => {
                        const sub = getSubjectById(n.subjectId);
                        return (
                          <div
                            key={n.id}
                            className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className="text-[11px] font-bold px-2.5 py-0.5 rounded-md text-white"
                                style={{ backgroundColor: sub.color }}
                              >
                                {sub.name}
                              </span>
                              <div className="flex gap-1.5">
                                {n.tags.map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <h4 className="font-bold text-slate-900 text-base">
                              {n.title}
                            </h4>
                            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                              {n.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: SPACED REPETITION FLASHCARDS & QUIZZES (البطاقات والاختبارات) */}
            {/* ============================================================== */}
            {activeTab === "flashcards" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 3D Flip Spaced Repetition Flashcard Studio (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
                          نظام التكرار المتباعد Spaced Repetition SRS
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 font-cairo mt-2">
                          مراجعة البطاقات الذكية (Flashcards)
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowAddFlashcardModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>بطاقة جديدة</span>
                      </button>
                    </div>

                    {flashcards.length > 0 && (
                      <div className="my-4">
                        {/* 3D Flip Card Container */}
                        <div
                          onClick={() => setIsCardFlipped(!isCardFlipped)}
                          className="w-full min-h-[240px] rounded-2xl p-8 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center shadow-md border-2 select-none"
                          style={{
                            backgroundColor: isCardFlipped ? "#1E293B" : "#FFFFFF",
                            borderColor: isCardFlipped ? "#3B82F6" : "#E2E8F0",
                            color: isCardFlipped ? "#FFFFFF" : "#0F172A",
                          }}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 bg-blue-500/15 text-blue-500">
                            {isCardFlipped ? "الإجابة النموذجية 💡" : "السؤال ❓ (اضغط لقلب البطاقة)"}
                          </span>
                          <p className="text-lg sm:text-xl font-bold leading-relaxed max-w-lg">
                            {isCardFlipped
                              ? flashcards[currentCardIndex]?.answer
                              : flashcards[currentCardIndex]?.question}
                          </p>
                          <span className="text-[11px] opacity-60 mt-6">
                            البطاقة {currentCardIndex + 1} من {flashcards.length} • التكرار القادم بعد{" "}
                            {flashcards[currentCardIndex]?.intervalDays} يوم
                          </span>
                        </div>

                        {/* SRS Rating Buttons */}
                        <div className="mt-5">
                          <p className="text-center text-xs text-slate-500 mb-3">
                            قيّم مدى تذكرك للإجابة لجدولة المراجعة القادمة تلقائياً:
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              onClick={() => handleReviewFlashcard("hard")}
                              className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition"
                            >
                              😓 صعبة (أعدها غداً)
                            </button>
                            <button
                              onClick={() => handleReviewFlashcard("good")}
                              className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition"
                            >
                              👍 جيدة (بعد 3 أيام)
                            </button>
                            <button
                              onClick={() => handleReviewFlashcard("easy")}
                              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition"
                            >
                              🚀 أتقنتها (بعد أسبوع)
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Short Self-Quiz Trainer (5 cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-extrabold text-slate-900 font-cairo">
                        اختبار تدريبي سريع (Quiz)
                      </h3>
                    </div>

                    {quizzes.length > 0 && !quizActive && !quizFinished && (
                      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3 my-4">
                        <h4 className="font-bold text-base text-slate-900">
                          {quizzes[0].title}
                        </h4>
                        <p className="text-xs text-slate-600">
                          عدد الأسئلة: {quizzes[0].questions.length} أسئلة اختيار من متعدد مع شرح فوري للإجابات.
                        </p>
                        <button
                          onClick={() => {
                            setQuizActive(true);
                            setCurrentQuestionIndex(0);
                            setQuizScore(0);
                            setSelectedOption(null);
                          }}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                        >
                          ابدأ الاختبار التدريبي الآن
                        </button>
                      </div>
                    )}

                    {quizActive && quizzes[0] && (
                      <div className="space-y-4 my-2">
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>
                            السؤال {currentQuestionIndex + 1} من{" "}
                            {quizzes[0].questions.length}
                          </span>
                          <span>النتيجة الحالية: {quizScore}</span>
                        </div>
                        <p className="font-bold text-sm text-slate-900 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          {quizzes[0].questions[currentQuestionIndex].question}
                        </p>
                        <div className="space-y-2">
                          {quizzes[0].questions[currentQuestionIndex].options.map(
                            (opt, idx) => {
                              const isSelected = selectedOption === idx;
                              const isCorrect =
                                idx ===
                                quizzes[0].questions[currentQuestionIndex].correctIndex;
                              return (
                                <button
                                  key={idx}
                                  disabled={selectedOption !== null}
                                  onClick={() => {
                                    setSelectedOption(idx);
                                    if (isCorrect) setQuizScore((s) => s + 1);
                                  }}
                                  className={`w-full text-right p-3 rounded-xl text-xs font-bold border transition ${
                                    selectedOption === null
                                      ? "bg-white hover:bg-blue-50 border-slate-200"
                                      : isCorrect
                                      ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                                      : isSelected
                                      ? "bg-red-50 border-red-500 text-red-900"
                                      : "bg-slate-50 border-slate-200 opacity-60"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            }
                          )}
                        </div>
                        {selectedOption !== null && (
                          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                            💡 <strong>التفسير العلمي:</strong>{" "}
                            {quizzes[0].questions[currentQuestionIndex].explanation}
                          </div>
                        )}
                        {selectedOption !== null && (
                          <button
                            onClick={() => {
                              if (
                                currentQuestionIndex + 1 <
                                quizzes[0].questions.length
                              ) {
                                setCurrentQuestionIndex((i) => i + 1);
                                setSelectedOption(null);
                              } else {
                                setQuizActive(false);
                                setQuizFinished(true);
                                triggerConfetti();
                              }
                            }}
                            className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
                          >
                            السؤال التالي ←
                          </button>
                        )}
                      </div>
                    )}

                    {quizFinished && (
                      <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3 my-4">
                        <h4 className="text-lg font-extrabold text-emerald-900">
                          🎉 أحسنت! أتممت الاختبار بنجاح
                        </h4>
                        <p className="text-sm font-bold text-emerald-800">
                          نتيجتك: {quizScore} من {quizzes[0].questions.length} (+25 XP)
                        </p>
                        <button
                          onClick={() => setQuizFinished(false)}
                          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                        >
                          إعادة التدريب
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 5: ANALYTICS & STRENGTH/WEAKNESS REPORT (الإحصائيات) */}
            {/* ============================================================== */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500">أقوى مادة حالياً</span>
                    <h4 className="text-lg font-extrabold text-emerald-600 mt-1">
                      برمجة تطبيقات Flutter (96%)
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      التزام ممتاز بالواجبات والمراجعات
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500">المادة التي تحتاج تركيزاً أكبر</span>
                    <h4 className="text-lg font-extrabold text-red-600 mt-1">
                      الفيزياء الحديثة (55%)
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      يُنصح بإضافة جلستي مراجعة إضافية هذا الأسبوع
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500">إجمالي ساعات التركيز الأسبوعية</span>
                    <h4 className="text-lg font-extrabold text-blue-600 mt-1">
                      18.5 ساعة دراسة صافية
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      أعلى بنسبة +22% مقارنة بالأسبوع الماضي
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 6: FLUTTER ANDROID SOURCE CODE STUDIO (كود تطبيق الأندرويد) */}
            {/* ============================================================== */}
            {activeTab === "flutterCode" && (
              <div className="space-y-6">
                {/* Header Banner explaining the Flutter Android Implementation */}
                <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                      <Smartphone className="w-4 h-4" />
                      <span>Flutter (Dart) • Android Studio & VS Code Ready</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold font-cairo">
                      الكود المصدري الكامل لتطبيق الأندرويد (Flutter & Dart)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                      هذا القسم يحتوي على الكود البرمجي الكامل لمشروع <strong>رفيق الطالب الذكي</strong> بلغة <strong>Dart / Flutter</strong> للأندرويد جاهز للنسخ والتشغيل المباشر في Android Studio.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={handleCopyFlutterCode}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>تم نسخ الكود!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>نسخ هذا الملف</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadFlutterFile(selectedFlutterFile)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل {selectedFlutterFile.fileName}</span>
                    </button>
                  </div>
                </div>

                {/* Code Explorer Layout: File Tree Sidebar + Code Viewer */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* File Selector Sidebar (4 cols) */}
                  <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 px-2 pb-2 border-b border-slate-100 font-cairo">
                      ملفات مشروع الأندرويد (Flutter Files)
                    </h3>
                    <div className="space-y-1.5">
                      {FLUTTER_ANDROID_FILES.map((file) => {
                        const isSelected = selectedFlutterFile.id === file.id;
                        return (
                          <button
                            key={file.id}
                            onClick={() => setSelectedFlutterFile(file)}
                            className={`w-full text-right p-3 rounded-xl transition flex items-start justify-between gap-2 ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-xs"
                                : "hover:bg-slate-100 text-slate-800"
                            }`}
                          >
                            <div>
                              <p className="font-bold text-xs sm:text-sm font-mono-numbers">
                                {file.path}
                              </p>
                              <p
                                className={`text-[11px] mt-0.5 ${
                                  isSelected ? "text-blue-100" : "text-slate-500"
                                }`}
                              >
                                {file.description}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-mono-numbers px-2 py-0.5 rounded uppercase ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {file.language}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Source Code Display Box (8 cols) */}
                  <div className="lg:col-span-8 bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
                    <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-xs font-mono-numbers text-slate-300 mr-2">
                          {selectedFlutterFile.path}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyFlutterCode}
                        className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedCode ? "تم النسخ" : "نسخ الكود"}</span>
                      </button>
                    </div>

                    <pre
                      dir="ltr"
                      className="p-5 text-xs sm:text-sm font-mono-numbers text-slate-100 overflow-x-auto leading-relaxed max-h-[640px]"
                    >
                      <code>{selectedFlutterFile.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Optional Android Navigation Bar when in phone simulator mode */}
          {isAndroidFrame && (
            <div className="bg-slate-900 py-3 px-12 flex items-center justify-around text-white/80">
              <ChevronLeft className="w-5 h-5 cursor-pointer" />
              <div className="w-4 h-4 rounded-full border-2 border-white/80 cursor-pointer" />
              <div className="w-4 h-4 border-2 border-white/80 rounded-xs cursor-pointer" />
            </div>
          )}
        </div>
      </main>

      {/* ============================================================== */}
      {/* MODALS FOR ADDING TASK, SUBJECT, FLASHCARD */}
      {/* ============================================================== */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 font-cairo">
              إضافة واجب / مهمة جديدة
            </h3>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الواجب
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="مثال: حل تمارين الفصل الخامس"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المادة المرتبطة
                </label>
                <select
                  value={newTaskSubjectId}
                  onChange={(e) => setNewTaskSubjectId(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    تاريخ التسليم
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الأولوية
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="عالية">عالية</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="منخفضة">منخفضة</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  حفظ الواجب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 font-cairo">
              إضافة مادة دراسية جديدة
            </h3>
            <form onSubmit={handleAddSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المادة
                </label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="مثال: الذكاء الاصطناعي وتعلم الآلة"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المدرس / الدكتور
                </label>
                <input
                  type="text"
                  value={newSubTeacher}
                  onChange={(e) => setNewSubTeacher(e.target.value)}
                  placeholder="مثال: د. فهد العتيبي"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    مستوى الصعوبة
                  </label>
                  <select
                    value={newSubDifficulty}
                    onChange={(e) => setNewSubDifficulty(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="صعبة">صعبة (+أولوية قصوى)</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="سهلة">سهلة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    لون المادة المميز
                  </label>
                  <input
                    type="color"
                    value={newSubColor}
                    onChange={(e) => setNewSubColor(e.target.value)}
                    className="w-full h-11 p-1 rounded-xl border border-slate-300 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  إضافة المادة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddFlashcardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 font-cairo">
              إنشاء بطاقة مراجعة جديدة (Flashcard)
            </h3>
            <form onSubmit={handleAddFlashcard} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المادة
                </label>
                <select
                  value={newCardSubjectId}
                  onChange={(e) => setNewCardSubjectId(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  السؤال (الوجه الأمامي للبطاقة)
                </label>
                <textarea
                  required
                  rows={2}
                  value={newCardQuestion}
                  onChange={(e) => setNewCardQuestion(e.target.value)}
                  placeholder="اكتب السؤال أو المفهوم العلمي هنا..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الجواب النموذجي (الوجه الخلفي)
                </label>
                <textarea
                  required
                  rows={3}
                  value={newCardAnswer}
                  onChange={(e) => setNewCardAnswer(e.target.value)}
                  placeholder="اكتب الإجابة المختصرة أو القانون هنا..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFlashcardModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold"
                >
                  حفظ البطاقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
