import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../state/patient_controller.dart';
import '../../widgets/app_card.dart';
import '../../widgets/gradient_button.dart';

class PatientEditScreen extends ConsumerStatefulWidget {
  const PatientEditScreen({super.key});

  @override
  ConsumerState<PatientEditScreen> createState() => _PatientEditScreenState();
}

class _PatientEditScreenState extends ConsumerState<PatientEditScreen> {
  late TextEditingController dobCtrl;
  late TextEditingController physicianCtrl;
  late TextEditingController specialtyCtrl;
  late TextEditingController conditionsCtrl;
  late TextEditingController medsCtrl;
  late TextEditingController allergiesCtrl;
  late TextEditingController emergencyNameCtrl;
  late TextEditingController emergencyPhoneCtrl;

  @override
  void initState() {
    super.initState();
    final p = ref.read(patientProvider);
    dobCtrl = TextEditingController(text: p.dobText);
    physicianCtrl = TextEditingController(text: p.physician);
    specialtyCtrl = TextEditingController(text: p.specialty);
    conditionsCtrl = TextEditingController(text: p.conditions);
    medsCtrl = TextEditingController(text: p.meds);
    allergiesCtrl = TextEditingController(text: p.allergies);
    emergencyNameCtrl = TextEditingController(text: p.emergencyName);
    emergencyPhoneCtrl = TextEditingController(text: p.emergencyPhone);
  }

  @override
  void dispose() {
    dobCtrl.dispose();
    physicianCtrl.dispose();
    specialtyCtrl.dispose();
    conditionsCtrl.dispose();
    medsCtrl.dispose();
    allergiesCtrl.dispose();
    emergencyNameCtrl.dispose();
    emergencyPhoneCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final p = ref.watch(patientProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/patient'),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('Patient Information'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Medical details & emergency contact',
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

            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Personal Details',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 10),

                  _StaticLine(label: 'Full Name', value: p.fullName),
                  _Field(label: 'Date of Birth', controller: dobCtrl),
                  _StaticLine(label: 'Email', value: p.email),
                  _StaticLine(label: 'Address', value: p.address),

                  const SizedBox(height: 10),
                  const Divider(),
                  const SizedBox(height: 10),

                  const Text(
                    'Medical Information',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 10),

                  _Field(label: 'Primary Physician', controller: physicianCtrl),
                  _Field(
                    label: 'Cardiology Specialist',
                    controller: specialtyCtrl,
                  ),
                  _Field(
                    label: 'Medical Conditions',
                    controller: conditionsCtrl,
                  ),
                  _Field(label: 'Current Medications', controller: medsCtrl),
                  _Field(label: 'Allergies', controller: allergiesCtrl),

                  const SizedBox(height: 10),
                  const Divider(),
                  const SizedBox(height: 10),

                  const Text(
                    'Emergency Contact',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 10),

                  _Field(label: 'Contact Name', controller: emergencyNameCtrl),
                  _Field(label: 'Phone Number', controller: emergencyPhoneCtrl),

                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: GradientButton(
                          text: 'Save Changes',
                          icon: Icons.save_outlined,
                          onPressed: () {
                            final updated = p.copyWith(
                              dobText: dobCtrl.text.trim(),
                              physician: physicianCtrl.text.trim(),
                              specialty: specialtyCtrl.text.trim(),
                              conditions: conditionsCtrl.text.trim(),
                              meds: medsCtrl.text.trim(),
                              allergies: allergiesCtrl.text.trim(),
                              emergencyName: emergencyNameCtrl.text.trim(),
                              emergencyPhone: emergencyPhoneCtrl.text.trim(),
                            );
                            ref.read(patientProvider.notifier).state = updated;
                            context.go('/patient');
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Saved (demo)')),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: SizedBox(
                          height: 46,
                          child: OutlinedButton(
                            onPressed: () => context.go('/patient'),
                            child: const Text('Cancel'),
                          ),
                        ),
                      ),
                    ],
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

class _StaticLine extends StatelessWidget {
  final String label;
  final String value;
  const _StaticLine({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF6B7A90))),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }
}

class _Field extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  const _Field({required this.label, required this.controller});

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
