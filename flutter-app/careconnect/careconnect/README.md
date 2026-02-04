CareConnect – Flutter Application

This CareConnect Flutter application focuses specifically on the user interface design and implementation for care recipients with Parkinson’s tremor. The primary goal of this work is to create an accessible, low-effort UI that minimizes fine motor demands and supports safe, predictable interactions.

📋 Prerequisites

Before installing and running the application, ensure you have the following installed:

Flutter SDK (stable channel)
👉 https://docs.flutter.dev/get-started/install

Dart SDK (included with Flutter)

Android Studio or VS Code

One of the following:

Android Emulator

iOS Simulator (macOS only)

Physical mobile device

To verify Flutter is installed correctly, run:

flutter doctor


Ensure there are no critical issues before proceeding.

📦 Installation

Clone the repository

git clone <https://github.com/pkouadio001/SWEN_661-Team_6.git>


Navigate to the project directory

cd careconnect


Install dependencies

flutter pub get

▶️ Running the Application

Start an emulator or connect a physical device.

Run the app:

flutter run


The app will launch on the selected device.

🔐 Authentication Flow (Demo)

Users can register with a username and PIN.

After registration, users are redirected to the Login screen.

Logging in redirects the user to the Patient Dashboard.

Authentication is implemented as a local demo flow (no backend).

🧭 App Navigation Overview

Auth Screen – Login & Registration

Patient Dashboard – Quick actions and navigation

Tasks – Daily and upcoming tasks

Health Logs & Notes – Track health data and personal notes

Communication & Safety – Messages and Emergency SOS

Profile & Settings

🧪 Running Tests

The project includes widget tests and unit tests.

Run all tests
flutter test

Run tests with code coverage
flutter test --coverage

📊 Code Coverage Report

Code coverage is generated using LCOV.

After running coverage:

flutter test --coverage


Generate the HTML report (Windows example):

& "C:\ProgramData\chocolatey\lib\lcov\tools\bin\genhtml" coverage\lcov.info -o coverage\html


Open the report:

Start-Process coverage\html\index.html


📌 Current coverage exceeds 70%, meeting the project requirement.

🛠️ Tech Stack

Flutter

Dart

Riverpod – State management

GoRouter – Navigation

Flutter Test – Unit & widget testing

LCOV – Code coverage reporting

📁 Project Structure (Simplified)
lib/
 ├── models/
 ├── router/
 ├── screens/
 │    ├── auth/
 │    ├── dashboard/
 │    ├── tasks/
 │    ├── health/
 │    ├── communication/
 │    └── profile/
 ├── state/
 └── widgets/

⚠️ Notes

This project uses placeholder/demo data.

Emergency SOS and messaging features are simulated for demonstration purposes.

No external backend services are required.

👤 Author

CareConnect Team – SWEN 661
University of Maryland Global Campus
