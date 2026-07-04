using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("DocumentActions", Schema = "softsign")]
public class SoftSignDocumentAction : BaseEntity
{
    public Guid DocumentId { get; set; }

    public Guid? DocumentWorkflowStepId { get; set; }

    public SoftSignActionType ActionType { get; set; }

    public SoftSignDocumentActionResult Result { get; set; } = SoftSignDocumentActionResult.Pending;

    public Guid? ActorUserId { get; set; }

    public Guid? ActorBeneficiaryId { get; set; }

    public SoftSignDocumentStatus? StatusBefore { get; set; }

    public SoftSignDocumentStatus? StatusAfter { get; set; }

    public Guid? SignatureProfileId { get; set; }

    public Guid? SignatureZoneId { get; set; }

    public Guid? OtpChallengeId { get; set; }

    public Guid? ExternalSignatureRequestId { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    [MaxLength(1000)]
    public string? RejectionReason { get; set; }

    public DateTime ActionAtUtc { get; set; }

    [MaxLength(80)]
    public string? IpAddress { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument Document { get; set; } = default!;

    public virtual SoftSignDocumentWorkflowStep? DocumentWorkflowStep { get; set; }

    public virtual SoftSignSignatureProfile? SignatureProfile { get; set; }

    public virtual SoftSignSignatureZone? SignatureZone { get; set; }

    public virtual SoftSignOtpChallenge? OtpChallenge { get; set; }

    public virtual SoftSignExternalSignatureRequest? ExternalSignatureRequest { get; set; }
}
