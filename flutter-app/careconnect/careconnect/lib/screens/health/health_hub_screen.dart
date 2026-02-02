import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/app_card.dart';

class HealthHubScreen extends StatelessWidget {
  const HealthHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/home'),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('Notes & Health Logs'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Track your health and notes',
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

            _TileCard(
              icon: Icons.monitor_heart_outlined,
              grad: const [Color(0xFF10B981), Color(0xFF0EA5E9)],
              title: 'Health Logs',
              subtitle: 'Recent vital measurements',
              link: '12 entries',
              onTap: () => context.go('/health/logs'),
            ),
            const SizedBox(height: 14),
            _TileCard(
              icon: Icons.description_outlined,
              grad: const [Color(0xFF0E67FF), Color(0xFF10C7A5)],
              title: 'Personal Notes',
              subtitle: 'Track your thoughts and symptoms',
              link: '4 notes',
              onTap: () => context.go('/health/notes'),
            ),
            const SizedBox(height: 14),
            _TileCard(
              icon: Icons.history,
              grad: const [Color(0xFF8B5CF6), Color(0xFF7C3AED)],
              title: 'History',
              subtitle: 'Your complete health and notes timeline',
              link: '7 entries',
              onTap: () => context.go('/health/history'),
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
    return InkWell(
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
    );
  }
}

class _TileCard extends StatelessWidget {
  final IconData icon;
  final List<Color> grad;
  final String title;
  final String subtitle;
  final String link;
  final VoidCallback onTap;

  const _TileCard({
    required this.icon,
    required this.grad,
    required this.title,
    required this.subtitle,
    required this.link,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: AppCard(
        child: Column(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: LinearGradient(colors: grad),
              ),
              child: Icon(icon, color: Colors.white),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 4),
            Text(subtitle, style: const TextStyle(color: Color(0xFF6B7A90))),
            const SizedBox(height: 8),
            Text(
              link,
              style: const TextStyle(
                color: Color(0xFF10B981),
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
