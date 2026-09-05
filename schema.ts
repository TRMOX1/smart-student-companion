import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const studentProfile = pgTable("student_profile", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull().default("أحمد محمد العلمي"),
  email: text("email").notNull().default("ahmed.student@edu.sa"),
  educationLevel: text("education_level").notNull().default("المرحلة الجامعية"),
  gradeOrMajor: text("grade_or_major").notNull().default("هندسة البرمجيات - السنة الثالثة"),
  dailyStudyGoalHours: integer("daily_study_goal_hours").notNull().default(4),
  xpPoints: integer("xp_points").notNull().default(1450),
  level: integer("level").notNull().default(4),
  streakDays: integer("streak_days").notNull().default(12),
  studyGoalType: text("study_goal_type").notNull().default("التفوق ورفع المعدل"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  teacherName: text("teacher_name").notNull(),
  color: text("color").notNull().default("#2563EB"),
  difficultyLevel: text("difficulty_level").notNull().default("متوسطة"), // 'سهلة' | 'متوسطة' | 'صعبة'
  weeklyClasses: integer("weekly_classes").notNull().default(3),
  targetGrade: text("target_grade").notNull().default("A+"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  title: text("title").notNull(),
  description: text("description").default(""),
  dueDate: text("due_date").notNull(), // YYYY-MM-DD
  priority: text("priority").notNull().default("متوسطة"), // 'عالية' | 'متوسطة' | 'منخفضة'
  status: text("status").notNull().default("لم يبدأ"), // 'لم يبدأ' | 'قيد العمل' | 'مكتمل' | 'متأخر'
  steps: jsonb("steps").$type<{ text: string; done: boolean }[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  title: text("title").notNull(),
  studyDate: text("study_date").notNull(), // YYYY-MM-DD
  startTime: text("start_time").notNull(), // e.g. "16:00"
  endTime: text("end_time").notNull(),     // e.g. "17:30"
  sessionType: text("session_type").notNull().default("مذاكرة"), // 'مذاكرة' | 'مراجعة' | 'حل أسئلة' | 'تلخيص' | 'اختبار ذاتي'
  status: text("status").notNull().default("لم تبدأ"), // 'لم تبدأ' | 'قيد التنفيذ' | 'مكتملة' | 'مؤجلة'
  priorityScore: integer("priority_score").notNull().default(5),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  title: text("title").notNull(),
  examDate: text("exam_date").notNull(), // YYYY-MM-DD
  examTime: text("exam_time").notNull().default("09:00 صباحاً"),
  location: text("location").notNull().default("قاعة الاختبارات الرئيسية B2"),
  examType: text("exam_type").notNull().default("نهائي"), // 'قصير' | 'شهري' | 'نهائي' | 'عملي'
  importanceLevel: text("importance_level").notNull().default("عالية"),
  topics: jsonb("topics").$type<{ title: string; completed: boolean }[]>().default([]),
  readinessPercent: integer("readiness_percent").notNull().default(65),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: text("difficulty").notNull().default("متوسطة"), // 'سهلة' | 'متوسطة' | 'صعبة'
  intervalDays: integer("interval_days").notNull().default(1),
  repetitions: integer("repetitions").notNull().default(0),
  nextReviewDate: text("next_review_date").notNull(), // YYYY-MM-DD
  correctCount: integer("correct_count").notNull().default(0),
  wrongCount: integer("wrong_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  title: text("title").notNull(),
  difficulty: text("difficulty").notNull().default("متوسطة"),
  questions: jsonb("questions")
    .$type<
      {
        id: number;
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
      }[]
    >()
    .notNull(),
  lastScore: integer("last_score").default(0),
  totalQuestions: integer("total_questions").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow(),
});
