import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:careconnect/state/messages_controller.dart';
import 'package:careconnect/models/message.dart';

void main() {
  group('Messages providers (unit)', () {
    test('messageThreadsProvider returns 2 threads with expected content', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final threads = container.read(messageThreadsProvider);

      expect(threads, isA<List<MessageThread>>());
      expect(threads.length, 2);

      expect(threads[0].id, 'm1');
      expect(threads[0].sender, 'Caregiver Maria');
      expect(threads[0].timeLabel, '8:15 AM');

      expect(threads[1].id, 'm2');
      expect(threads[1].sender, "Dr. Smith's Office");
      expect(threads[1].timeLabel, 'Yesterday');
    });

    test('messageThreadsProvider thread ids are unique', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final threads = container.read(messageThreadsProvider);
      final ids = threads.map((t) => t.id).toSet();

      expect(ids.length, threads.length);
    });

    test('replyingToProvider defaults to null', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      expect(container.read(replyingToProvider), isNull);
    });

    test('replyingToProvider can be updated and cleared', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      // Set replying thread id
      container.read(replyingToProvider.notifier).state = 'm1';
      expect(container.read(replyingToProvider), 'm1');

      // Clear
      container.read(replyingToProvider.notifier).state = null;
      expect(container.read(replyingToProvider), isNull);
    });
  });
}
