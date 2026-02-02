import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../state/settings_controller.dart';
import '../../state/profile_controller.dart';
import '../../widgets/app_card.dart';
import '../../widgets/back_pill.dart';
import '../../widgets/gradient_button.dart';
import 'change_pin_dialog.dart';

class ProfileSettingsScreen extends ConsumerStatefulWidget {
  const ProfileSettingsScreen({super.key});

  @override
  ConsumerState<ProfileSettingsScreen> createState() =>
      _ProfileSettingsScreenState();
}

class _ProfileSettingsScreenState extends ConsumerState<ProfileSettingsScreen> {
  bool editing = false;

  late TextEditingController fullNameCtrl;
  late TextEditingController emailCtrl;
  late TextEditingController usernameCtrl;
  late TextEditingController roleCtrl;

  @override
  void initState() {
    super.initState();
    final profile = ref.read(profileProvider);
    fullNameCtrl = TextEditingController(text: profile.fullName);
    emailCtrl = TextEditingController(text: profile.email);
    usernameCtrl = TextEditingController(text: profile.username);
    roleCtrl = TextEditingController(text: profile.role);
  }

  @override
  void dispose() {
    fullNameCtrl.dispose();
    emailCtrl.dispose();
    usernameCtrl.dispose();
    roleCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/home'),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('Profile & Settings'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Manage your account',
              style: TextStyle(color: Color(0xFF6B7A90)),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 18),
        child: Column(
          children: [
            BackPill(
              text: 'Back to Dashboard',
              onTap: () => context.go('/home'),
            ),
            const SizedBox(height: 14),

            // Profile card
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Profile Information',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Your personal details',
                              style: TextStyle(color: Color(0xFF6B7A90)),
                            ),
                          ],
                        ),
                      ),
                      if (!editing)
                        OutlinedButton.icon(
                          onPressed: () => setState(() => editing = true),
                          icon: const Icon(Icons.edit_outlined, size: 18),
                          label: const Text('Edit'),
                        ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  _Field(
                    label: 'Full Name',
                    controller: fullNameCtrl,
                    enabled: editing,
                  ),
                  _Field(
                    label: 'Email',
                    controller: emailCtrl,
                    enabled: editing,
                  ),
                  _Field(
                    label: 'Username',
                    controller: usernameCtrl,
                    enabled: editing,
                  ),
                  _Field(label: 'Role', controller: roleCtrl, enabled: false),

                  if (editing) ...[
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Expanded(
                          child: GradientButton(
                            text: 'Save Changes',
                            icon: Icons.save_outlined,
                            onPressed: () {
                              final current = ref.read(profileProvider);
                              ref.read(profileProvider.notifier).state = current
                                  .copyWith(
                                    fullName: fullNameCtrl.text.trim(),
                                    email: emailCtrl.text.trim(),
                                    username: usernameCtrl.text.trim(),
                                  );
                              setState(() => editing = false);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Profile updated'),
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: SizedBox(
                            height: 46,
                            child: OutlinedButton(
                              onPressed: () => setState(() => editing = false),
                              child: const Text('Cancel'),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 14),

            // Settings card
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Settings',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Manage your preferences',
                    style: TextStyle(color: Color(0xFF6B7A90)),
                  ),
                  const SizedBox(height: 14),

                  _RowAction(
                    icon: Icons.settings_outlined,
                    title: 'Change PIN',
                    buttonText: 'Update',
                    onTap: () => showDialog(
                      context: context,
                      builder: (_) => const ChangePinDialog(),
                    ),
                  ),
                  const SizedBox(height: 10),

                  _ToggleRow(
                    icon: Icons.remove_red_eye_outlined,
                    title: 'High Contrast Mode',
                    subtitle: 'Enhance visibility with high contrast colors',
                    value: settings.highContrast,
                    onChanged: (v) =>
                        ref.read(settingsProvider.notifier).setHighContrast(v),
                  ),

                  const SizedBox(height: 14),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: FilledButton.icon(
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFFD81B3A),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: () => context.go('/auth'),
                      icon: const Icon(Icons.logout),
                      label: const Text('Logout'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Field extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final bool enabled;

  const _Field({
    required this.label,
    required this.controller,
    required this.enabled,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF6B7A90))),
          const SizedBox(height: 6),
          TextField(
            controller: controller,
            enabled: enabled,
            decoration: InputDecoration(
              filled: true,
              fillColor: const Color(0xFFF3F5F9),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _RowAction extends StatelessWidget {
  final IconData icon;
  final String title;
  final String buttonText;
  final VoidCallback onTap;

  const _RowAction({
    required this.icon,
    required this.title,
    required this.buttonText,
    required this.onTap,
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
          Icon(icon),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
          ),
          OutlinedButton(onPressed: onTap, child: Text(buttonText)),
        ],
      ),
    );
  }
}

class _ToggleRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _ToggleRow({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
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
          Icon(icon),
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
