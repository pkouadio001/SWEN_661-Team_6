import 'package:go_router/go_router.dart';

import '../screens/auth/auth_screen.dart';
import '../screens/shell/app_shell.dart';

// Dashboards
import '../screens/dashboard/dashboard_screen.dart';
import '../screens/dashboard/patient_dashboard_screen.dart';

// Tasks
import '../screens/tasks/tasks_hub_screen.dart';
import '../screens/tasks/todays_tasks_screen.dart';
import '../screens/tasks/upcoming_appointments_screen.dart';

// Health
import '../screens/health/health_hub_screen.dart';
import '../screens/health/health_logs_screen.dart';
import '../screens/health/personal_notes_screen.dart';
import '../screens/health/history_screen.dart';

// Communication
import '../screens/communication/communication_safety_screen.dart';
import '../screens/communication/messages_screen.dart';

// Notifications
import '../screens/notifications/notifications_reminders_screen.dart';

// Patient
import '../screens/patient/patient_info_screen.dart';
import '../screens/patient/patient_edit_screen.dart';

// Profile
import '../screens/profile/profile_settings_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/auth',
  routes: [
    // ---------- AUTH (outside bottom-nav shell) ----------
    GoRoute(path: '/auth', builder: (_, __) => const AuthScreen()),

    // ---------- MAIN APP (with bottom navigation shell) ----------
    ShellRoute(
      builder: (_, __, child) => AppShell(child: child),
      routes: [
        // Home dashboards
        GoRoute(path: '/home', builder: (_, __) => const DashboardScreen()),

        GoRoute(
          path: '/patient-home',
          builder: (_, __) => const PatientDashboardScreen(),
        ),

        // Tasks
        GoRoute(
          path: '/tasks',
          builder: (_, __) => const TasksHubScreen(),
          routes: [
            GoRoute(
              path: 'today',
              builder: (_, __) => const TodaysTasksScreen(),
            ),
            GoRoute(
              path: 'appointments',
              builder: (_, __) => const UpcomingAppointmentsScreen(),
            ),
          ],
        ),

        // Health
        GoRoute(
          path: '/health',
          builder: (_, __) => const HealthHubScreen(),
          routes: [
            GoRoute(path: 'logs', builder: (_, __) => const HealthLogsScreen()),
            GoRoute(
              path: 'notes',
              builder: (_, __) => const PersonalNotesScreen(),
            ),
            GoRoute(path: 'history', builder: (_, __) => const HistoryScreen()),
          ],
        ),

        // Communication
        GoRoute(
          path: '/comm',
          builder: (_, __) => const CommunicationSafetyScreen(),
          routes: [
            GoRoute(
              path: 'messages',
              builder: (_, __) => const MessagesScreen(),
            ),
          ],
        ),

        // Alerts / Notifications
        GoRoute(
          path: '/alerts',
          builder: (_, __) => const NotificationsRemindersScreen(),
        ),

        // Patient info
        GoRoute(
          path: '/patient',
          builder: (_, __) => const PatientInfoScreen(),
          routes: [
            GoRoute(
              path: 'edit',
              builder: (_, __) => const PatientEditScreen(),
            ),
          ],
        ),

        // Profile
        GoRoute(
          path: '/profile-settings',
          builder: (_, __) => const ProfileSettingsScreen(),
        ),
      ],
    ),
  ],
);
