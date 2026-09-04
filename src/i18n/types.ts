export interface TranslationDict {
  // Navigation & Header
  appTitle: string;
  appSubtitle: string;
  navDashboard: string;
  navBeneficiaries: string;
  navTransactions: string;
  navSecurityAudit: string;
  langSelect: string;
  largeText: string;
  normalText: string;
  statusProtected: string;
  statusElevated: string;
  statusHighRisk: string;
  logoutBtn: string;

  // Authentication & Login
  loginTitle: string;
  loginSubtitle: string;
  customerIdLabel: string;
  customerIdPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginBtn: string;
  demoAutoLoginBtn: string;
  demoCredentialsBadge: string;
  rbiCompliantSecurity: string;
  aiPoweredFraudPrevention: string;
  adaptiveCoercionShield: string;

  // Overview & Account Card
  accountOverviewTitle: string;
  availableBalance: string;
  monthlyCredit: string;
  monthlyDebit: string;
  recentTransactionsTitle: string;
  viewAll: string;
  noTransactions: string;
  statusSuccess: string;
  statusPending: string;
  statusFailed: string;
  sendMoneyCta: string;

  // Payees & Beneficiaries
  beneficiariesTitle: string;
  beneficiariesDesc: string;
  addPayeeBtn: string;
  noBeneficiaries: string;
  rbiVerifiedBadge: string;
  rbiVerifiedDesc: string;
  addPayeeModalTitle: string;
  addPayeeModalSub: string;
  accountNumberLabel: string;
  accountNumberPlaceholder: string;
  ifscCodeLabel: string;
  ifscCodePlaceholder: string;
  beneficiaryNameLabel: string;
  beneficiaryNamePlaceholder: string;
  verifyAndAddBtn: string;
  verifyingBtn: string;
  saveBeneficiaryBtn: string;
  cancelBtn: string;

  // Transfer Modal
  transferModalTitle: string;

  enterAmountStep: string;
  amountPlaceholder: string;
  continueSecurityCheck: string;
  evaluatingSecurity: string;
  evaluatingSubtext: string;
  paymentSuccessTitle: string;
  paymentSuccessSubtext: string;
  doneBtn: string;

  // Risk Flows
  lowRiskTitle: string;
  lowRiskBanner: string;
  lowRiskScoreLabel: string;
  payingTo: string;
  amountToPay: string;
  confirmTransferBtn: string;
  protectedByTrustFlow: string;

  mediumRiskTitle: string;
  mediumRiskHeading: string;
  mediumRiskSubheading: string;
  mediumRiskFlagsTitle: string;
  riskScoreLabel: string;
  confirmKnowRecipientBtn: string;
  cancelTransactionBtn: string;

  // High Risk & Verification Flows
  highRiskWarningTitle: string;
  highRiskWarningHeading: string;
  highRiskWarningSubheading: string;
  detectedRiskFlagsTitle: string;
  chooseVerificationMethodTitle: string;
  chooseVerificationMethodSub: string;

  optionATitle: string;
  optionASubtitle: string;
  optionBTitle: string;
  optionBSubtitle: string;

  // Security Questions (Option A)
  securityQuestionsTitle: string;
  securityQuestionsDesc: string;
  q1Label: string;
  q1Placeholder: string;
  q2Label: string;
  q2Placeholder: string;
  q3Label: string;
  q3Placeholder: string;
  submitSecurityAnswersBtn: string;
  answersValidatedMsg: string;
  proceedAfterVerificationBtn: string;

  // Nominee Notification (Option B)
  nomineeAlertTitle: string;
  nomineeAlertDesc: string;
  sendNomineeAlertBtn: string;
  sendingAlertBtn: string;
  smsPreviewTitle: string;
  smsSender: string;
  smsBodyTemplate: string;
  notificationSentStatus: string;
  waitingNomineeApproval: string;
  nomineeApprovedMsg: string;
  proceedWithTransferBtn: string;

  // Locked Nominee Profile Security Features
  requestApprovalFromSavedNomineeBtn: string;
  waitingNomineeResponse: string;
  lockedNomineeProfileTitle: string;
  lockedNomineeProfileSub: string;
  nomineeLockedBadge: string;
  nomineeSecurityNotice: string;
  lockedSmsBody: string;

  // New Context & Security Queries
  contextQueriesTitle: string;
  contextQueriesSub: string;
  contextQ1: string;
  contextQ2: string;
  contextQ3: string;
  securityCityQ: string;
  securitySchoolQ: string;
  yesLabel: string;
  noLabel: string;
  warningUrgencyDetected: string;
  warningImpersonationDetected: string;
  warningSecrecyDetected: string;
  methodATitle: string;
  methodASubtitle: string;
  methodBTitle: string;
  methodBSubtitle: string;
  recipientInputLabel: string;
  recipientInputPlaceholder: string;
  sendingRealAlert: string;
  alertDeliveredBadge: string;
  realAlertMessageContent: string;

  // Onboarding
  onboardingWelcomeTitle: string;
  onboardingWelcomeSub: string;
  onboardingDesc: string;
  setupNomineeBtn: string;
  skipOnboardingBtn: string;
  nomineeSetupTitle: string;
  nomineeSetupSub: string;
  nomineeNameLabel: string;
  nomineeNamePlaceholder: string;
  nomineePhoneLabel: string;
  nomineeRelationLabel: string;
  saveNomineeBtn: string;

  // Live Security Activity Log (Desktop Panel)
  securityLogTitle: string;
  securityLogSubtitle: string;
  liveShieldActive: string;
  emptyLog: string;
  riskGaugeTitle: string;
  riskGaugeSafe: string;
  riskGaugeElevated: string;
  riskGaugeCritical: string;
  activeThresholdsTitle: string;
  thresholdLow: string;
  thresholdMed: string;
  thresholdHigh: string;

  // Dev Simulator
  devSimulatorTitle: string;
  forceRiskLabel: string;
  autoMode: string;
  allEvalsForcedTo: string;
}
