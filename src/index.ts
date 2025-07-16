import path from 'node:path';

import { defineHook } from '@directus/extensions-sdk';
import fs from 'fs-extra';

interface EmailSendInput {
	template: {
		name: string;
	};
	to?: string;
	subject?: string;
}

const SUPPORTED_TEMPLATES = new Set([
	'password-reset',
	'user-invitation',
	'user-registration',
]);

export default defineHook(async ({ filter }, context) => {
	const { logger, getSchema, services, env } = context;
	const schema = await getSchema();
	const accountability = { admin: true };

	filter<EmailSendInput>('email.send', async (input) => {
		try {
			const templateName = input.template.name;

			// Early return if template not supported
			if (!templateName || !SUPPORTED_TEMPLATES.has(templateName)) {
				logger.debug(
					`Template "${templateName}" is not supported for localization`,
				);
				return input;
			}

			// Only create services we actually need
			const settingsService = new services.SettingsService({
				schema,
				accountability,
			});
			const usersService = new services.UsersService({
				schema,
				accountability,
			});
			const translationsService = new services.TranslationsService({
				schema,
				accountability,
			});

			// Parallel execution for independent queries
			const [currentSettings, userIfExists] = await Promise.all([
				settingsService.readSingleton({
					fields: ['default_language'],
				}),
				input.to
					? usersService.readByQuery({
							filter: { email: input.to },
							fields: ['email', 'language'],
							limit: 1,
						})
					: Promise.resolve([]),
			]);

			const defaultSystemLanguage =
				currentSettings.default_language?.split('-')[0] || 'en';
			const userLanguage = userIfExists[0]?.language;
			const languageToUse =
				userLanguage?.split('-')[0] || defaultSystemLanguage;
			const defaultLocaleString =
				userLanguage || currentSettings.default_language;

			// Handle template localization
			const translationKey = `${templateName}-${languageToUse}`;
			const customTemplatePath = path.resolve(
				env.EMAIL_TEMPLATES_PATH as string,
				`${translationKey}.liquid`,
			);

			if (await fs.pathExists(customTemplatePath)) {
				input.template.name = translationKey;
				logger.debug(`Using localized template: ${translationKey}`);
			}

			// Handle subject localization
			const customSubject = await translationsService.readByQuery({
				filter: {
					_and: [
						{ key: { _eq: templateName } },
						{ language: { _eq: defaultLocaleString } },
					],
				},
				fields: ['value'],
				limit: 1,
			});

			if (customSubject[0]?.value) {
				input.subject = customSubject[0].value;
			}

			return input;
		} catch (error) {
			logger.error('Error in email localization hook:', error);
			return input;
		}
	});
});
