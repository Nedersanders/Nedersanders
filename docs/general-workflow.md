# General Workflow - Nedersanders.nl Development

## Overview
This document outlines our development workflow for the Nedersanders.nl project, covering everything from initial planning to deployment.

## 📂 Google Drive Documentation
[Invite link](https://drive.google.com/drive/folders/1wtmBt_SW1IMzZn7r9VDogtujFWRitT4Y?usp=sharing)

### Organization Structure
- **Project Folders (Design and Dev)**: All project assets, documents, and resources
- **Shared Resources**: Templates, brand guidelines, and reusable assets
- **Archives**: Previous versions and completed project materials
- **Infra / Architecture**: Files related to project design

## 📋 Project Management

### Trello Integration
[Trello Board](https://trello.com/invite/68865fecc1f9daeb3ba66922/ATTI1ab34ffc0cff4b6b747dff9d00e05327C685CD46)

- **Main Board**: All project tasks are managed through our Trello board. We have 2 boards, one for development, and one for design.
- **Special tickets**: Some tickets are not for issues / features, but for resource allocation, ideas, suggestions, etc. This will make sense by reading the column name.

### Ticket Lifecycle
1. **Content Ideas / Room for improvement** → Ideas and future enhancements
2. **Next up** → Issues / Features that will be planned in the near future
3. **Current Sprint** → Planned to be worked on. Move tickets from here to **In Progress** 
3. **In Progress** → Currently being worked on, or **On hold** → Something we will get back to later.
5. **Done** → Completed and deployed
6. **Junk drawer** → Discarded ideas

## 🎨 Design Sprint Process

### Planning Phase
- **Stakeholder Input**: Gather ideas from all Sanders in the global chat or design group
- **Wireframing / Design**: Create low-fidelity layouts before implementation
- **Design Review**: Approve designs before development begins, lets get the opinion of multiple sanders.


## 🌿 Branch Strategy

### Naming Convention
All branches must follow this structure:
```
dev-[name]-[whatyouaredoing]
```

### Examples
- `dev-sanderslagman-navbar-redesign`
- `dev-sanderverschoor-contact-form-validation`
- `dev-sandermetdelangeachternaam-mobile-responsiveness`
- `dev-sandersander-easter-egg-feature`
- `dev-sandernotxander-performance-optimization`

### Branch Types
- **Feature branches**: `dev-[name]-[feature-description]`
- **Bug fixes**: `dev-[name]-fix-[bug-description]`
- **Improvements**: `dev-[name]-improve-[what-you-improve]`
- **Experiments**: `dev-[name]-experiment-[what-you-test]`

### Branch Workflow
1. **Create** branch from `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout -b dev-yourname-feature-description
   ```

2. **Work** on your feature
   - Make small, focused commits
   - Write descriptive commit messages
   - Test your changes locally

3. **Push** regularly
   ```bash
   git push origin dev-yourname-feature-description
   ```

4. **Create Pull Request**
   - Link to relevant Trello ticket
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Request review from team members

5. **Merge** after approval
   - Squash commits if needed
   - Delete branch after merge

## 💡 Suggestions & Ideas

### Suggestion Process
1. **Create Trello Card** in "Ideas/Suggestions" list
2. **Add Details**: 
   - Clear description of the suggestion
   - Implementation or design complexity estimate
   - Any relevant mockups or examples

3. **Team Discussion**:
   - Weekly review of new suggestions
   - Prioritize based on impact and effort
   - Move approved suggestions to Next-Up

4. **Implementation**:
   - Assign to team member
   - Create development branch or design
   - Follow normal workflow

### Types of Suggestions
- **UI/UX Improvements**
- **Performance Optimizations**
- **New Features**
- **Different approaches**


## 🔧 Development Guidelines

### Code Standards
- **JavaScript**: Use ES6+ features, proper error handling
- **CSS**: Follow BEM methodology, use Tailwind utilities
- **HTML / EJS**: Semantic markup, accessibility best practices
- **Git**: Descriptive commit messages, small focused commits

### Testing Requirements
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness (iPhone, Android, tablet)
- Accessibility testing (screen readers, keyboard navigation)
- Test on staging.

### Review Process
1. **Self Review**: Check your own code before submitting
2. **Peer Review**: At least one team member must review
3. **Testing**: Reviewer tests functionality locally or on staging. If you have deployed your branch to staging, please provide the staging number.
4. **Approval**: Approve only when confident in quality

## 📱 Environment Management

### Development Environment
- **Local**: Run npm start in the root project folder.
- **Staging** sander[1-10].imlostincode.nl. See How-to-deploy-to-staging.md
- **Live dev/preview**: `dev.nedersanders.nl` as a preview for other sanders.
- **Production**: `nedersanders.nl` for live site

## 🚀 Release Process

### Version Control
- **Major releases**: New features, significant changes
- **Minor releases**: Bug fixes, small improvements
- **Patches**: Hotfixes, critical issues

### Release Steps
1. **Feature Freeze**: Stop adding new features
2. **Testing Phase**: Comprehensive testing of all features
3. **Bug Fixes**: Address any issues found during testing
4. **Documentation**: Update any relevant documentation
5. **Deploy**: Release to production
6. **Monitor**: Watch for any post-release issues

## 📞 Communication


### Weekly Planning
- Review completed work
- Plan upcoming tasks
- Prioritize backlog items
- Discuss any challenges or suggestions

### Tools
- **Discord**: Day-to-day communication and video calls (Dev channel on the way)
- **Trello**: Project management and tracking
- **GitHub**: Code collaboration and reviews


## 🤝 Sanders Responsibilities

### All Developers and Designers
- Follow branch naming conventions
- Write clean, documented code or create nice designs
- Test changes thoroughly, or do peer reviews for designs.
- Participate in code or design reviews
- Keep Trello tickets updated

---

*Last updated: July 28, 2025*
*Version: 1.0*