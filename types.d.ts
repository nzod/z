/*
 * It's sad, but TS can't merge "z" exports properly - it becomes "any"
 * For that reason, we have a manually-created declaration file with working re-exports
 */
export * from './dist/only-override'
export * as z from './dist/only-override'
