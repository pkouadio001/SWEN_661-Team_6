import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/message.dart';

final messageThreadsProvider = Provider<List<MessageThread>>((ref) {
  return const [
    MessageThread(
      id: 'm1',
      sender: 'Caregiver Maria',
      preview: 'Good morning! How are you feeling today?',
      timeLabel: '8:15 AM',
    ),
    MessageThread(
      id: 'm2',
      sender: "Dr. Smith's Office",
      preview: 'Reminder: Appointment tomorrow at 10:30 AM',
      timeLabel: 'Yesterday',
    ),
  ];
});

final replyingToProvider = StateProvider<String?>((_) => null);
