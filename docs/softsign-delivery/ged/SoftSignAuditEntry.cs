using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("AuditEntries", Schema = "softsign")]
public class SoftSignAuditEntry : BaseEntity
{
    public Guid? DocumentId { get; set; }

    [Required]
    [MaxLength(120)]
    public string EntityName { get; set; } = string.Empty;

    public Guid? EntityId { get; set; }

    [Required]
    [MaxLength(120)]
    public string Action { get; set; } = string.Empty;

    public SoftSignAuditSeverity Severity { get; set; } = SoftSignAuditSeverity.Information;

    public Guid? ActorUserId { get; set; }

    public Guid? ActorBeneficiaryId { get; set; }

    public DateTime OccurredAtUtc { get; set; }

    [MaxLength(80)]
    public string? IpAddress { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    [MaxLength(120)]
    public string? CorrelationId { get; set; }

    public string? MetadataJson { get; set; }

    public virtual SoftSignDocument? Document { get; set; }
}
