using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("ExternalSignatureRequests", Schema = "softsign")]
public class SoftSignExternalSignatureRequest : BaseEntity
{
    public Guid DocumentId { get; set; }

    public Guid? SignatureZoneId { get; set; }

    public Guid? BeneficiaryId { get; set; }

    public Guid RequestedByUserId { get; set; }

    [Required]
    [MaxLength(180)]
    public string SignerFullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(180)]
    public string SignerEmail { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? SignerPhone { get; set; }

    [MaxLength(80)]
    public string? SignerTaxIdentifier { get; set; }

    [Required]
    [MaxLength(256)]
    public string TokenHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string TokenSalt { get; set; } = string.Empty;

    public SoftSignExternalSignatureStatus Status { get; set; } = SoftSignExternalSignatureStatus.Pending;

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime? LastOpenedAtUtc { get; set; }

    public DateTime? SignedAtUtc { get; set; }

    public DateTime? CancelledAtUtc { get; set; }

    public DateTime? ReactivatedAtUtc { get; set; }

    [MaxLength(1000)]
    public string? Message { get; set; }

    [MaxLength(80)]
    public string? LastIpAddress { get; set; }

    [MaxLength(500)]
    public string? LastUserAgent { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument Document { get; set; } = default!;

    public virtual SoftSignSignatureZone? SignatureZone { get; set; }

    public virtual ICollection<SoftSignExternalSignatureAction> Actions { get; set; } = new List<SoftSignExternalSignatureAction>();

    public virtual ICollection<SoftSignOtpChallenge> OtpChallenges { get; set; } = new List<SoftSignOtpChallenge>();
}
