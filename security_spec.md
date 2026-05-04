# Firestore Security Specification - AniTask

## Data Invariants
1. A user can only read and write their own user profile document.
2. A task can only be created within a user's own `tasks` subcollection.
3. A task's `userId` field must match the parent document's ID and the authenticated user's ID.
4. Tasks can only be deleted by the owner.
5. Task text must be a string between 1 and 500 characters.
6. Task priority must be one of: 'low', 'medium', 'high'.
7. Timestamps must be valid.

## The Dirty Dozen Payloads (Rejection Targets)

1. **Identity Spoofing**: Attempt to create a user profile for someone else.
2. **Identity Spoofing**: Attempt to read another user's profile.
3. **Identity Spoofing**: Attempt to create a task in another user's subcollection.
4. **Data Poisoning**: Creating a task with 1MB of random text.
5. **Data Poisoning**: Creating a task with an invalid priority (e.g., 'super-urgent').
6. **Integrity Violation**: Updating a task's `userId` to a different user.
7. **Integrity Violation**: Updating `createdAt` timestamp.
8. **Unauthorized Deletion**: Deleting a task belonging to another user.
9. **Shadow Update**: Adding a field like `isAdmin: true` to a task.
10. **Type Poisoning**: Sending a boolean for the `text` field.
11. **ID Poisoning**: Using a malicious string as a document ID.
12. **Unverified Auth**: Attempting writes with an unverified email (if enforced).

## Test Runner Logic
The `firestore.rules.test.ts` will verify these denials.
