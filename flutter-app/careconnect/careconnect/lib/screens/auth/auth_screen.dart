import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool isLogin = true;

  // Login
  final _loginUsername = TextEditingController();
  final _loginPin = TextEditingController();

  // Register
  final _fullName = TextEditingController();
  final _email = TextEditingController();
  final _regUsername = TextEditingController();
  final _regPin = TextEditingController();
  final _regPinConfirm = TextEditingController();
  _Role selectedRole = _Role.caregiver;

  @override
  void dispose() {
    _loginUsername.dispose();
    _loginPin.dispose();
    _fullName.dispose();
    _email.dispose();
    _regUsername.dispose();
    _regPin.dispose();
    _regPinConfirm.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mq = MediaQuery.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF4F8FF),
      body: Stack(
        children: [
          // Soft gradient background like your screenshots
          const _SoftBackground(),

          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
                child: LayoutBuilder(
                  builder: (context, constraints) {
                    // Responsive "card width" – prevents overflow on small phones,
                    // and stops being too wide on tablets.
                    final maxW = constraints.maxWidth;
                    final cardWidth = maxW.clamp(320.0, 520.0);

                    return ConstrainedBox(
                      constraints: BoxConstraints(maxWidth: cardWidth),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          const SizedBox(height: 6),

                          // Logo
                          const _AppLogo(),

                          const SizedBox(height: 12),

                          const Text(
                            'CareConnect',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                              letterSpacing: 0.2,
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Your Healthcare Partner',
                            style: TextStyle(
                              fontSize: 14,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.w500,
                            ),
                          ),

                          const SizedBox(height: 18),

                          // Mini cards row
                          Row(
                            children: const [
                              Expanded(
                                child: _InfoMiniCard(
                                  icon: Icons.shield_outlined,
                                  title: 'Secure Access',
                                  iconColor: Color(0xFF0E67FF),
                                ),
                              ),
                              SizedBox(width: 14),
                              Expanded(
                                child: _InfoMiniCard(
                                  icon: Icons.group_outlined,
                                  title: 'Role-Based',
                                  iconColor: Color(0xFF00A8A8),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 14),

                          // Main auth card
                          _AuthCard(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _SegmentTabs(
                                  leftText: 'Login',
                                  rightText: 'Register',
                                  isLeftSelected: isLogin,
                                  onSelectLeft: () =>
                                      setState(() => isLogin = true),
                                  onSelectRight: () =>
                                      setState(() => isLogin = false),
                                ),

                                const SizedBox(height: 18),

                                AnimatedSwitcher(
                                  duration: const Duration(milliseconds: 220),
                                  switchInCurve: Curves.easeOut,
                                  switchOutCurve: Curves.easeIn,
                                  child: isLogin
                                      ? _buildLogin(context)
                                      : _buildRegister(context),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 16),

                          Text(
                            '© ${DateTime.now().year} CareConnect. All rights reserved.',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF94A3B8),
                            ),
                            textAlign: TextAlign.center,
                          ),

                          SizedBox(height: mq.padding.bottom > 0 ? 8 : 0),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // -------------------- LOGIN --------------------

  Widget _buildLogin(BuildContext context) {
    return Column(
      key: const ValueKey('login'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Welcome Back',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Enter your credentials to access your account',
          style: TextStyle(
            color: Color(0xFF6B7A90),
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 16),

        const _FieldLabel('Username'),
        const SizedBox(height: 8),
        _SoftTextField(
          controller: _loginUsername,
          hintText: 'username',
          textInputAction: TextInputAction.next,
        ),

        const SizedBox(height: 16),

        const _FieldLabel('PIN Number'),
        const SizedBox(height: 10),
        _PinBoxes(
          controller: _loginPin,
          length: 6,
          helperText: 'Enter your 6-digit PIN',
          onChanged: () => setState(() {}),
        ),

        const SizedBox(height: 18),

        _GradientButton(text: 'Login', onPressed: () => context.go('/home')),

        const SizedBox(height: 14),

        Center(
          child: Column(
            children: [
              _LinkText(text: 'Forgot username?', onTap: () {}),
              const SizedBox(height: 10),
              _LinkText(text: 'Forgot your PIN?', onTap: () {}),
            ],
          ),
        ),

        const SizedBox(height: 6),
      ],
    );
  }

  // -------------------- REGISTER --------------------

  Widget _buildRegister(BuildContext context) {
    return Column(
      key: const ValueKey('register'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Create Account',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Join CareConnect today',
          style: TextStyle(
            color: Color(0xFF6B7A90),
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 14),

        const _FieldLabel('Full Name'),
        const SizedBox(height: 8),
        _SoftTextField(
          controller: _fullName,
          hintText: 'John Doe',
          textInputAction: TextInputAction.next,
        ),

        const SizedBox(height: 14),

        const _FieldLabel('Email'),
        const SizedBox(height: 8),
        _SoftTextField(
          controller: _email,
          hintText: 'email@example.com',
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
        ),

        const SizedBox(height: 14),

        const _FieldLabel('Username'),
        const SizedBox(height: 8),
        _SoftTextField(
          controller: _regUsername,
          hintText: 'username',
          textInputAction: TextInputAction.next,
        ),

        const SizedBox(height: 14),

        const _FieldLabel('Role'),
        const SizedBox(height: 10),

        _RoleCard(
          title: 'Caregiver',
          subtitle: 'I provide care to others',
          selected: selectedRole == _Role.caregiver,
          onTap: () => setState(() => selectedRole = _Role.caregiver),
        ),
        const SizedBox(height: 12),
        _RoleCard(
          title: 'Care Recipient',
          subtitle: 'I receive care from others',
          selected: selectedRole == _Role.recipient,
          onTap: () => setState(() => selectedRole = _Role.recipient),
        ),

        const SizedBox(height: 14),

        const _FieldLabel('Create PIN Number'),
        const SizedBox(height: 10),
        _PinBoxes(
          controller: _regPin,
          length: 6,
          helperText: 'Create a 6-digit PIN',
          onChanged: () => setState(() {}),
        ),

        const SizedBox(height: 14),

        const _FieldLabel('Confirm PIN Number'),
        const SizedBox(height: 10),
        _PinBoxes(
          controller: _regPinConfirm,
          length: 6,
          helperText: 'Re-enter your 6-digit PIN',
          onChanged: () => setState(() {}),
        ),

        const SizedBox(height: 18),

        _GradientButton(
          text: 'Create Account',
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('User created successfully!')),
            );
          },
        ),

        const SizedBox(height: 12),
        const Center(
          child: Text(
            'By registering, you agree to our Terms of Service and Privacy Policy',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 11.5, color: Color(0xFF94A3B8)),
          ),
        ),
      ],
    );
  }
}

// -------------------- UI PIECES --------------------

class _SoftBackground extends StatelessWidget {
  const _SoftBackground();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment(0, -0.65),
          radius: 1.25,
          colors: [Color(0xFFE8F2FF), Color(0xFFF7FBFF)],
        ),
      ),
    );
  }
}

class _AppLogo extends StatelessWidget {
  const _AppLogo();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 58,
      height: 58,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          colors: [Color(0xFF0E67FF), Color(0xFF00B3A6)],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.12),
            blurRadius: 18,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: const Icon(Icons.favorite, color: Colors.white, size: 26),
    );
  }
}

class _InfoMiniCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color iconColor;

  const _InfoMiniCard({
    required this.icon,
    required this.title,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: title,
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.92),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE6EDF7)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 18,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(icon, color: iconColor, size: 22),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF0F172A),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AuthCard extends StatelessWidget {
  final Widget child;
  const _AuthCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 14, 18, 16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.92),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE6EDF7)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 22,
            offset: const Offset(0, 14),
          ),
        ],
      ),
      child: child,
    );
  }
}

class _SegmentTabs extends StatelessWidget {
  final String leftText;
  final String rightText;
  final bool isLeftSelected;
  final VoidCallback onSelectLeft;
  final VoidCallback onSelectRight;

  const _SegmentTabs({
    required this.leftText,
    required this.rightText,
    required this.isLeftSelected,
    required this.onSelectLeft,
    required this.onSelectRight,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 44,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFFEFEFF3),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Expanded(
            child: _SegmentButton(
              text: leftText,
              selected: isLeftSelected,
              onTap: onSelectLeft,
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: _SegmentButton(
              text: rightText,
              selected: !isLeftSelected,
              onTap: onSelectRight,
            ),
          ),
        ],
      ),
    );
  }
}

class _SegmentButton extends StatelessWidget {
  final String text;
  final bool selected;
  final VoidCallback onTap;

  const _SegmentButton({
    required this.text,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      selected: selected,
      label: text,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            color: selected ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            boxShadow: selected
                ? [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 10,
                      offset: const Offset(0, 6),
                    ),
                  ]
                : null,
          ),
          alignment: Alignment.center,
          child: Text(
            text,
            style: TextStyle(
              fontWeight: FontWeight.w700,
              color: selected
                  ? const Color(0xFF0F172A)
                  : const Color(0xFF475569),
            ),
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
        fontWeight: FontWeight.w700,
        color: Color(0xFF0F172A),
      ),
    );
  }
}

class _SoftTextField extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;

  const _SoftTextField({
    required this.controller,
    required this.hintText,
    this.keyboardType,
    this.textInputAction,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      textField: true,
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        textInputAction: textInputAction,
        decoration: InputDecoration(
          hintText: hintText,
          filled: true,
          fillColor: const Color(0xFFF3F4F6),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 14,
            vertical: 14,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }
}

class _PinBoxes extends StatelessWidget {
  final TextEditingController controller;
  final int length;
  final String helperText;
  final VoidCallback? onChanged;

  const _PinBoxes({
    required this.controller,
    required this.length,
    required this.helperText,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Stack(
          children: [
            // VISIBLE PIN BOXES
            Row(
              children: List.generate(length, (index) {
                final filled = controller.text.length > index;
                return Expanded(
                  child: Container(
                    height: 44,
                    margin: EdgeInsets.only(
                      right: index == length - 1 ? 0 : 10,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3F4F6),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFE5E7EB)),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      filled ? '•' : '',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                );
              }),
            ),

            // INVISIBLE TextField ON TOP (captures input)
            Positioned.fill(
              child: Opacity(
                opacity: 0.01,
                child: TextField(
                  controller: controller,
                  keyboardType: TextInputType.number,
                  maxLength: length,
                  obscureText: true,
                  enableSuggestions: false,
                  autocorrect: false,
                  decoration: const InputDecoration(
                    counterText: '',
                    border: InputBorder.none,
                  ),
                  onChanged: (_) => onChanged?.call(),
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 10),
        Text(
          helperText,
          style: const TextStyle(fontSize: 12.5, color: Color(0xFF94A3B8)),
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
    return Semantics(
      button: true,
      label: text,
      child: SizedBox(
        width: double.infinity,
        height: 48,
        child: DecoratedBox(
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0E67FF), Color(0xFF00B3A6)],
            ),
            borderRadius: BorderRadius.circular(10),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.10),
                blurRadius: 16,
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
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16),
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
    return Semantics(
      button: true,
      label: text,
      child: InkWell(
        onTap: onTap,
        child: Text(
          text,
          style: const TextStyle(
            color: Color(0xFF0E67FF),
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}

enum _Role { caregiver, recipient }

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
    return Semantics(
      button: true,
      selected: selected,
      label: title,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
          decoration: BoxDecoration(
            color: selected ? const Color(0xFFF2F7FF) : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: selected
                  ? const Color(0xFFBFD7FF)
                  : const Color(0xFFE6EDF7),
              width: 1.2,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 22,
                height: 22,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: selected
                        ? const Color(0xFF0E67FF)
                        : const Color(0xFFE5E7EB),
                    width: 2,
                  ),
                ),
                child: selected
                    ? Center(
                        child: Container(
                          width: 10,
                          height: 10,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: Color(0xFF0E67FF),
                          ),
                        ),
                      )
                    : null,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(color: Color(0xFF6B7A90)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
