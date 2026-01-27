import 'package:flutter/material.dart';

void main() => runApp(const CareConnectHome());

class CareConnectHome extends StatelessWidget {
  const CareConnectHome({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'CareConnect',
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF7FAFF),
      ),
      home: const AuthShell(),
    );
  }
}

/// One screen that toggles between Login + Register like your screenshots.
class AuthShell extends StatefulWidget {
  const AuthShell({super.key});

  @override
  State<AuthShell> createState() => _AuthShellState();
}

enum UserRole { caregiver, careRecipient }

class _AuthShellState extends State<AuthShell> {
  int tabIndex = 0; // 0=Login, 1=Register

  // Login
  final usernameLoginCtrl = TextEditingController();
  final pinLoginCtrl = TextEditingController();

  // Register
  final fullNameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final usernameRegCtrl = TextEditingController();
  final createPinCtrl = TextEditingController();
  final confirmPinCtrl = TextEditingController();
  UserRole selectedRole = UserRole.caregiver;

  @override
  void dispose() {
    usernameLoginCtrl.dispose();
    pinLoginCtrl.dispose();

    fullNameCtrl.dispose();
    emailCtrl.dispose();
    usernameRegCtrl.dispose();
    createPinCtrl.dispose();
    confirmPinCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 18),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 430),
              child: Column(
                children: [
                  const SizedBox(height: 14),

                  // Logo placeholder
                  Container(
                    width: 62,
                    height: 62,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Color(0xFF0E67FF), Color(0xFF10C7A5)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.10),
                          blurRadius: 18,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.favorite,
                      color: Colors.white,
                      size: 30,
                    ),
                  ),

                  const SizedBox(height: 14),
                  const Text(
                    'CareConnect',
                    style: TextStyle(
                      fontSize: 34,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0B1220),
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Your Healthcare Partner',
                    style: TextStyle(fontSize: 14.5, color: Color(0xFF6B7A90)),
                  ),

                  const SizedBox(height: 26),

                  // Info cards
                  Row(
                    children: const [
                      Expanded(
                        child: _InfoMiniCard(
                          icon: Icons.shield_outlined,
                          title: 'Secure Access',
                        ),
                      ),
                      SizedBox(width: 14),
                      Expanded(
                        child: _InfoMiniCard(
                          icon: Icons.supervised_user_circle_outlined,
                          title: 'Role-Based',
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Main card
                  Container(
                    padding: const EdgeInsets.fromLTRB(18, 16, 18, 14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE6EDF7)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 22,
                          offset: const Offset(0, 14),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _SegmentedTabs(
                          leftText: 'Login',
                          rightText: 'Register',
                          index: tabIndex,
                          onChanged: (i) => setState(() => tabIndex = i),
                        ),
                        const SizedBox(height: 18),

                        if (tabIndex == 0)
                          ..._loginForm()
                        else
                          ..._registerForm(),
                      ],
                    ),
                  ),

                  const SizedBox(height: 22),
                  const Text(
                    '© 2026 CareConnect. All rights reserved.',
                    style: TextStyle(fontSize: 12.5, color: Color(0xFF7A8CA6)),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> _loginForm() {
    return [
      const Text(
        'Welcome Back',
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w800,
          color: Color(0xFF0B1220),
        ),
      ),
      const SizedBox(height: 6),
      const Text(
        'Enter your credentials to access your account',
        style: TextStyle(fontSize: 13.5, color: Color(0xFF6B7A90)),
      ),
      const SizedBox(height: 16),

      const _FieldLabel('Username'),
      const SizedBox(height: 8),
      _TextFieldSoft(controller: usernameLoginCtrl, hintText: 'username'),

      const SizedBox(height: 16),

      const _FieldLabel('PIN Number'),
      const SizedBox(height: 10),
      _PinBoxes(controller: pinLoginCtrl, length: 6),
      const SizedBox(height: 8),
      const Center(
        child: Text(
          'Enter your 6-digit PIN',
          style: TextStyle(fontSize: 12.5, color: Color(0xFF7A8CA6)),
        ),
      ),

      const SizedBox(height: 16),

      _GradientButton(text: 'Login', onPressed: () {}),

      const SizedBox(height: 14),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _LinkText(text: 'Forgot username?', onTap: () {}),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 10),
            child: Text('|', style: TextStyle(color: Color(0xFF9AA9C0))),
          ),
          _LinkText(text: 'Forgot your PIN?', onTap: () {}),
        ],
      ),
    ];
  }

  List<Widget> _registerForm() {
    return [
      const Text(
        'Create Account',
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w800,
          color: Color(0xFF0B1220),
        ),
      ),
      const SizedBox(height: 6),
      const Text(
        'Join CareConnect today',
        style: TextStyle(fontSize: 13.5, color: Color(0xFF6B7A90)),
      ),
      const SizedBox(height: 14),

      const _FieldLabel('Full Name'),
      const SizedBox(height: 8),
      _TextFieldSoft(controller: fullNameCtrl, hintText: 'John Doe'),

      const SizedBox(height: 14),

      const _FieldLabel('Email'),
      const SizedBox(height: 8),
      _TextFieldSoft(
        controller: emailCtrl,
        hintText: 'email@example.com',
        keyboardType: TextInputType.emailAddress,
      ),

      const SizedBox(height: 14),

      const _FieldLabel('Username'),
      const SizedBox(height: 8),
      _TextFieldSoft(controller: usernameRegCtrl, hintText: 'username'),

      const SizedBox(height: 16),

      const _FieldLabel('Role'),
      const SizedBox(height: 10),

      _RoleCard(
        title: 'Caregiver',
        subtitle: 'I provide care to others',
        selected: selectedRole == UserRole.caregiver,
        onTap: () => setState(() => selectedRole = UserRole.caregiver),
      ),
      const SizedBox(height: 12),
      _RoleCard(
        title: 'Care Recipient',
        subtitle: 'I receive care from others',
        selected: selectedRole == UserRole.careRecipient,
        onTap: () => setState(() => selectedRole = UserRole.careRecipient),
      ),

      const SizedBox(height: 18),

      const _FieldLabel('Create PIN Number'),
      const SizedBox(height: 10),
      _PinBoxes(controller: createPinCtrl, length: 6),
      const SizedBox(height: 8),
      const Center(
        child: Text(
          'Create a 6-digit PIN',
          style: TextStyle(fontSize: 12.5, color: Color(0xFF7A8CA6)),
        ),
      ),

      const SizedBox(height: 16),

      const _FieldLabel('Confirm PIN Number'),
      const SizedBox(height: 10),
      _PinBoxes(controller: confirmPinCtrl, length: 6),
      const SizedBox(height: 8),
      const Center(
        child: Text(
          'Re-enter your 6-digit PIN',
          style: TextStyle(fontSize: 12.5, color: Color(0xFF7A8CA6)),
        ),
      ),

      const SizedBox(height: 16),

      _GradientButton(text: 'Create Account', onPressed: () {}),

      const SizedBox(height: 10),
      const Text(
        'By registering, you agree to our Terms of Service and Privacy Policy',
        textAlign: TextAlign.center,
        style: TextStyle(fontSize: 11.5, color: Color(0xFF7A8CA6)),
      ),
    ];
  }
}

/* ----------------------------- Reusable Widgets ----------------------------- */

class _InfoMiniCard extends StatelessWidget {
  final IconData icon;
  final String title;

  const _InfoMiniCard({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 74,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE6EDF7)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 14,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: const Color(0xFFEAF2FF),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 20, color: const Color(0xFF0E67FF)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0B1220),
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}

class _SegmentedTabs extends StatelessWidget {
  final String leftText;
  final String rightText;
  final int index;
  final ValueChanged<int> onChanged;

  const _SegmentedTabs({
    required this.leftText,
    required this.rightText,
    required this.index,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 44,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFFF0F3F9),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE6EDF7)),
      ),
      child: Row(
        children: [
          Expanded(
            child: _SegButton(
              text: leftText,
              selected: index == 0,
              onTap: () => onChanged(0),
            ),
          ),
          Expanded(
            child: _SegButton(
              text: rightText,
              selected: index == 1,
              onTap: () => onChanged(1),
            ),
          ),
        ],
      ),
    );
  }
}

class _SegButton extends StatelessWidget {
  final String text;
  final bool selected;
  final VoidCallback onTap;

  const _SegButton({
    required this.text,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(10),
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: selected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: selected
              ? [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 10,
                    offset: const Offset(0, 6),
                  ),
                ]
              : null,
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 13.5,
            fontWeight: FontWeight.w800,
            color: selected ? const Color(0xFF0B1220) : const Color(0xFF6B7A90),
          ),
        ),
      ),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  final String text;
  const _FieldLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 13.5,
        fontWeight: FontWeight.w700,
        color: Color(0xFF0B1220),
      ),
    );
  }
}

class _TextFieldSoft extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final TextInputType? keyboardType;

  const _TextFieldSoft({
    required this.controller,
    required this.hintText,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      textInputAction: TextInputAction.next,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: const TextStyle(color: Color(0xFF9AA9C0)),
        filled: true,
        fillColor: const Color(0xFFF3F5F9),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool selected;
  final VoidCallback onTap;

  const _RoleCard({
    required this.title,
    required this.subtitle,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? const Color(0xFFBFD4FF) : const Color(0xFFE6EDF7),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            _RadioDot(selected: selected),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14.5,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0B1220),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: Color(0xFF6B7A90),
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

class _RadioDot extends StatelessWidget {
  final bool selected;
  const _RadioDot({required this.selected});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 18,
      height: 18,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xFFE6EDF7), width: 2),
      ),
      child: Center(
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          width: selected ? 9 : 0,
          height: selected ? 9 : 0,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: Color(0xFF0E67FF),
          ),
        ),
      ),
    );
  }
}

class _PinBoxes extends StatefulWidget {
  final TextEditingController controller;
  final int length;

  const _PinBoxes({required this.controller, required this.length});

  @override
  State<_PinBoxes> createState() => _PinBoxesState();
}

class _PinBoxesState extends State<_PinBoxes> {
  void _listener() => setState(() {});

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_listener);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_listener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final value = widget.controller.text;

    return GestureDetector(
      onTap: () async {
        final res = await showDialog<String>(
          context: context,
          builder: (ctx) => _PinDialog(
            initial: widget.controller.text,
            length: widget.length,
          ),
        );
        if (res != null) widget.controller.text = res;
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(widget.length, (i) {
          final filled = i < value.length;
          return Container(
            width: 44,
            height: 44,
            margin: EdgeInsets.only(right: i == widget.length - 1 ? 0 : 10),
            decoration: BoxDecoration(
              color: const Color(0xFFF3F5F9),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: filled
                    ? const Color(0xFFBFD4FF)
                    : const Color(0xFFE6EDF7),
              ),
            ),
            child: Center(
              child: Text(
                filled ? '•' : '',
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}

class _PinDialog extends StatefulWidget {
  final String initial;
  final int length;

  const _PinDialog({required this.initial, required this.length});

  @override
  State<_PinDialog> createState() => _PinDialogState();
}

class _PinDialogState extends State<_PinDialog> {
  late TextEditingController ctrl;

  @override
  void initState() {
    super.initState();
    ctrl = TextEditingController(text: widget.initial);
  }

  @override
  void dispose() {
    ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Enter PIN'),
      content: TextField(
        controller: ctrl,
        keyboardType: TextInputType.number,
        maxLength: widget.length,
        decoration: const InputDecoration(counterText: ''),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () {
            final v = ctrl.text.replaceAll(RegExp(r'[^0-9]'), '');
            Navigator.pop(
              context,
              v.length > widget.length ? v.substring(0, widget.length) : v,
            );
          },
          child: const Text('Done'),
        ),
      ],
    );
  }
}

class _GradientButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const _GradientButton({required this.text, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          gradient: const LinearGradient(
            colors: [Color(0xFF0E67FF), Color(0xFF10C7A5)],
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF0E67FF).withOpacity(0.18),
              blurRadius: 18,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          onPressed: onPressed,
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 15.5,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}

class _LinkText extends StatelessWidget {
  final String text;
  final VoidCallback onTap;

  const _LinkText({required this.text, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 12.8,
          color: Color(0xFF0E67FF),
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
