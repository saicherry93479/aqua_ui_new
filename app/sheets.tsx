import ConnectActionSheet from '@/components/action-sheets/connectsheet';
import { InstallationFormActionSheet } from '@/components/action-sheets/InstallationFormActionSheet';
import OnboardingActionSheet from '@/components/action-sheets/OnboardingActionSheet';
import { ServiceRequestActionSheet } from '@/components/action-sheets/ServiceRequestActionSheet';
import { CancelSubscriptionActionSheet } from '@/components/action-sheets/CancelSubscriptionActionSheet';
import { registerSheet } from 'react-native-actions-sheet';

export const SHEET_IDS = {
    ENQUIRY_SHEET: 'enquiry-sheet',
    CONNECT_SHEET: 'connect-sheet',
    ONBOARDING_SHEET: 'onboarding-sheet',
    SERVICE_REQUEST_SHEET: 'service-request-sheet',
    CANCEL_SUBSCRIPTION_SHEET: 'cancel-subscription-sheet'

} as const;

registerSheet(SHEET_IDS.ENQUIRY_SHEET, InstallationFormActionSheet);
registerSheet(SHEET_IDS.CONNECT_SHEET, ConnectActionSheet)
registerSheet(SHEET_IDS.ONBOARDING_SHEET, OnboardingActionSheet,)
registerSheet(SHEET_IDS.SERVICE_REQUEST_SHEET, ServiceRequestActionSheet)
registerSheet(SHEET_IDS.CANCEL_SUBSCRIPTION_SHEET, CancelSubscriptionActionSheet)


// Export the sheet IDs for type safety


// export type SheetId = typeof SHEET_IDS[keyof typeof SHEET_IDS];

export type SheetId = typeof SHEET_IDS[keyof typeof SHEET_IDS];

