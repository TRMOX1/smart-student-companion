import { NextResponse } from "next/server";
import {
  db,
  studentProfile,
  subjects,
  tasks,
  studySessions,
  exams,
  flashcards,
  notes,
  quizzes,
} from "@/db";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    let profiles = await db.select().from(studentProfile);

    // Auto-seed rich initial Arabic data if DB is empty
    if (profiles.length === 0) {
      await db.insert(studentProfile).values({
        fullName: "أحمد محمد العلمي",
        email: "ahmed.student@edu.sa",
        educationLevel: "المرحلة الجامعية",
        gradeOrMajor: "هندسة البرمجيات - السنة الثالثة",
        dailyStudyGoalHours: 4,
        xpPoints: 1480,
        level: 4,
        streakDays: 14,
        studyGoalType: "التفوق ورفع المعدل",
      });

      const insertedSubjects = await db
        .insert(subjects)
        .values([
          {
            name: "الرياضيات المتقدمة",
            teacherName: "د. سامي المنصور",
            color: "#2563EB",
            difficultyLevel: "صعبة",
            weeklyClasses: 4,
            targetGrade: "A+",
            notes: "التركيز على التكامل والمعادلات التفاضلية",
          },
          {
            name: "الفيزياء الحديثة",
            teacherName: "د. ليلى الشمري",
            color: "#7C3AED",
            difficultyLevel: "صعبة",
            weeklyClasses: 3,
            targetGrade: "A",
            notes: "مراجعة قوانين الكهرومغناطيسية والميكانيكا الكمية",
          },
          {
            name: "الكيمياء العضوية",
            teacherName: "أ. خالد العتيبي",
            color: "#10B981",
            difficultyLevel: "متوسطة",
            weeklyClasses: 3,
            targetGrade: "A+",
            notes: "حفظ التفاعلات والمركبات الهيدروكربونية",
          },
          {
            name: "البرمجة وتطوير التطبيقات (Flutter)",
            teacherName: "م. طارق الحربي",
            color: "#0EA5E9",
            difficultyLevel: "سهلة",
            weeklyClasses: 4,
            targetGrade: "A+",
            notes: "تطبيقات الموبايل بلغة Dart وإدارة الحالة",
          },
          {
            name: "قواعد البيانات المتقدمة",
            teacherName: "د. نورة السديري",
            color: "#F59E0B",
            difficultyLevel: "متوسطة",
            weeklyClasses: 3,
            targetGrade: "A+",
            notes: "تصميم الجداول، العلاقات SQL، وتحسين الاستعلامات",
          },
        ])
        .returning();

      const mathId = insertedSubjects[0]?.id ?? 1;
      const physicsId = insertedSubjects[1]?.id ?? 2;
      const chemId = insertedSubjects[2]?.id ?? 3;
      const flutterId = insertedSubjects[3]?.id ?? 4;
      const dbId = insertedSubjects[4]?.id ?? 5;

      const todayStr = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
      const inThreeDays = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
      const inFiveDays = new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0];

      await db.insert(tasks).values([
        {
          subjectId: mathId,
          title: "حل مجموعة تمارين التكامل الثنائي (الفصل 4)",
          description: "حل 15 مسألة من الكتاب الجامعي مع كتابة خطوات الحل بالتفصيل",
          dueDate: tomorrow,
          priority: "عالية",
          status: "قيد العمل",
          steps: [
            { text: "مراجعة قوانين التكامل بالتعويض", done: true },
            { text: "حل المسائل الفردية (1-9)", done: true },
            { text: "حل المسائل التطبيقية (10-15)", done: false },
          ],
        },
        {
          subjectId: chemId,
          title: "تسليم تقرير معمل الكيمياء العضوية",
          description: "كتابة نتائج تجربة تحضير الإستر وتحليل نسبة الناتج",
          dueDate: todayStr,
          priority: "عالية",
          status: "لم يبدأ",
          steps: [
            { text: "رسم جدول القراءات المعملية", done: true },
            { text: "كتابة المعادلات الكيميائية", done: false },
          ],
        },
        {
          subjectId: flutterId,
          title: "بناء شاشة بطاقات المراجعة بلغة Dart",
          description: "تنفيذ حركة الدوران ثلاثي الأبعاد (3D Flip) في تطبيق Flutter",
          dueDate: inThreeDays,
          priority: "متوسطة",
          status: "قيد العمل",
          steps: [
            { text: "تصميم واجهة البطاقة الأمامية والخلفية", done: true },
            { text: "إضافة AnimationController للدوران", done: false },
          ],
        },
        {
          subjectId: dbId,
          title: "تصميم مخطط ERD لنظام رفيق الطالب الذكي",
          description: "تحديد الجداول والعلاقات والمفاتيح الأساسية والأجنبية",
          dueDate: inFiveDays,
          priority: "منخفضة",
          status: "مكتمل",
          steps: [
            { text: "تحديد جدول المستخدمين والمواد", done: true },
            { text: "ربط جدول المهام والبطاقات", done: true },
          ],
        },
      ]);

      await db.insert(studySessions).values([
        {
          subjectId: mathId,
          title: "مذاكرة مكثفة: المعادلات التفاضلية والتكامل",
          studyDate: todayStr,
          startTime: "16:00",
          endTime: "17:30",
          sessionType: "مذاكرة",
          status: "مكتملة",
          priorityScore: 14,
          notes: "أولوية قصوى بسبب قرب الاختبار وصعوبة المادة",
        },
        {
          subjectId: chemId,
          title: "إنهاء واجب تفاعلات الكيمياء العضوية",
          studyDate: todayStr,
          startTime: "18:00",
          endTime: "19:00",
          sessionType: "حل أسئلة",
          status: "قيد التنفيذ",
          priorityScore: 11,
          notes: "تسليم الواجب غداً",
        },
        {
          subjectId: physicsId,
          title: "مراجعة بطاقات قوانين نيوتن والحث الكهرومغناطيسي",
          studyDate: todayStr,
          startTime: "20:00",
          endTime: "21:00",
          sessionType: "مراجعة",
          status: "لم تبدأ",
          priorityScore: 9,
          notes: "تحضير للاختبار الشهري القادم",
        },
        {
          subjectId: flutterId,
          title: "تطبيق عملي: برمجة واجهة الأندرويد بلغة Flutter",
          studyDate: todayStr,
          startTime: "21:30",
          endTime: "22:30",
          sessionType: "تلخيص",
          status: "لم تبدأ",
          priorityScore: 6,
          notes: "مراجعة Widgets وتنظيم الكود",
        },
      ]);

      await db.insert(exams).values([
        {
          subjectId: mathId,
          title: "الاختبار النصفي لمادة الرياضيات المتقدمة",
          examDate: inThreeDays,
          examTime: "09:00 صباحاً",
          location: "القاعة الكبرى 104 - مبنى العلوم",
          examType: "شهري",
          importanceLevel: "عالية",
          topics: [
            { title: "التكامل المحدود وغير المحدود", completed: true },
            { title: "التكامل بالأجزاء والكسور الجزئية", completed: true },
            { title: "المعادلات التفاضلية من الدرجة الأولى", completed: false },
            { title: "تطبيقات التكامل في المساحات والحجوم", completed: false },
          ],
          readinessPercent: 72,
        },
        {
          subjectId: physicsId,
          title: "اختبار الفيزياء الحديثة - الفصل الثالث",
          examDate: inFiveDays,
          examTime: "11:30 صباحاً",
          location: "مدرج الفيزياء B1",
          examType: "نهائي",
          importanceLevel: "عالية",
          topics: [
            { title: "قانون فاراداي للحث الكهرومغناطيسي", completed: true },
            { title: "الظاهرة الكهروضوئية ومعادلة أينشتاين", completed: false },
            { title: "ميكانيكا الكم ونموذج بور الذري", completed: false },
          ],
          readinessPercent: 55,
        },
      ]);

      await db.insert(flashcards).values([
        {
          subjectId: physicsId,
          question: "ما هو قانون نيوتن الثاني للحركة والصيغة الرياضية له؟",
          answer: "القوة المحصلة المؤثرة على جسم تساوي حاصل ضرب كتلته في تسارعه: F = m × a",
          difficulty: "سهلة",
          intervalDays: 3,
          repetitions: 2,
          nextReviewDate: todayStr,
          correctCount: 5,
          wrongCount: 1,
        },
        {
          subjectId: mathId,
          question: "ما هي قاعدة التكامل بالأجزاء (Integration by Parts)؟",
          answer: "∫ u dv = u · v - ∫ v du حيث يتم اختيار u حسب قاعدة LIATE",
          difficulty: "صعبة",
          intervalDays: 1,
          repetitions: 1,
          nextReviewDate: todayStr,
          correctCount: 2,
          wrongCount: 2,
        },
        {
          subjectId: flutterId,
          question: "ما الفرق بين StatelessWidget و StatefulWidget في Flutter؟",
          answer: "StatelessWidget ثابت لا يتغير محتواه بعد بنائه، بينما StatefulWidget يحتفظ بحالة (State) يمكن تحديثها عبر setState() لإعادة بناء الواجهة.",
          difficulty: "متوسطة",
          intervalDays: 2,
          repetitions: 3,
          nextReviewDate: todayStr,
          correctCount: 7,
          wrongCount: 0,
        },
        {
          subjectId: dbId,
          question: "ما هو المفتاح الأجنبي (Foreign Key) في قواعد البيانات العلائقية؟",
          answer: "هو عمود أو مجموعة أعمدة في جدول يشير إلى المفتاح الأساسي (Primary Key) في جدول آخر لضمان التكامل المرجعي للعلاقات.",
          difficulty: "سهلة",
          intervalDays: 5,
          repetitions: 4,
          nextReviewDate: todayStr,
          correctCount: 8,
          wrongCount: 0,
        },
      ]);

      await db.insert(notes).values([
        {
          subjectId: mathId,
          title: "ملخص ذهبي: طرق التكامل السريعة واختيار طريقة الحل",
          content:
            "1. إذا كان البسط مشتقة المقام: الناتج هو ln|المقام| + C.\n2. عند ضرب دالة كثيرة حدود في دالة أسية أو مثلثية: نستخدم التكامل بالأجزاء الجدولي.\n3. الكسور الجبرية: نتأكد أولاً أن درجة البسط أقل من المقام ثم نحلل المقام إلى عوامل.",
          tags: ["تكامل", "قوانين", "مراجعة_سريعة"],
        },
        {
          subjectId: flutterId,
          title: "هيكلية مشروع Flutter للأندرويد (Clean Architecture)",
          content:
            "يتكون تطبيق رفيق الطالب الذكي في Flutter من:\n- مجلد models/: يحتوي على نماذج البيانات (Task, Subject, Flashcard).\n- مجلد screens/: الشاشات الرئيسية (Dashboard, SmartPlanner, Pomodoro, Flashcards).\n- مجلد services/: خوارزمية الجدول الذكي والتكرار المتباعد SRS.",
          tags: ["Flutter", "Dart", "Android"],
        },
      ]);

      await db.insert(quizzes).values([
        {
          subjectId: mathId,
          title: "اختبار تدريبي سريع: التفاضل والتكامل المتقدم",
          difficulty: "متوسطة",
          lastScore: 80,
          totalQuestions: 4,
          questions: [
            {
              id: 1,
              question: "ما هو ناتج تكامل الدالة ∫ 2x dx ؟",
              options: ["x² + C", "2x² + C", "2 + C", "x + C"],
              correctIndex: 0,
              explanation: "بزيادة الأس واحد والقسمة على الأس الجديد: (2x²)/2 = x² + C",
            },
            {
              id: 2,
              question: "إذا كانت مشتقة الدالة f'(x) = 0 عند نقطة، تسمى هذه النقطة:",
              options: ["نقطة حرجة (Critical Point)", "نقطة انعدام", "نقطة تكاملية", "نهاية عظمى مطلقة دائماً"],
              correctIndex: 0,
              explanation: "النقاط التي تنعدم عندها المشتقة الأولى أو تكون غير معرفة تسمى نقاطاً حرجة.",
            },
            {
              id: 3,
              question: "أي من القواعد التالية يستخدم لتكامل حاصل ضرب دالتين مختلفتين؟",
              options: ["التكامل بالأجزاء ∫ u dv", "قاعدة لوبيتال", "قاعدة السلسلة", "التفاضل الضمني"],
              correctIndex: 0,
              explanation: "التكامل بالأجزاء هو القاعدة الأساسية لتكامل جداء دالتين.",
            },
            {
              id: 4,
              question: "مشتقة الدالة الأسية الطبيعية e^x بالنسبة لـ x هي:",
              options: ["e^x", "x e^(x-1)", "ln(x)", "1/x"],
              correctIndex: 0,
              explanation: "الدالة الأسية الطبيعية e^x هي الدالة الوحيدة التي تساوي مشتقتها نفسها.",
            },
          ],
        },
      ]);

      profiles = await db.select().from(studentProfile);
    }

    const allSubjects = await db.select().from(subjects);
    const allTasks = await db.select().from(tasks);
    const allSessions = await db.select().from(studySessions);
    const allExams = await db.select().from(exams);
    const allFlashcards = await db.select().from(flashcards);
    const allNotes = await db.select().from(notes);
    const allQuizzes = await db.select().from(quizzes);

    return NextResponse.json({
      profile: profiles[0],
      subjects: allSubjects,
      tasks: allTasks,
      studySessions: allSessions,
      exams: allExams,
      flashcards: allFlashcards,
      notes: allNotes,
      quizzes: allQuizzes,
    });
  } catch (error) {
    console.error("Failed to fetch companion state:", error);
    return NextResponse.json({ error: "فشل في تحميل بيانات التطبيق" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (action === "ADD_SUBJECT") {
      const [newSubject] = await db
        .insert(subjects)
        .values({
          name: payload.name,
          teacherName: payload.teacherName || "أستاذ المادة",
          color: payload.color || "#2563EB",
          difficultyLevel: payload.difficultyLevel || "متوسطة",
          weeklyClasses: Number(payload.weeklyClasses) || 3,
          targetGrade: payload.targetGrade || "A+",
          notes: payload.notes || "",
        })
        .returning();
      return NextResponse.json({ subject: newSubject });
    }

    if (action === "ADD_TASK") {
      const [newTask] = await db
        .insert(tasks)
        .values({
          subjectId: Number(payload.subjectId),
          title: payload.title,
          description: payload.description || "",
          dueDate: payload.dueDate,
          priority: payload.priority || "متوسطة",
          status: "لم يبدأ",
          steps: payload.steps || [],
        })
        .returning();
      return NextResponse.json({ task: newTask });
    }

    if (action === "TOGGLE_TASK_STATUS") {
      const { id, newStatus } = payload;
      await db.update(tasks).set({ status: newStatus }).where(eq(tasks.id, Number(id)));

      // Award +15 XP if completed
      if (newStatus === "مكتمل") {
        const profiles = await db.select().from(studentProfile);
        if (profiles[0]) {
          const updatedXp = profiles[0].xpPoints + 15;
          const updatedLevel = Math.floor(updatedXp / 350) + 1;
          await db
            .update(studentProfile)
            .set({ xpPoints: updatedXp, level: updatedLevel })
            .where(eq(studentProfile.id, profiles[0].id));
        }
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "GENERATE_SMART_SCHEDULE") {
      // Implement SRS Section 18 Smart Study Schedule Algorithm
      const allSubjects = await db.select().from(subjects);
      const allExams = await db.select().from(exams);
      const allTasks = await db.select().from(tasks);
      const todayStr = new Date().toISOString().split("T")[0];

      // Clear today's uncompleted auto sessions and regenerate with priority scoring
      const scoredSubjects = allSubjects.map((sub) => {
        let score = 0;
        // Difficulty weight
        if (sub.difficultyLevel === "صعبة") score += 4;
        else if (sub.difficultyLevel === "متوسطة") score += 2;
        else score += 1;

        // Upcoming Exam weight
        const hasExamSoon = allExams.some((e) => e.subjectId === sub.id);
        if (hasExamSoon) score += 5;

        // Pending Task weight
        const hasUrgentTask = allTasks.some(
          (t) => t.subjectId === sub.id && t.status !== "مكتمل"
        );
        if (hasUrgentTask) score += 4;

        return { subject: sub, score };
      });

      scoredSubjects.sort((a, b) => b.score - a.score);

      const slots = [
        { startTime: "16:00", endTime: "17:30", type: "مذاكرة" },
        { startTime: "18:00", endTime: "19:15", type: "حل أسئلة" },
        { startTime: "20:00", endTime: "21:00", type: "مراجعة" },
        { startTime: "21:30", endTime: "22:30", type: "تلخيص" },
      ];

      const generated = [];
      for (let i = 0; i < Math.min(slots.length, scoredSubjects.length); i++) {
        const item = scoredSubjects[i];
        const slot = slots[i];
        const [inserted] = await db
          .insert(studySessions)
          .values({
            subjectId: item.subject.id,
            title: `${slot.type} ذكية: ${item.subject.name}`,
            studyDate: todayStr,
            startTime: slot.startTime,
            endTime: slot.endTime,
            sessionType: slot.type,
            status: "لم تبدأ",
            priorityScore: item.score,
            notes: `تم توليدها بواسطة خوارزمية الأولويات (نقاط الأولوية: ${item.score})`,
          })
          .returning();
        generated.push(inserted);
      }

      return NextResponse.json({ generated });
    }

    if (action === "REVIEW_FLASHCARD") {
      // Spaced Repetition SRS Algorithm (Section 19)
      const { id, rating } = payload; // rating: 'easy' | 'good' | 'hard'
      const existing = await db
        .select()
        .from(flashcards)
        .where(eq(flashcards.id, Number(id)));

      if (existing[0]) {
        const card = existing[0];
        let nextInterval = card.intervalDays;
        let reps = card.repetitions;
        let correct = card.correctCount;
        let wrong = card.wrongCount;

        if (rating === "easy") {
          reps += 1;
          nextInterval = reps === 1 ? 3 : reps === 2 ? 7 : nextInterval * 2;
          correct += 1;
        } else if (rating === "good") {
          reps += 1;
          nextInterval = reps === 1 ? 2 : nextInterval + 3;
          correct += 1;
        } else {
          reps = 0;
          nextInterval = 1;
          wrong += 1;
        }

        const nextDate = new Date(Date.now() + nextInterval * 86400000)
          .toISOString()
          .split("T")[0];

        await db
          .update(flashcards)
          .set({
            intervalDays: nextInterval,
            repetitions: reps,
            nextReviewDate: nextDate,
            correctCount: correct,
            wrongCount: wrong,
          })
          .where(eq(flashcards.id, card.id));

        // Award XP
        const profiles = await db.select().from(studentProfile);
        if (profiles[0]) {
          const updatedXp = profiles[0].xpPoints + 10;
          await db
            .update(studentProfile)
            .set({ xpPoints: updatedXp })
            .where(eq(studentProfile.id, profiles[0].id));
        }
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "ADD_FLASHCARD") {
      const todayStr = new Date().toISOString().split("T")[0];
      const [card] = await db
        .insert(flashcards)
        .values({
          subjectId: Number(payload.subjectId),
          question: payload.question,
          answer: payload.answer,
          difficulty: payload.difficulty || "متوسطة",
          intervalDays: 1,
          repetitions: 0,
          nextReviewDate: todayStr,
          correctCount: 0,
          wrongCount: 0,
        })
        .returning();
      return NextResponse.json({ card });
    }

    if (action === "ADD_NOTE") {
      const [newNote] = await db
        .insert(notes)
        .values({
          subjectId: Number(payload.subjectId),
          title: payload.title,
          content: payload.content,
          tags: payload.tags || ["ملخص"],
        })
        .returning();
      return NextResponse.json({ note: newNote });
    }

    if (action === "AWARD_XP") {
      const { amount } = payload;
      const profiles = await db.select().from(studentProfile);
      if (profiles[0]) {
        const newXp = profiles[0].xpPoints + Number(amount);
        const newLevel = Math.floor(newXp / 350) + 1;
        await db
          .update(studentProfile)
          .set({ xpPoints: newXp, level: newLevel })
          .where(eq(studentProfile.id, profiles[0].id));
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("API POST error:", error);
    return NextResponse.json({ error: "خطأ في تنفيذ العملية" }, { status: 500 });
  }
}
