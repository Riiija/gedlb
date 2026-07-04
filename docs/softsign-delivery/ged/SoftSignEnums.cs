namespace SoftAppli.Modules.SoftSign.Domain.Entities;

public enum SoftSignDocumentStatus
{
    Draft = 0,
    Initiated = 1,
    Received = 2,
    PendingProcessing = 3,
    InProgress = 4,
    PendingExternalSignature = 5,
    SignedByThirdParty = 6,
    Signed = 7,
    Completed = 8,
    Rejected = 9,
    Archived = 10,
    Cancelled = 11
}

public enum SoftSignWorkflowStepStatus
{
    Pending = 0,
    Active = 1,
    Done = 2,
    Rejected = 3,
    Skipped = 4,
    Expired = 5
}

public enum SoftSignActionType
{
    Revision = 0,
    Validation = 1,
    Paraphe = 2,
    Signature = 3,
    Rejection = 4,
    Archiving = 5,
    ExternalSignature = 6
}

public enum SoftSignDocumentActionResult
{
    Pending = 0,
    Succeeded = 1,
    Failed = 2,
    Cancelled = 3
}

public enum SoftSignFileKind
{
    Original = 0,
    OcrPdf = 1,
    SignedPdf = 2,
    Annex = 3,
    CertificatePdf = 4,
    Export = 5
}

public enum SoftSignFileProcessingStatus
{
    None = 0,
    Pending = 1,
    Running = 2,
    Succeeded = 3,
    Failed = 4
}

public enum SoftSignDocumentVersionType
{
    Original = 0,
    Ocrized = 1,
    Signed = 2,
    Archived = 3,
    Corrected = 4
}

public enum SoftSignWorkflowAssignmentType
{
    User = 0,
    Role = 1,
    Beneficiary = 2,
    DynamicRule = 3
}

public enum SoftSignWorkflowConditionOperator
{
    Equals = 0,
    NotEquals = 1,
    GreaterThan = 2,
    GreaterThanOrEquals = 3,
    LessThan = 4,
    LessThanOrEquals = 5,
    Contains = 6,
    In = 7,
    Between = 8
}

public enum SoftSignSignatureZoneType
{
    Signature = 0,
    Paraphe = 1,
    Visa = 2,
    Stamp = 3
}

public enum SoftSignSignatureProfileType
{
    Text = 0,
    Drawn = 1,
    Image = 2,
    Certificate = 3
}

public enum SoftSignExternalAccountStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Suspended = 3
}

public enum SoftSignExternalSignatureStatus
{
    Pending = 0,
    OtpSent = 1,
    OtpVerified = 2,
    Signed = 3,
    Expired = 4,
    Cancelled = 5,
    ReactivationRequested = 6,
    Reactivated = 7
}

public enum SoftSignExternalSignatureActionKind
{
    Created = 0,
    LinkOpened = 1,
    OtpSent = 2,
    OtpVerified = 3,
    OtpFailed = 4,
    Signed = 5,
    Expired = 6,
    Cancelled = 7,
    ReactivationRequested = 8,
    Reactivated = 9
}

public enum SoftSignOtpPurpose
{
    InternalSignature = 0,
    ExternalSignature = 1,
    ExternalLinkVerification = 2,
    AccountApproval = 3
}

public enum SoftSignOtpChannel
{
    Email = 0,
    Sms = 1
}

public enum SoftSignOtpStatus
{
    Pending = 0,
    Verified = 1,
    Failed = 2,
    Expired = 3,
    Locked = 4,
    Cancelled = 5
}

public enum SoftSignReminderType
{
    Manual = 0,
    Automatic = 1,
    Escalation = 2
}

public enum SoftSignReminderStatus
{
    Scheduled = 0,
    Sent = 1,
    Failed = 2,
    Cancelled = 3
}

public enum SoftSignNotificationType
{
    DocumentDeposited = 0,
    WorkflowStepActivated = 1,
    ValidationRequested = 2,
    SignatureRequested = 3,
    ExternalSignatureRequested = 4,
    Reminder = 5,
    Rejected = 6,
    Completed = 7,
    CertificateGenerated = 8,
    System = 9
}

public enum SoftSignAuditSeverity
{
    Information = 0,
    Warning = 1,
    Security = 2,
    Error = 3
}

public enum SoftSignCertificateStatus
{
    Draft = 0,
    Issued = 1,
    Revoked = 2,
    Archived = 3
}
