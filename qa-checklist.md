# QA Checklist

## Authentication
- [ ] Login works
- [ ] Logout works
- [ ] Redirects to login when not authenticated
- [ ] Preserves intended destination after login
- [ ] Password reset flow works

## Task Management
- [ ] Can create new task
- [ ] Can create multiple tasks at once (newline separated)
- [ ] Can edit task (increase stakes only)
- [ ] Can't edit expired tasks
- [ ] Can't postpone due dates
- [ ] Can mark task complete
- [ ] Can uncle task (with confirmation)
- [ ] Task list refreshes after actions
- [ ] Search filter works
- [ ] Archive shows past tasks
- [ ] Archive hides edit/uncle buttons

## Account Settings
- [ ] Can update name
- [ ] Can update email
- [ ] Can update timezone (dropdown works)
- [ ] Can update password
- [ ] Can manage payment details
- [ ] Can set up Beeminder integration
- [ ] Can generate API token
- [ ] Settings tabs work

## UI/UX
- [ ] Dark mode toggle works
- [ ] Dark mode persists across reloads
- [ ] Loading indicator shows during API calls
- [ ] Modals close properly
- [ ] Forms show validation errors
- [ ] Forms show success messages
- [ ] Long task descriptions wrap properly
- [ ] Buttons disable appropriately
- [ ] Tooltips show on icons

## Cross-browser
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile layout is usable

## Error Handling
- [ ] Shows error messages for failed API calls
- [ ] Handles network errors gracefully
- [ ] Validates form inputs
- [ ] Confirms destructive actions

## Performance
- [ ] Page loads quickly
- [ ] Actions are responsive
- [ ] No visible lag with many tasks
- [ ] No memory leaks from subscriptions

## Security
- [ ] No sensitive data in logs
- [ ] API tokens handled securely
- [ ] Session management works
- [ ] Password requirements enforced

## Environment
- [ ] All required env vars documented
- [ ] Development setup works
- [ ] Production build succeeds
- [ ] Staging deployment works
