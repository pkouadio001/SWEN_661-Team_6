import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/app_card.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final tiles = [
      _Tile(
        'Profile & Settings',
        Icons.person_outline,
        () => context.go('/profile-settings'),
      ),
      _Tile(
        'Notifications',
        Icons.notifications_none,
        () => ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Hook this to /notifications later')),
        ),
      ),
      _Tile(
        'Patient Information',
        Icons.badge_outlined,
        () => ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Hook this to /patient later')),
        ),
      ),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('CareConnect')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 18),
        child: Column(
          children: [
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Welcome, John Doe',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'Select a module to continue',
                    style: TextStyle(color: Color(0xFF6B7A90)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            for (final t in tiles) ...[
              _DashboardTile(t),
              const SizedBox(height: 12),
            ],
            const SizedBox(height: 12),
            _SOSButton(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

class _Tile {
  final String title;
  final IconData icon;
  final VoidCallback onTap;
  _Tile(this.title, this.icon, this.onTap);
}

class _DashboardTile extends StatelessWidget {
  final _Tile tile;
  const _DashboardTile(this.tile);

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: tile.title,
      child: InkWell(
        onTap: tile.onTap,
        borderRadius: BorderRadius.circular(16),
        child: AppCard(
          child: Row(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: const Color(0xFFEAF2FF),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(tile.icon, color: const Color(0xFF0E67FF)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  tile.title,
                  style: const TextStyle(fontWeight: FontWeight.w800),
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

class _SOSButton extends StatelessWidget {
  const _SOSButton();

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: 'Emergency SOS button',
      hint: 'Tap to request emergency assistance',
      child: InkWell(
        onTap: () => _confirmSOS(context),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          height: 64,
          decoration: BoxDecoration(
            color: const Color(0xFFD32F2F), // emergency red
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.red.withOpacity(0.35),
                blurRadius: 20,
                offset: const Offset(0, 12),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.warning_amber_rounded, color: Colors.white, size: 28),
              SizedBox(width: 12),
              Text(
                'SOS EMERGENCY',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.8,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _confirmSOS(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false, // user must choose
      builder: (_) => AlertDialog(
        title: const Text(
          'Emergency Alert',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
        content: const Text(
          'This will notify your emergency contacts and caregivers.\n\nDo you want to continue?',
        ),
        actions: [
          TextButton(
            onPressed: () => context.pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFD32F2F),
            ),
            onPressed: () {
              context.pop();
              _triggerSOS(context);
            },
            child: const Text(
              'Send SOS',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
          ),
        ],
      ),
    );
  }

  void _triggerSOS(BuildContext context) {
    // 🔴 PLACEHOLDER for real emergency logic
    // Examples:
    // - call emergency number
    // - notify caregiver backend
    // - send SMS / push notification

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: Color(0xFFD32F2F),
        content: Text(
          'Emergency alert sent!',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
