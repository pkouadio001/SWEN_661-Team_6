import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/notifications_controller.dart';
import '../../widgets/gradient_button.dart';

class PushSettingsDialog extends ConsumerWidget {
  const PushSettingsDialog({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final s = ref.watch(pushSettingsProvider);
    final ctrl = ref.read(pushSettingsProvider.notifier);

    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 18),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Push Notification Settings',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
            const Text(
              'Configure push notifications based on your mobile device settings',
              style: TextStyle(color: Color(0xFF6B7A90)),
            ),
            const SizedBox(height: 14),

            _ToggleRow(
              title: 'Enable Push Notifications',
              subtitle: 'Master control for all notifications',
              value: s.master,
              onChanged: ctrl.toggleMaster,
              leading: Icons.notifications_active_outlined,
            ),
            const SizedBox(height: 12),

            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE6EDF7)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Notification Types',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 10),

                  _SmallToggle(
                    text: 'Medication Reminders',
                    value: s.meds,
                    onChanged: ctrl.toggleMeds,
                    icon: Icons.medication_outlined,
                  ),
                  _SmallToggle(
                    text: 'Appointment Notifications',
                    value: s.appts,
                    onChanged: ctrl.toggleAppts,
                    icon: Icons.calendar_month_outlined,
                  ),
                  _SmallToggle(
                    text: 'Task Reminders',
                    value: s.tasks,
                    onChanged: ctrl.toggleTasks,
                    icon: Icons.checklist_outlined,
                  ),
                  _SmallToggle(
                    text: 'Health Check Reminders',
                    value: s.health,
                    onChanged: ctrl.toggleHealth,
                    icon: Icons.monitor_heart_outlined,
                  ),
                  _SmallToggle(
                    text: 'Caregiver Messages',
                    value: s.caregiverMsgs,
                    onChanged: ctrl.toggleMsgs,
                    icon: Icons.chat_bubble_outline,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE6EDF7)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mobile Settings',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 10),
                  _SmallToggle(
                    text: 'Sound',
                    value: s.sound,
                    onChanged: ctrl.toggleSound,
                    icon: Icons.volume_up_outlined,
                    subtitle: 'Play notification sound',
                  ),
                ],
              ),
            ),

            const SizedBox(height: 14),
            GradientButton(
              text: 'Save Settings',
              onPressed: () => Navigator.pop(context),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              height: 44,
              child: OutlinedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ToggleRow extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;
  final IconData leading;

  const _ToggleRow({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
    required this.leading,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE6EDF7)),
      ),
      child: Row(
        children: [
          Icon(leading),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(color: Color(0xFF6B7A90)),
                ),
              ],
            ),
          ),
          Switch(value: value, onChanged: onChanged),
        ],
      ),
    );
  }
}

class _SmallToggle extends StatelessWidget {
  final String text;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;
  final IconData icon;

  const _SmallToggle({
    required this.text,
    this.subtitle,
    required this.value,
    required this.onChanged,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Icon(icon),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(text, style: const TextStyle(fontWeight: FontWeight.w700)),
                if (subtitle != null)
                  Text(
                    subtitle!,
                    style: const TextStyle(color: Color(0xFF6B7A90)),
                  ),
              ],
            ),
          ),
          Switch(value: value, onChanged: onChanged),
        ],
      ),
    );
  }
}
