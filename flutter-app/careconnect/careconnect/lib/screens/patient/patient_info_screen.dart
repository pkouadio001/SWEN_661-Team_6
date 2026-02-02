import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../state/patient_controller.dart';
import '../../widgets/app_card.dart';

class PatientInfoScreen extends ConsumerWidget {
  const PatientInfoScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final p = ref.watch(patientProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/home'),
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
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.exit_to_app)),
        ],
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
                  Row(
                    children: [
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Patient Information',
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Personal and medical details',
                              style: TextStyle(color: Color(0xFF6B7A90)),
                            ),
                          ],
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () => context.go('/patient/edit'),
                        icon: const Icon(Icons.edit_outlined, size: 18),
                        label: const Text('Edit'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 14),
                  const Text(
                    'Personal Details',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 10),

                  _Line(label: 'Full Name', value: p.fullName),
                  _Line(label: 'Date of Birth', value: p.dobText),
                  _Line(label: 'Email', value: p.email),
                  _Line(label: 'Address', value: p.address),

                  const SizedBox(height: 14),
                  const Divider(),
                  const SizedBox(height: 8),

                  const Text(
                    'Medical Information',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 10),

                  _Line(label: 'Primary Physician', value: p.physician),
                  _Line(label: 'Specialty', value: p.specialty),
                  _Line(label: 'Medical Conditions', value: p.conditions),
                  _Line(label: 'Current Medications', value: p.meds),
                  _Line(label: 'Allergies', value: p.allergies),

                  const SizedBox(height: 14),
                  const Divider(),
                  const SizedBox(height: 8),

                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Emergency Contact',
                          style: TextStyle(fontWeight: FontWeight.w900),
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () => context.go('/patient/edit'),
                        icon: const Icon(Icons.edit_outlined, size: 18),
                        label: const Text('Edit'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  _Line(label: 'Contact Name', value: p.emergencyName),
                  _Line(label: 'Phone Number', value: p.emergencyPhone),
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

class _Line extends StatelessWidget {
  final String label;
  final String value;
  const _Line({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF6B7A90))),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}
