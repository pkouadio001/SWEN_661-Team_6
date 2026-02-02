import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/note.dart';

final notesProvider = StateNotifierProvider<NotesController, List<NoteItem>>((
  ref,
) {
  return NotesController()..seed();
});

class NotesController extends StateNotifier<List<NoteItem>> {
  NotesController() : super(const []);

  void seed() {
    final now = DateTime.now();
    state = [
      NoteItem(
        id: 'n1',
        title: 'Feeling better today',
        body:
            'The new medication seems to be helping. Less pain in the morning.',
        dateTime: now,
      ),
      NoteItem(
        id: 'n2',
        title: 'Appointment reminder',
        body: 'Need to ask Dr. Smith about the new exercise routine.',
        dateTime: now.subtract(const Duration(days: 1)),
      ),
      NoteItem(
        id: 'n3',
        title: 'Sleep quality improved',
        body: 'Slept 7 hours straight last night. Feeling more rested.',
        dateTime: now.subtract(const Duration(days: 2)),
      ),
      NoteItem(
        id: 'n4',
        title: 'Mild headache',
        body: 'Started around noon. Took one aspirin. Better by evening.',
        dateTime: now.subtract(const Duration(days: 3)),
      ),
    ];
  }

  void add(String title, String body) {
    final id = DateTime.now().microsecondsSinceEpoch.toString();
    state = [
      NoteItem(id: id, title: title, body: body, dateTime: DateTime.now()),
      ...state,
    ];
  }
}
