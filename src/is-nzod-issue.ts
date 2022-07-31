import { NZodIssue, ZodIssueOptionalMessage } from './issues'

// Inline code for better tree-shaking
const CUSTOM_ISSUE_CODE = 'custom'

export function isNZodIssue(
  issue: ZodIssueOptionalMessage
): issue is NZodIssue {
  return issue.code === CUSTOM_ISSUE_CODE && issue.params?.isNZod
}
