<p align="center">
  <br/>
  <p align="center">
    ✨ Zod extended for better server-side usage ✨
  </p>
</p>
<br/>
<p align="center">
  <a href="https://github.com/nzod/z/actions?query=branch%3Amain">
    <img src="https://github.com/nzod/z/actions/workflows/test-and-build.yml/badge.svg?event=push&branch=main" alt="@nzod/z CI Status" />
  </a>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow">
    <img src="https://img.shields.io/github/license/nzod/z" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/@nzod/z" rel="nofollow">
    <img src="https://img.shields.io/npm/dw/@nzod/z.svg" alt="npm">
  </a>
  <a href="https://www.npmjs.com/package/@nzod/z" rel="nofollow">
    <img src="https://img.shields.io/github/stars/nzod/z" alt="stars">
  </a>
</p>

## Before you start

The README on `main` branch may contain some unreleased changes.

Go to [`release/latest`](https://github.com/nzod/z/tree/release/latest) branch to see the actual README for the latest version from NPM.

## Navigation

- [Installation](#installation)
- [Usage](#usage)
- [Contrubuting](#contributing)
- [Maintenance](#maintenance)
  - [Regular flow](#regular-flow)
  - [Prerelease flow](#prerelease-flow)
  - [Conventions](#conventions)

## Installation

NPM:

```sh
npm install @nzod/z
```

Yarn:

```sh
yarn add @nzod/z
```

## Usage

N'Zod is a wrapper above `zod` library, so you can use `zod` features as your did it before - just replace your `zod` imports with `@nzod/z`.

The main library purpose is to help you with the user input validation. It can be done more accurately by using our custom schemas and methods.

### ZodDateString

In HTTP, we always accept Dates as strings. But default Zod doesn't have methods to validate such type of strings. `ZodDateString` was created to address this issue.

```ts
// 1. Expect user input to be a "string" type
// 2. Expect user input to be a valid date (by using new Date)
z.dateString()

// Cast to Date instance
// (use it on end of the chain, but before "describe")
z.dateString().cast()

// Expect string in "full-date" format from RFC3339
z.dateString().format('date')

// [default format]
// Expect string in "date-time" format from RFC3339
z.dateString().format('date-time')

// Expect date to be the past
z.dateString().past()

// Expect date to be the future
z.dateString().future()

// Expect year to be greater or equal to 2000
z.dateString().minYear(2000)

// Expect year to be less or equal to 2025
z.dateString().maxYear(2025)

// Expect day to be a week day
z.dateString().weekDay()

// Expect year to be a weekend
z.dateString().weekend()
```

Valid `date` format examples:

- `2022-05-15`

Valid `date-time` format examples:

- `2022-05-02:08:33Z`
- `2022-05-02:08:33.000Z`
- `2022-05-02:08:33+00:00`
- `2022-05-02:08:33-00:00`
- `2022-05-02:08:33.000+00:00`

Errors:

- `invalid_date_string` - invalid date

- `invalid_date_string_format` - wrong format

  Payload:

  - `expected` - `'date' | 'date-time'`

- `invalid_date_string_direction` - not past/future

  Payload:

  - `expected` - `'past' | 'future'`

- `invalid_date_string_day` - not weekDay/weekend

  Payload:

  - `expected` - `'weekDay' | 'weekend'`

- `too_small` with `type === 'date_string_year'`
- `too_big` with `type === 'date_string_year'`

### ZodPassword

`ZodPassword` is a string-like type, just like the `ZodDateString`. As you might have guessed, it's intended to help you with password schemas definition.

Also, `ZodPassword` has a more accurate OpenAPI conversion, comparing to regular `.string()`: it has `password` format and generated RegExp string for `pattern`.

```ts
// Expect user input to be a "string" type
z.password()

// Expect password length to be greater or equal to 8
z.password().min(8)

// Expect password length to be less or equal to 100
z.password().max(100)

// Expect password to have at least one digit
z.password().atLeastOne('digit')

// Expect password to have at least one lowercase letter
z.password().atLeastOne('lowercase')

// Expect password to have at least one uppercase letter
z.password().atLeastOne('uppercase')

// Expect password to have at least one special symbol
z.password().atLeastOne('special')
```

Errors:

- `invalid_password_no_digit`
- `invalid_password_no_lowercase`
- `invalid_password_no_uppercase`
- `invalid_password_no_special`
- `too_small` with `type === 'password'`
- `too_big` with `type === 'password'`

### Json Schema

> Created for `@nzod/prisma`

```ts
z.json()
```

### "use" function

> Created for custom schemas in `@nzod/prisma`

Just returns the same Schema

```ts
z.use(MySchema)
```

### Extended Zod Errors

Currently, we use `custom` error code due to some Zod limitations (`errorMap` priorities)

Therefore, the error details is located inside `params` property:

```ts
const error = {
  code: 'custom',
  message: 'Invalid date, expected it to be the past',
  params: {
    isNZod: true,
    code: 'invalid_date_string_direction',

    // payload is always located here in a flat view
    expected: 'past',
  },
  path: ['date'],
}
```

### Working with custom errors on the client side

The library includes some helpers, that can be used to detect custom N'Zod issues and process them the way you want.

```ts
import { isNzodIssue, NZodIssue, ZodIssue } from '@nzod/z'

function mapToFormErrors(issues: ZodIssue[]) {
  for (const issue of issues) {
    if (isNzodIssue(issue)) {
      // issue is NZodIssue
    }
  }
}
```

## Contributing

1. Fork this repo
2. Use the [Regular flow](#regular-flow)

Please follow [Conventions](#conventions)

## Maintenance

The dev branch is `main` - any developer changes is merged in there.

Also, there is a `release/latest` branch. It always contains the actual source code for release published with `latest` tag.

All changes is made using Pull Requests - push is forbidden. PR can be merged only after successfull `test-and-build` workflow checks.

When PR is merged, `release-drafter` workflow creates/updates a draft release. The changelog is built from the merged branch scope (`feat`, `fix`, etc) and PR title. When release is ready - we publish the draft.

Then, the `release` workflow handles everything:

- It runs tests, builds a package, and publishes it
- It synchronizes released tag with `release/latest` branch

### Regular flow

1. Create [feature branch](#conventions)
2. Make changes in your feature branch and [commit](#conventions)
3. Create a Pull Request from your feature branch to `main`  
   The PR is needed to test the code before pushing to release branch
4. If your PR contains breaking changes, don't forget to put a `BREAKING CHANGES` label
5. Merge the PR in `main`
6. All done! Now you have a drafted release - just publish it when ready

### Prerelease flow

1. Assume your prerelease tag is `beta`
2. Create `release/beta` branch
3. Create [feature branch](#conventions)
4. Make changes in your feature branch and [commit](#conventions)
5. Create a Pull Request from your feature branch to `release/beta`  
   The PR is needed to test the code before pushing to release branch
6. Create Github release with tag like `v1.0.0-beta`, pointing to `release/beta` branch  
   For next `beta` versions use semver build syntax: `v1.0.0-beta+1`
7. After that, the `release` workflow will publish your package with the `beta` tag
8. When the `beta` version is ready to become `latest` - create a Pull Request from `release/beta` to `main` branch
9. Continue from the [Regular flow's](#regular-flow) #5 step

### Conventions

**Feature branches**:

- Should start with `feat/`, `fix/`, `docs/`, `refactor/`, and etc., depending on the changes you want to propose (see [pr-labeler.yml](./.github/pr-labeler.yml) for a full list of scopes)

**Commits**:

- Should follow the [Conventional Commits specification](https://www.conventionalcommits.org)
- You can find supported types and scopes into `.cz-config.js`

**Pull requests**:

- Should have human-readable name, for example: "Add a TODO list feature"
- Should describe changes
- Should have correct labels (handled by PR Labeler in most cases)
