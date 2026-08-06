# Apptrove AI Skills & SDK Installer

> One command to install Apptrove AI Skills and integrate the Apptrove SDK into your application.

## Overview

Apptrove AI Skills & SDK Installer is a CLI tool designed to simplify the integration of the Apptrove SDK across multiple platforms while enhancing the developer experience with AI-powered coding assistants.

The installer automatically detects supported AI agents, installs Apptrove AI Skills, analyzes the target project, validates the project structure, and performs SDK integration with minimal manual effort.

## Features

* 🤖 Detects supported AI coding agents automatically
* 🧠 Installs Apptrove AI Skills into the detected agent
* 📱 Detects Android projects automatically
* 🔍 Validates project structure before installation
* 📦 Adds the Apptrove SDK dependency
* 🏗 Detects the Android Application class
* 📄 Detects and validates the Android Manifest
* 📊 Generates an installation report
* ✅ Prevents duplicate SDK integrations
* ⚡ Reduces manual integration effort

## Project Structure

```text
apptrove-skills/
├── bin/                    # CLI entry point
├── core/
│   ├── analyzer/           # Project analyzers
│   ├── context/            # Shared project context
│   ├── modifier/           # File modification utilities
│   ├── parser/             # Configuration parsers
│   ├── utils/              # Shared utilities
│   └── validator/          # Validation modules
├── installers/
│   ├── android/            # Android installer
│   └── index.js            # Platform installer router
├── skills/                 # AI Agent Skills
├── templates/              # Template files
└── package.json
```

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-org>/apptrove-skills.git
cd apptrove-skills
npm install
```

## Usage

Run the installer inside your application project:

```bash
node ../bin/install.js add android
```

or after publishing:

```bash
npx @apptrove/skills add android
```

## Installation Flow

```text
CLI
        │
        ▼
Detect AI Agent
        │
        ▼
Install Apptrove AI Skills
        │
        ▼
Analyze Project
        │
        ▼
Create Project Context
        │
        ▼
Platform Installer
        │
        ▼
SDK Integration
        │
        ▼
Validation & Report
```

## Current Capabilities

### AI Skills

* Detect supported AI coding agents
* Install Apptrove AI Skills
* Prepare AI environment for Apptrove development

### Android

* Detect Android project
* Validate project structure
* Detect Gradle configuration
* Add Apptrove SDK dependency
* Detect Android Application class
* Detect Android Manifest
* Generate installation report

## Installation Report

Example output:

```text
Installing android skill...

✅ Detected: claude-code
✅ Skill installed

==============================
Apptrove Integration Report
==============================

Dependency : Apptrove SDK dependency added
Application: Application class found
Manifest   : AndroidManifest.xml found

==============================
```

## Roadmap

### Android

* Automatic SDK initialization
* Deep Link configuration
* Push Notification integration
* Uninstall Tracking
* Google Play Install Referrer
* Firebase integration

### iOS

* CocoaPods integration
* AppDelegate configuration
* Universal Links
* APNs integration
* Apple Search Ads

### Flutter

* Plugin installation
* Android configuration
* iOS configuration

### React Native

* Native Android integration
* Native iOS integration
* JavaScript configuration

### Expo

* Config Plugin
* Native module setup

### Unity

* Android SDK integration
* iOS SDK integration

## Supported Platforms

| Platform      | Status        |
| ------------- | ------------- |
| Android       | ✅ In Progress |
| iOS           | 🚧 Planned    |
| Flutter       | 🚧 Planned    |
| React Native  | 🚧 Planned    |
| Expo          | 🚧 Planned    |
| Ionic/Cordova | 🚧 Planned    |
| Unity         | 🚧 Planned    |

## Why Apptrove AI Skills?

The installer reduces SDK integration time by automating repetitive setup tasks while enabling AI coding assistants with Apptrove-specific knowledge, resulting in faster onboarding, fewer integration errors, and a consistent developer experience across platforms.

## Contributing

Contributions, bug reports, and feature requests are welcome. Please open an issue or submit a pull request.

## License

Copyright © Apptrove. All rights reserved.
