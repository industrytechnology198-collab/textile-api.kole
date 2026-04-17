import { IsIn } from 'class-validator';

const SUPPORTED_LANGUAGES = ['fr', 'en', 'de', 'nl'] as const;

export class UpdateMeLanguageDto {
  @IsIn(SUPPORTED_LANGUAGES, {
    message: `preferredLanguage must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
  })
  preferredLanguage!: string;
}
