# Directus Localized System Emails Extension 🌍📧

A casual little Directus extension that makes your system emails speak multiple languages! Because
who doesn't want their password reset emails to be as international as their user base?

## What does this thing do?

This extension hooks into Directus's email system and automatically localizes system emails based on
the user's language preference. It supports both custom `.liquid` template files and translatable
subjects through the Directus translations system.

Pretty neat, right? 🎉

## Installation

For detailed installation instructions, check out
the [official Directus documentation on extensions](https://docs.directus.io/extensions/installing-extensions.html).

Quick example with pnpm (like the cool kids):

```bash
pnpm add --save-exact directus-extension-localized-system-emails
```

Then restart your Directus instance and you're good to go!

> **Note:** We're hoping this extension will eventually be available in the Directus marketplace! 🤞

## Setup

### 1. Template Files (.liquid)

This is where the magic happens! You'll need to create localized versions of your email templates.

**Step 1:** Navigate to your Directus templates folder (usually `./templates`)

**Step 2:** Create your localized template files using this naming convention:

```
<template-name>-<language-code>.liquid
```

For example:

- `password-reset-en.liquid` (English)
- `password-reset-nl.liquid` (Dutch)
- `password-reset-fr.liquid` (French)
- `user-invitation-de.liquid` (German)

**Step 3:** Copy your existing template content and translate it to the target language.

The extension will automatically pick up these files when sending emails to users with matching
language preferences!

### 2. Subject Translations

Want to translate email subjects too? Easy peasy!

**Step 1:** Go to your Directus Data Studio

**Step 2:** Navigate to the translations section

**Step 3:** Create translation entries with:

- **Key:** `<template-name>` (e.g., `password-reset`, `user-invitation`)
- **Language:** Your target language code
- **Value:** The translated subject line

Example translations:

- Key: `password-reset`, Language: `en-US`, Value: `Reset your password`
- Key: `password-reset`, Language: `nl-NL`, Value: `Wachtwoord opnieuw instellen`
- Key: `user-invitation`, Language: `fr-FR`, Value: `Invitation à rejoindre`

## Supported Templates ✅

Currently, this extension supports the following system email templates:

- **password-reset** - When users request a password reset
- **user-invitation** - When inviting new users to your Directus instance
- **user-registration** - When new users register (if registration is enabled)

## Not Supported (Yet) ❌

These templates aren't supported at the moment, but hey, maybe in a future version:

- **shared-item** - Shared item notifications
- **notifications** - General system notifications

## How it works

1. When Directus tries to send a system email, this extension intercepts it
2. It checks the recipient's language preference (or falls back to the system default)
3. It looks for a localized template file (`<template>-<language>.liquid`)
4. It checks for a translated subject in the translations table
5. If found, it uses the localized versions; otherwise, it falls back to the defaults

Simple as that! 🚀

## The Future of Email Translations in Directus 🔮

Here's the thing - this extension might actually be temporary! The Directus team is actively working
on native email translation support, which is pretty exciting. There are some great discussions
happening around this:

- [GitHub Discussion: Email Template Translations](https://github.com/directus/directus/discussions/8239) -
  The main discussion about implementing native email translation support
- [Directus TV: Email Translations Request Review](https://directus.io/tv/request-review/email-translations) -
  A video discussing the future of email translations

So while this extension fills the gap for now, we're all looking forward to when Directus handles
this natively. Until then, happy translating! 🌍

## Requirements

- Directus 10.10.0 or higher (up to 12.0.0)
- Node.js 16+ (because we're living in the future)

## Contributing

Found a bug? Want to add support for more templates? PRs are welcome! Just make sure to:

1. Keep the code clean and well-commented
2. Test your changes
3. Update this README if needed

## License

MIT License - because sharing is caring!

## Acknowledgments

Big shoutout
to [jekuer/directus-extension-system-email-i18n](https://github.com/jekuer/directus-extension-system-email-i18n)
for the inspiration! Their extension works great and helped shape the approach for this one. 🙏

## Author

Made with ❤️ by [Jogchum Koerts](mailto:jogchum@clevercactus.dev)

---

*P.S. - If this extension saved you some time, consider giving it a star on GitHub! It makes me
happy and costs you nothing. Win-win! ⭐*
