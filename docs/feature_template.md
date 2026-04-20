# Feature Development Template

Use this template to propose, document, and track the progress of a new feature.

## Phase 1: Specification
*Goal: Define the "What" and "Why" before writing code.*

- **Feature Name**: [Descriptive Name]
- **Problem Statement**: What user pain point are we solving?
- **User Stories**:
  - As a [role], I want to [action] so that [benefit].
- **Functional Requirements**:
  - [Requirement 1]
  - [Requirement 2]
- **Constraints / Edge Cases**:
  - [Edge Case 1]

## Phase 2: Documentation & Design
*Goal: Define the "How" and its external surface.*

- **Architecture Changes**:
  - New DB tables or columns?
  - New Actions in `src/actions`?
  - New API endpoints?
- **UI Design**:
  - Sketch/Layout description for new components.
- **API Specification**:
  - `GET /api/...` -> Response shape.
  - `POST /api/...` -> Payload shape.

## Phase 3: Implementation
*Goal: Build the feature following the System Constitution.*

1. **Database**: Update `src/db.ts` with required schema changes.
2. **Backend**: 
   - Create logic in `src/actions`.
   - Create HTTP handlers in `src/controllers`.
   - register routes in `src/routes`.
3. **Frontend**:
   - Update `src/api/apiClient.ts`.
   - Create React components and hooks.

## Phase 4: Testing & Verification
*Goal: Ensure reliability.*

- **Unit Tests**: Create `spec/[feature].spec.ts` to test Actions and API endpoints.
- **Manual Verification**: Walkthrough the UI to verify UX requirements.
- **Linting**: Run `npm run lint` to ensure code samples follow standards.
