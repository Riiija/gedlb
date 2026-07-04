using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("OtpChallenges", Schema = "softsign")]
public class SoftSignOtpChallenge : BaseEntity
{
    public Guid? ExternalSignatureRequestId { get; set; }

    public Guid? DocumentActionId { get; set; }

    public Guid? UserId { get; set; }

    public Guid? BeneficiaryId { get; set; }

    public SoftSignOtpPurpose Purpose { get; set; }

    public SoftSignOtpChannel Channel { get; set; }

    public SoftSignOtpStatus Status { get; set; } = SoftSignOtpStatus.Pending;

    [Required]
    [MaxLength(256)]
    public string CodeHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string CodeSalt { get; set; } = string.Empty;

    [Required]
    [MaxLength(180)]
    public string DestinationMasked { get; set; } = string.Empty;

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime? VerifiedAtUtc { get; set; }

    public int FailedAttempts { get; set; }

    public int MaxAttempts { get; set; } = 3;

    public int GenerationCount { get; set; } = 1;

    public DateTime? LastSentAtUtc { get; set; }

    [MaxLength(80)]
    public string? LastIpAddress { get; set; }

    public virtual SoftSignExternalSignatureRequest? ExternalSignatureRequest { get; set; }

    public virtual SoftSignDocumentAction? DocumentAction { get; set; }
}
