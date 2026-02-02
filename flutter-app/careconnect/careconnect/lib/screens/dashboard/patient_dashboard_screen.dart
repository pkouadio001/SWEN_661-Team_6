import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/app_card.dart';

class PatientDashboardScreen extends StatelessWidget {
  const PatientDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Patient Dashboard')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'Quick actions for patients',
                    style: TextStyle(color: Color(0xFF6B7A90)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            _Tile(
              'Today’s Tasks',
              Icons.checklist_outlined,
              () => context.go('/tasks/today'),
            ),
            const SizedBox(height: 12),
            _Tile(
              'Messages',
              Icons.chat_bubble_outline,
              () => context.go('/comm/messages'),
            ),
            const SizedBox(height: 12),
            _Tile(
              'Patient Information',
              Icons.badge_outlined,
              () => context.go('/patient'),
            ),
            const SizedBox(height: 12),
            _Tile(
              'SOS Emergency',
              Icons.shield_outlined,
              () => context.go('/comm'),
            ),
          ],
        ),
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;
  const _Tile(this.title, this.icon, this.onTap);

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: title,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE6EDF7)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.06),
                blurRadius: 18,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: const Color(0xFFEAF2FF),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: const Color(0xFF0E67FF)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
      ),
    );
  }
}
