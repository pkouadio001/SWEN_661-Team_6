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
            // Welcome card with semantic header
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Semantics(
                    header: true,
                    child: const Text(
                      'Welcome, John Doe',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Select a module to continue',
                    style: TextStyle(color: Color(0xFF6B7A90)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Dashboard tiles with semantics
            for (final t in tiles) ...[
              _DashboardTile(t),
              const SizedBox(height: 12),
            ],

            const SizedBox(height: 12),

            // SOS button with enhanced semantics
            const _SOSButton(),

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
      enabled: true,
      label: tile.title,
      // Ensure the label is exposed to the test
      child: InkWell(
        onTap: tile.onTap,
        borderRadius: BorderRadius.circular(16),
        child: AppCard(
          child: Row(
            children: [
              // Icon container - exclude from semantics since parent has label
              ExcludeSemantics(
                child: Container(
                  width: 46,
                  height: 46,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEAF2FF),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(tile.icon, color: const Color(0xFF0E67FF)),
                ),
              ),
              const SizedBox(width: 12),

              // Text with merged semantics
              Expanded(
                child: MergeSemantics(
                  child: Text(
                    tile.title,
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                ),
              ),

              // Chevron - exclude from semantics (decorative)
              ExcludeSemantics(child: const Icon(Icons.chevron_right)),
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
      enabled: true,
      label: 'SOS EMERGENCY',
      hint: 'Tap to request emergency assistance and notify your contacts',
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
                color: Colors.red.withValues(alpha: 0.35),
                blurRadius: 20,
                offset: const Offset(0, 12),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Icon - exclude from semantics since parent has label
              ExcludeSemantics(
                child: const Icon(
                  Icons.warning_amber_rounded,
                  color: Colors.white,
                  size: 28,
                ),
              ),
              const SizedBox(width: 12),

              // Text with merged semantics
              MergeSemantics(
                child: const Text(
                  'SOS EMERGENCY',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.8,
                  ),
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
      builder: (_) => Semantics(
        namesRoute: true,
        label: 'Emergency alert confirmation dialog',
        child: AlertDialog(
          title: Semantics(
            header: true,
            child: const Text(
              'Emergency Alert',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
          ),
          content: const Text(
            'This will notify your emergency contacts and caregivers.\n\nDo you want to continue?',
          ),
          actions: [
            Semantics(
              button: true,
              label: 'Cancel emergency alert',
              child: TextButton(
                onPressed: () =>
                    Navigator.of(context, rootNavigator: true).pop(),
                child: const Text('Cancel'),
              ),
            ),
            Semantics(
              button: true,
              label: 'Send emergency SOS now',
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD32F2F),
                ),
                onPressed: () {
                  Navigator.of(context, rootNavigator: true).pop();
                  _triggerSOS(context);
                },
                child: const Text(
                  'Send SOS',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
            ),
          ],
        ),
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
        duration: Duration(seconds: 3),
      ),
    );
  }
}
