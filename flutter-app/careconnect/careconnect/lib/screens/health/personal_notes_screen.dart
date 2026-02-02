import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../state/notes_controller.dart';
import '../../widgets/app_card.dart';
import 'widgets/new_note_dialog.dart';

class PersonalNotesScreen extends ConsumerWidget {
  const PersonalNotesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notes = ref.watch(notesProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/health'),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('Personal Notes'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Track your thoughts and symptoms',
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
              text: 'Back to Notes & Health Logs',
              onTap: () => context.go('/health'),
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
                              'Personal Notes',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Track your thoughts and symptoms',
                              style: TextStyle(color: Color(0xFF6B7A90)),
                            ),
                          ],
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () => showDialog(
                          context: context,
                          builder: (_) => const NewNoteDialog(),
                        ),
                        icon: const Icon(Icons.description_outlined),
                        label: const Text('New Note'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  for (final n in notes) ...[
                    _NoteCard(
                      title: n.title,
                      body: n.body,
                      timeText: _fmt(n.dateTime),
                    ),
                    const SizedBox(height: 12),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  static String _fmt(DateTime dt) {
    final h = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final m = dt.minute.toString().padLeft(2, '0');
    final ap = dt.hour >= 12 ? 'PM' : 'AM';
    return '${dt.month}/${dt.day}/${dt.year} - $h:$m $ap';
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
            Text('Back to Notes & Health Logs'),
          ],
        ),
      ),
    );
  }
}

class _NoteCard extends StatelessWidget {
  final String title;
  final String body;
  final String timeText;

  const _NoteCard({
    required this.title,
    required this.body,
    required this.timeText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE6EDF7)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
          const SizedBox(height: 6),
          Text(body, style: const TextStyle(color: Color(0xFF334155))),
          const SizedBox(height: 10),
          Text(timeText, style: const TextStyle(color: Color(0xFF6B7A90))),
        ],
      ),
    );
  }
}
