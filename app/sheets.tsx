import ConnectActionSheet from '@/components/action-sheets/connectsheet';
import { InstallationFormActionSheet } from '@/components/action-sheets/InstallationFormActionSheet';
import OnboardingActionSheet from '@/components/action-sheets/OnboardingActionSheet';
import { registerSheet } from 'react-native-actions-sheet';

export const SHEET_IDS = {
    ENQUIRY_SHEET: 'enquiry-sheet',
    CONNECT_SHEET: 'connect-sheet',
    ONBOARDING_SHEET: 'onboarding-sheet'

} as const;

registerSheet(SHEET_IDS.ENQUIRY_SHEET, InstallationFormActionSheet);
registerSheet(SHEET_IDS.CONNECT_SHEET, ConnectActionSheet)
registerSheet(SHEET_IDS.ONBOARDING_SHEET, OnboardingActionSheet,)


// Export the sheet IDs for type safety


// export type SheetId = typeof SHEET_IDS[keyof typeof SHEET_IDS];

export type SheetId = typeof SHEET_IDS[keyof typeof SHEET_IDS];

