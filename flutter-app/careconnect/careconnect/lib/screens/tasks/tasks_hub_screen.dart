import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/app_card.dart';

class TasksHubScreen extends StatelessWidget {
  const TasksHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: Semantics(
          button: true,
          label: 'Back',
          child: IconButton(
            onPressed: () => context.go('/home'),
            icon: const Icon(Icons.arrow_back),
          ),
        ),
        title: const Text('Tasks & Scheduling'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Manage your daily routine',
              style: TextStyle(color: Color(0xFF6B7A90)),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 18),
        child: Column(
          children: [
            _BackPill(
              text: 'Back to Dashboard',
              onTap: () => context.go('/home'),
            ),
            const SizedBox(height: 14),

            _BigNavCard(
              icon: Icons.today_outlined,
              iconBg: const [Color(0xFF0E67FF), Color(0xFF10C7A5)],
              title: "Today's Tasks",
              subtitle: 'Your daily care routine',
              linkText: '3 tasks pending  •  1 completed',
              onTap: () => context.go('/tasks/today'),
            ),
            const SizedBox(height: 14),
            _BigNavCard(
              icon: Icons.calendar_month_outlined,
              iconBg: const [Color(0xFF0E67FF), Color(0xFF10C7A5)],
              title: 'Upcoming Appointments',
              subtitle: 'Your scheduled visits',
              linkText: '5 appointments scheduled',
              onTap: () => context.go('/tasks/appointments'),
            ),
          ],
        ),
      ),
    );
  }
}

class _BackPill extends StatelessWidget {
  final String text;
  final VoidCallback onTap;
  const _BackPill({required this.text, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: text,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE6EDF7)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.08),
                blurRadius: 18,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.arrow_back),
              SizedBox(width: 10),
              Text('Back to Dashboard'),
            ],
          ),
        ),
      ),
    );
  }
}

class _BigNavCard extends StatelessWidget {
  final IconData icon;
  final List<Color> iconBg;
  final String title;
  final String subtitle;
  final String linkText;
  final VoidCallback onTap;

  const _BigNavCard({
    required this.icon,
    required this.iconBg,
    required this.title,
    required this.subtitle,
    required this.linkText,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: title,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: AppCard(
          child: Row(
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: LinearGradient(colors: iconBg),
                ),
                child: Icon(icon, color: Colors.white),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(color: Color(0xFF6B7A90)),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      linkText,
                      style: const TextStyle(
                        color: Color(0xFF0E67FF),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
