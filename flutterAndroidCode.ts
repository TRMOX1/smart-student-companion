export interface FlutterCodeFile {
  id: string;
  fileName: string;
  path: string;
  description: string;
  language: string;
  code: string;
}

export const FLUTTER_ANDROID_FILES: FlutterCodeFile[] = [
  {
    id: "pubspec",
    fileName: "pubspec.yaml",
    path: "pubspec.yaml",
    description: "ملف إعداد المشروع والمكتبات الأساسية لتطبيق الأندرويد (Flutter & Dart)",
    language: "yaml",
    code: `name: smart_student_companion
description: "تطبيق رفيق الطالب الذكي - Smart Student Companion Android App"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  google_fonts: ^6.1.0
  percent_indicator: ^4.2.3
  fl_chart: ^0.66.2
  sqflite: ^2.3.2
  path: ^1.9.0
  shared_preferences: ^2.2.2
  flutter_local_notifications: ^17.0.0
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`,
  },
  {
    id: "main_dart",
    fileName: "main.dart",
    path: "lib/main.dart",
    description: "نقطة الدخول الرئيسية لتطبيق الأندرويد مع دعم اللغة العربية RTL وشريط التنقل السفلي",
    language: "dart",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'models/student_models.dart';
import 'screens/dashboard_screen.dart';
import 'screens/smart_schedule_screen.dart';
import 'screens/pomodoro_screen.dart';
import 'screens/flashcards_srs_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SmartStudentCompanionApp());
}

class SmartStudentCompanionApp extends StatefulWidget {
  const SmartStudentCompanionApp({super.key});

  @override
  State<SmartStudentCompanionApp> createState() => _SmartStudentCompanionAppState();
}

class _SmartStudentCompanionAppState extends State<SmartStudentCompanionApp> {
  bool isDarkMode = false;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'رفيق الطالب الذكي',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar', 'SA'),
      supportedLocales: const [Locale('ar', 'SA'), Locale('en', 'US')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      themeMode: isDarkMode ? ThemeMode.dark : ThemeMode.light,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB),
          primary: const Color(0xFF2563EB),
          secondary: const Color(0xFF7C3AED),
          surface: const Color(0xFFF8FAFC),
        ),
        textTheme: GoogleFonts.cairoTextTheme(),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      darkTheme: ThemeData.dark(useMaterial3: true).copyWith(
        colorScheme: ColorScheme.fromSeed(
          brightness: Brightness.dark,
          seedColor: const Color(0xFF3B82F6),
          primary: const Color(0xFF3B82F6),
          secondary: const Color(0xFF8B5CF6),
          surface: const Color(0xFF0F172A),
        ),
        textTheme: GoogleFonts.cairoTextTheme(ThemeData.dark().textTheme),
        scaffoldBackgroundColor: const Color(0xFF0B0F19),
      ),
      home: MainAndroidShell(
        isDarkMode: isDarkMode,
        onToggleTheme: () => setState(() => isDarkMode = !isDarkMode),
      ),
    );
  }
}

class MainAndroidShell extends StatefulWidget {
  final bool isDarkMode;
  final VoidCallback onToggleTheme;

  const MainAndroidShell({
    super.key,
    required this.isDarkMode,
    required this.onToggleTheme,
  });

  @override
  State<MainAndroidShell> createState() => _MainAndroidShellState();
}

class _MainAndroidShellState extends State<MainAndroidShell> {
  int _selectedIndex = 0;
  final StudentRepository repository = StudentRepository.seedDefault();

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      DashboardScreen(repository: repository),
      SmartScheduleScreen(repository: repository),
      PomodoroScreen(repository: repository),
      FlashcardsSrsScreen(repository: repository),
    ];

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Theme.of(context).colorScheme.surface,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF2563EB), Color(0xFF7C3AED)],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.school_rounded, color: Colors.white, size: 22),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'رفيق الطالب الذكي',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  'Smart Student Companion',
                  style: TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 6),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.amber.withOpacity(0.15),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Icon(Icons.local_fire_department_rounded, color: Colors.orange, size: 18),
                const SizedBox(width: 4),
                Text(
                  '\${repository.streakDays} يوم',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ],
            ),
          ),
          IconButton(
            icon: Icon(widget.isDarkMode ? Icons.light_mode : Icons.dark_mode),
            onPressed: widget.onToggleTheme,
          ),
        ],
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (idx) => setState(() => _selectedIndex = idx),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard_rounded),
            label: 'الرئيسية',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_month_outlined),
            selectedIcon: Icon(Icons.calendar_month_rounded),
            label: 'الجدول الذكي',
          ),
          NavigationDestination(
            icon: Icon(Icons.timer_outlined),
            selectedIcon: Icon(Icons.timer_rounded),
            label: 'بومودورو',
          ),
          NavigationDestination(
            icon: Icon(Icons.style_outlined),
            selectedIcon: Icon(Icons.style_rounded),
            label: 'البطاقات SRS',
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    id: "student_models",
    fileName: "student_models.dart",
    path: "lib/models/student_models.dart",
    description: "نماذج البيانات وخوارزمية الجدول الذكي (Smart Schedule) وخوارزمية التكرار المتباعد (SRS)",
    language: "dart",
    code: `import 'package:flutter/material.dart';

class SubjectModel {
  final int id;
  final String name;
  final String teacher;
  final Color color;
  final String difficulty; // 'صعبة' | 'متوسطة' | 'سهلة'
  final int weeklyClasses;

  SubjectModel({
    required this.id,
    required this.name,
    required this.teacher,
    required this.color,
    required this.difficulty,
    this.weeklyClasses = 3,
  });
}

class TaskModel {
  final int id;
  final int subjectId;
  final String title;
  final String dueDate;
  final String priority; // 'عالية' | 'متوسطة' | 'منخفضة'
  bool isCompleted;

  TaskModel({
    required this.id,
    required this.subjectId,
    required this.title,
    required this.dueDate,
    required this.priority,
    this.isCompleted = false,
  });
}

class StudySessionModel {
  final String subjectName;
  final String startTime;
  final String endTime;
  final String activityType;
  final int priorityScore;
  final Color color;

  StudySessionModel({
    required this.subjectName,
    required this.startTime,
    required this.endTime,
    required this.activityType,
    required this.priorityScore,
    required this.color,
  });
}

class FlashcardModel {
  final int id;
  final String subjectName;
  final String question;
  final String answer;
  int intervalDays;
  int repetitions;

  FlashcardModel({
    required this.id,
    required this.subjectName,
    required this.question,
    required this.answer,
    this.intervalDays = 1,
    this.repetitions = 0,
  });

  /// خوارزمية التكرار المتباعد Spaced Repetition (SRS Section 19)
  void applyReview(String rating) {
    if (rating == 'easy') {
      repetitions += 1;
      intervalDays = repetitions == 1 ? 3 : repetitions == 2 ? 7 : intervalDays * 2;
    } else if (rating == 'good') {
      repetitions += 1;
      intervalDays = repetitions == 1 ? 2 : intervalDays + 3;
    } else {
      repetitions = 0;
      intervalDays = 1;
    }
  }
}

class StudentRepository {
  int xpPoints = 1480;
  int streakDays = 14;
  List<SubjectModel> subjects = [];
  List<TaskModel> tasks = [];
  List<FlashcardModel> flashcards = [];

  StudentRepository.seedDefault() {
    subjects = [
      SubjectModel(id: 1, name: 'الرياضيات المتقدمة', teacher: 'د. سامي المنصور', color: const Color(0xFF2563EB), difficulty: 'صعبة'),
      SubjectModel(id: 2, name: 'الفيزياء الحديثة', teacher: 'د. ليلى الشمري', color: const Color(0xFF7C3AED), difficulty: 'صعبة'),
      SubjectModel(id: 3, name: 'الكيمياء العضوية', teacher: 'أ. خالد العتيبي', color: const Color(0xFF10B981), difficulty: 'متوسطة'),
      SubjectModel(id: 4, name: 'برمجة تطبيقات Flutter', teacher: 'م. طارق الحربي', color: const Color(0xFF0EA5E9), difficulty: 'سهلة'),
    ];

    tasks = [
      TaskModel(id: 1, subjectId: 1, title: 'حل تمارين التكامل الثنائي (15 مسألة)', dueDate: 'غداً', priority: 'عالية'),
      TaskModel(id: 2, subjectId: 3, title: 'كتابة تقرير معمل الكيمياء العضوية', dueDate: 'اليوم', priority: 'عالية'),
      TaskModel(id: 3, subjectId: 4, title: 'بناء شاشة بطاقات المراجعة بلغة Dart', dueDate: 'بعد 3 أيام', priority: 'متوسطة'),
    ];

    flashcards = [
      FlashcardModel(
        id: 1,
        subjectName: 'الفيزياء الحديثة',
        question: 'ما هو قانون نيوتن الثاني للحركة؟',
        answer: 'القوة المحصلة تساوي الكتلة × التسارع (F = m × a)',
      ),
      FlashcardModel(
        id: 2,
        subjectName: 'الرياضيات المتقدمة',
        question: 'ما هي صيغة التكامل بالأجزاء؟',
        answer: '∫ u dv = u · v - ∫ v du',
      ),
    ];
  }

  /// خوارزمية الجدول الذكي (SRS Section 18)
  List<StudySessionModel> generateSmartSchedule() {
    final List<Map<String, dynamic>> scored = subjects.map((sub) {
      int score = 0;
      if (sub.difficulty == 'صعبة') score += 5;
      if (sub.difficulty == 'متوسطة') score += 3;
      final hasUrgentTask = tasks.any((t) => t.subjectId == sub.id && !t.isCompleted);
      if (hasUrgentTask) score += 4;
      return {'subject': sub, 'score': score};
    }).toList();

    scored.sort((a, b) => (b['score'] as int).compareTo(a['score'] as int));

    final slots = [
      {'start': '16:00', 'end': '17:30', 'type': 'مذاكرة مركزة'},
      {'start': '18:00', 'end': '19:15', 'type': 'حل تمارين وواجبات'},
      {'start': '20:00', 'end': '21:00', 'type': 'مراجعة بطاقات SRS'},
      {'start': '21:30', 'end': '22:30', 'type': 'تلخيص الدرس'},
    ];

    final List<StudySessionModel> result = [];
    for (int i = 0; i < scored.length && i < slots.length; i++) {
      final SubjectModel sub = scored[i]['subject'];
      final int score = scored[i]['score'];
      result.add(
        StudySessionModel(
          subjectName: sub.name,
          startTime: slots[i]['start']!,
          endTime: slots[i]['end']!,
          activityType: slots[i]['type']!,
          priorityScore: score,
          color: sub.color,
        ),
      );
    }
    return result;
  }
}
`,
  },
  {
    id: "dashboard_screen",
    fileName: "dashboard_screen.dart",
    path: "lib/screens/dashboard_screen.dart",
    description: "الشاشة الرئيسية للطالب (Dashboard) تعرض نسبة الإنجاز ومهام اليوم وجلسات الدراسة",
    language: "dart",
    code: `import 'package:flutter/material.dart';
import '../models/student_models.dart';

class DashboardScreen extends StatefulWidget {
  final StudentRepository repository;

  const DashboardScreen({super.key, required this.repository});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  Widget build(BuildContext context) {
    final completedTasks = widget.repository.tasks.where((t) => t.isCompleted).length;
    final totalTasks = widget.repository.tasks.length;
    final progress = totalTasks == 0 ? 0.0 : completedTasks / totalTasks;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // بطاقة الترحيب والإنجاز اليومي
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2563EB), Color(0xFF7C3AED)],
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF2563EB).withOpacity(0.25),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'مرحباً بك يا أحمد 👋',
                        style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'خطوة صغيرة اليوم تصنع تفوقاً كبيراً غداً. استمر في إنجاز مهامك!',
                        style: TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                      const SizedBox(height: 14),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'نقاط الخبرة: \${widget.repository.xpPoints} XP • المستوى 4',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                SizedBox(
                  width: 75,
                  height: 75,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      CircularProgressIndicator(
                        value: progress,
                        strokeWidth: 8,
                        backgroundColor: Colors.white24,
                        valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                      Center(
                        child: Text(
                          '\${(progress * 100).round()}%',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'الواجبات والمهام العاجلة',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ...widget.repository.tasks.map((task) {
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              child: ListTile(
                leading: Checkbox(
                  value: task.isCompleted,
                  activeColor: const Color(0xFF10B981),
                  onChanged: (val) {
                    setState(() {
                      task.isCompleted = val ?? false;
                      if (task.isCompleted) widget.repository.xpPoints += 15;
                    });
                  },
                ),
                title: Text(
                  task.title,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                  ),
                ),
                subtitle: Text('موعد التسليم: \${task.dueDate} • الأولوية: \${task.priority}'),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: task.priority == 'عالية' ? Colors.red.shade50 : Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    task.priority,
                    style: TextStyle(
                      color: task.priority == 'عالية' ? Colors.red : Colors.blue,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
`,
  },
  {
    id: "smart_schedule_screen",
    fileName: "smart_schedule_screen.dart",
    path: "lib/screens/smart_schedule_screen.dart",
    description: "شاشة جدول المذاكرة الذكي مع حساب نقاط الأولوية تلقائياً لكل مادة",
    language: "dart",
    code: `import 'package:flutter/material.dart';
import '../models/student_models.dart';

class SmartScheduleScreen extends StatefulWidget {
  final StudentRepository repository;

  const SmartScheduleScreen({super.key, required this.repository});

  @override
  State<SmartScheduleScreen> createState() => _SmartScheduleScreenState();
}

class _SmartScheduleScreenState extends State<SmartScheduleScreen> {
  late List<StudySessionModel> sessions;

  @override
  void initState() {
    super.initState();
    sessions = widget.repository.generateSmartSchedule();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('جدول المذاكرة الذكي', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  Text('مرتب تلقائياً حسب صعوبة المادة وقرب الاختبارات', style: TextStyle(color: Colors.grey, fontSize: 12)),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () {
                  setState(() {
                    sessions = widget.repository.generateSmartSchedule();
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('تم إعادة توليد الجدول الذكي بنجاح!')),
                  );
                },
                icon: const Icon(Icons.auto_awesome_rounded, size: 18),
                label: const Text('توليد ذكي'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: sessions.length,
              itemBuilder: (context, index) {
                final session = sessions[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border(right: BorderSide(color: session.color, width: 5)),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(session.subjectName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          const SizedBox(height: 4),
                          Text(session.activityType, style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('\${session.startTime} - \${session.endTime}', style: const TextStyle(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: session.color.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              'أولوية: \${session.priorityScore} نقاط',
                              style: TextStyle(color: session.color, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    id: "pomodoro_screen",
    fileName: "pomodoro_screen.dart",
    path: "lib/screens/pomodoro_screen.dart",
    description: "مؤقت التركيز بومودورو (25 دقيقة دراسة / 5 دقائق راحة) مع احتساب الجلسات",
    language: "dart",
    code: `import 'dart:async';
import 'package:flutter/material.dart';
import '../models/student_models.dart';

class PomodoroScreen extends StatefulWidget {
  final StudentRepository repository;

  const PomodoroScreen({super.key, required this.repository});

  @override
  State<PomodoroScreen> createState() => _PomodoroScreenState();
}

class _PomodoroScreenState extends State<PomodoroScreen> {
  int remainingSeconds = 25 * 60;
  bool isRunning = false;
  Timer? _timer;
  int completedSessions = 3;

  void _toggleTimer() {
    if (isRunning) {
      _timer?.cancel();
      setState(() => isRunning = false);
    } else {
      setState(() => isRunning = true);
      _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (remainingSeconds > 0) {
          setState(() => remainingSeconds--);
        } else {
          _timer?.cancel();
          setState(() {
            isRunning = false;
            completedSessions++;
            widget.repository.xpPoints += 25;
            remainingSeconds = 25 * 60;
          });
        }
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final minutes = (remainingSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (remainingSeconds % 60).toString().padLeft(2, '0');

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('وضع التركيز بومودورو', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('الجلسات المكتملة اليوم: \$completedSessions جلسات 🔥', style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 32),
          Container(
            width: 220,
            height: 220,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF2563EB), width: 10),
            ),
            child: Center(
              child: Text(
                '\$minutes:\$seconds',
                style: const TextStyle(fontSize: 44, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                onPressed: _toggleTimer,
                icon: Icon(isRunning ? Icons.pause : Icons.play_arrow),
                label: Text(isRunning ? 'إيقاف مؤقت' : 'ابدأ التركيز'),
              ),
              const SizedBox(width: 12),
              OutlinedButton(
                onPressed: () {
                  _timer?.cancel();
                  setState(() {
                    isRunning = false;
                    remainingSeconds = 25 * 60;
                  });
                },
                child: const Text('إعادة ضبط'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    id: "flashcards_srs_screen",
    fileName: "flashcards_srs_screen.dart",
    path: "lib/screens/flashcards_srs_screen.dart",
    description: "شاشة بطاقات المراجعة Flashcards بنظام التكرار المتباعد Spaced Repetition",
    language: "dart",
    code: `import 'package:flutter/material.dart';
import '../models/student_models.dart';

class FlashcardsSrsScreen extends StatefulWidget {
  final StudentRepository repository;

  const FlashcardsSrsScreen({super.key, required this.repository});

  @override
  State<FlashcardsSrsScreen> createState() => _FlashcardsSrsScreenState();
}

class _FlashcardsSrsScreenState extends State<FlashcardsSrsScreen> {
  int currentIndex = 0;
  bool showAnswer = false;

  @override
  Widget build(BuildContext context) {
    final cards = widget.repository.flashcards;
    if (cards.isEmpty) {
      return const Center(child: Text('لا توجد بطاقات مراجعة حالياً'));
    }

    final card = cards[currentIndex % cards.length];

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'مراجعة بطاقات \${card.subjectName}',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          GestureDetector(
            onTap: () => setState(() => showAnswer = !showAnswer),
            child: Container(
              width: double.infinity,
              height: 240,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: showAnswer ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 16),
                ],
              ),
              child: Center(
                child: Text(
                  showAnswer ? card.answer : card.question,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: showAnswer ? Colors.white : Colors.black87,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text('اضغط على البطاقة لقلب السؤال والجواب', style: TextStyle(color: Colors.grey, fontSize: 12)),
          const SizedBox(height: 24),
          if (showAnswer)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade600, foregroundColor: Colors.white),
                  onPressed: () {
                    card.applyReview('hard');
                    setState(() {
                      showAnswer = false;
                      currentIndex++;
                    });
                  },
                  child: const Text('أحتاج مراجعة (غداً)'),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade600, foregroundColor: Colors.white),
                  onPressed: () {
                    card.applyReview('easy');
                    setState(() {
                      showAnswer = false;
                      currentIndex++;
                    });
                  },
                  child: Text('أتقنتها (\${card.intervalDays + 2} أيام)'),
                ),
              ],
            ),
        ],
      ),
    );
  }
}
`,
  },
  {
    id: "android_manifest",
    fileName: "AndroidManifest.xml",
    path: "android/app/src/main/AndroidManifest.xml",
    description: "إعدادات نظام الأندرويد وصلاحيات الإشعارات والمنبهات الدقيقة لتطبيق رفيق الطالب الذكي",
    language: "xml",
    code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.smartcompanion.student">

    <!-- صلاحيات الإشعارات والتنبيهات الدقيقة للأندرويد -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>

    <application
        android:label="رفيق الطالب الذكي"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`,
  },
];
