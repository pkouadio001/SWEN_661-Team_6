import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../state/messages_controller.dart';
import '../../widgets/app_card.dart';

class MessagesScreen extends ConsumerWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final threads = ref.watch(messageThreadsProvider);
    final replyingTo = ref.watch(replyingToProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.go('/comm'),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('Messages'),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(18),
          child: Padding(
            padding: EdgeInsets.only(bottom: 10),
            child: Text(
              'Stay connected with your care team',
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
              text: 'Back to Communication & Safety',
              onTap: () => context.go('/comm'),
            ),
            const SizedBox(height: 14),

            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Messages',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Stay connected with your care team',
                    style: TextStyle(color: Color(0xFF6B7A90)),
                  ),
                  const SizedBox(height: 12),

                  for (final t in threads) ...[
                    _ThreadCard(
                      sender: t.sender,
                      preview: t.preview,
                      timeLabel: t.timeLabel,
                      replying: replyingTo == t.id,
                      onReplyTap: () =>
                          ref.read(replyingToProvider.notifier).state = t.id,
                      onCancelReply: () =>
                          ref.read(replyingToProvider.notifier).state = null,
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
            Text('Back to Communication & Safety'),
          ],
        ),
      ),
    );
  }
}

class _ThreadCard extends StatefulWidget {
  final String sender;
  final String preview;
  final String timeLabel;
  final bool replying;
  final VoidCallback onReplyTap;
  final VoidCallback onCancelReply;

  const _ThreadCard({
    required this.sender,
    required this.preview,
    required this.timeLabel,
    required this.replying,
    required this.onReplyTap,
    required this.onCancelReply,
  });

  @override
  State<_ThreadCard> createState() => _ThreadCardState();
}

class _ThreadCardState extends State<_ThreadCard> {
  final replyCtrl = TextEditingController();

  @override
  void dispose() {
    replyCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
      decoration: BoxDecoration(
        color: widget.replying ? const Color(0xFFEAF2FF) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE6EDF7)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: const Color(0xFFF1EAFE),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.chat_bubble_outline,
                  color: Color(0xFF7C3AED),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.sender,
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      widget.preview,
                      style: const TextStyle(color: Color(0xFF334155)),
                    ),
                    const SizedBox(height: 6),
                    InkWell(
                      onTap: widget.onReplyTap,
                      child: const Text(
                        '↩ Reply',
                        style: TextStyle(
                          color: Color(0xFF0E67FF),
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                widget.timeLabel,
                style: const TextStyle(color: Color(0xFF6B7A90)),
              ),
            ],
          ),

          if (widget.replying) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE6EDF7)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Replying to ${widget.sender}',
                    style: const TextStyle(color: Color(0xFF6B7A90)),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: replyCtrl,
                          decoration: InputDecoration(
                            hintText: 'Type your reply...',
                            filled: true,
                            fillColor: const Color(0xFFF3F5F9),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Semantics(
                        button: true,
                        label: 'Send reply',
                        child: IconButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Reply sent (demo)'),
                              ),
                            );
                            replyCtrl.clear();
                            widget.onCancelReply();
                          },
                          icon: const Icon(Icons.send),
                        ),
                      ),
                      Semantics(
                        button: true,
                        label: 'Cancel reply',
                        child: IconButton(
                          onPressed: widget.onCancelReply,
                          icon: const Icon(Icons.close),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
