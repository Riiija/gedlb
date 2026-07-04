using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("ExternalAccounts", Schema = "softsign")]
public class SoftSignExternalAccount : BaseEntity
{
    public Guid BeneficiaryId { get; set; }

    public SoftSignExternalAccountStatus Status { get; set; } = SoftSignExternalAccountStatus.Pending;

    [Required]
    [MaxLength(180)]
    public string ContactName { get; set; } = string.Empty;

    [Required]
    [MaxLength(180)]
    public string ContactEmail { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? ContactPhone { get; set; }

    [MaxLength(80)]
    public string? TaxIdentifier { get; set; }

    [MaxLength(500)]
    public string? AllowedModulesCsv { get; set; }

    public Guid? ApprovedByUserId { get; set; }

    public DateTime? ApprovedAtUtc { get; set; }

    public Guid? RejectedByUserId { get; set; }

    public DateTime? RejectedAtUtc { get; set; }

    [MaxLength(1000)]
    public string? RejectionReason { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
