using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("Certificates", Schema = "softsign")]
public class SoftSignCertificate : BaseEntity
{
    public Guid DocumentId { get; set; }

    public Guid? DocumentFileId { get; set; }

    public Guid? ExternalSignatureRequestId { get; set; }

    [Required]
    [MaxLength(80)]
    public string CertificateNumber { get; set; } = string.Empty;

    public SoftSignCertificateStatus Status { get; set; } = SoftSignCertificateStatus.Draft;

    [Required]
    [MaxLength(128)]
    public string DocumentHashSha256 { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string CertificateHashSha256 { get; set; } = string.Empty;

    public DateTime IssuedAtUtc { get; set; }

    public Guid? IssuedByUserId { get; set; }

    public Guid? BeneficiaryId { get; set; }

    public string? ProofJson { get; set; }

    public string? QrPayload { get; set; }

    [MaxLength(1000)]
    public string? RevocationReason { get; set; }

    public DateTime? RevokedAtUtc { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument Document { get; set; } = default!;

    public virtual SoftSignDocumentFile? DocumentFile { get; set; }

    public virtual SoftSignExternalSignatureRequest? ExternalSignatureRequest { get; set; }
}
