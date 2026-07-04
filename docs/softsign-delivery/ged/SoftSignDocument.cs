using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("Documents", Schema = "softsign")]
public class SoftSignDocument : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Reference { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string DocumentTypeCode { get; set; } = string.Empty;

    public SoftSignDocumentStatus Status { get; set; } = SoftSignDocumentStatus.Draft;

    public Guid DepositedByUserId { get; set; }

    public Guid? CurrentAssignedUserId { get; set; }

    public Guid? BeneficiaryId { get; set; }

    [MaxLength(50)]
    public string? ProjectCode { get; set; }

    [MaxLength(50)]
    public string? SiteCode { get; set; }

    [MaxLength(20)]
    public string? PriorityCode { get; set; }

    public DateTime? DocumentDate { get; set; }

    public DateTime? DueDateUtc { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? AmountExcludingTax { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? AmountIncludingTax { get; set; }

    [MaxLength(3)]
    public string? CurrencyCode { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    public Guid? WorkflowModelId { get; set; }

    public int? WorkflowVersion { get; set; }

    public DateTime? WorkflowStartedAtUtc { get; set; }

    public DateTime? CompletedAtUtc { get; set; }

    public DateTime? ArchivedAtUtc { get; set; }

    [MaxLength(128)]
    public string? CurrentDocumentHashSha256 { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignWorkflowModel? WorkflowModel { get; set; }

    public virtual ICollection<SoftSignDocumentFile> Files { get; set; } = new List<SoftSignDocumentFile>();

    public virtual ICollection<SoftSignDocumentAnnex> Annexes { get; set; } = new List<SoftSignDocumentAnnex>();

    public virtual ICollection<SoftSignDocumentVersion> Versions { get; set; } = new List<SoftSignDocumentVersion>();

    public virtual ICollection<SoftSignDocumentSearchText> SearchTexts { get; set; } = new List<SoftSignDocumentSearchText>();

    public virtual ICollection<SoftSignDocumentWorkflowStep> Steps { get; set; } = new List<SoftSignDocumentWorkflowStep>();

    public virtual ICollection<SoftSignDocumentAction> Actions { get; set; } = new List<SoftSignDocumentAction>();

    public virtual ICollection<SoftSignSignatureZone> SignatureZones { get; set; } = new List<SoftSignSignatureZone>();

    public virtual ICollection<SoftSignExternalSignatureRequest> ExternalSignatureRequests { get; set; } = new List<SoftSignExternalSignatureRequest>();

    public virtual ICollection<SoftSignReminder> Reminders { get; set; } = new List<SoftSignReminder>();

    public virtual ICollection<SoftSignNotification> Notifications { get; set; } = new List<SoftSignNotification>();

    public virtual ICollection<SoftSignAuditEntry> AuditEntries { get; set; } = new List<SoftSignAuditEntry>();

    public virtual ICollection<SoftSignCertificate> Certificates { get; set; } = new List<SoftSignCertificate>();
}
