using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("Delegations", Schema = "softsign")]
public class SoftSignDelegation : BaseEntity
{
    public Guid DelegatorUserId { get; set; }

    public Guid DelegateUserId { get; set; }

    public DateTime ValidFromUtc { get; set; }

    public DateTime ValidToUtc { get; set; }

    public bool IsActive { get; set; } = true;

    [MaxLength(50)]
    public string? DocumentTypeCode { get; set; }

    [MaxLength(50)]
    public string? ProjectCode { get; set; }

    [MaxLength(50)]
    public string? SiteCode { get; set; }

    [MaxLength(500)]
    public string? ActionTypesCsv { get; set; }

    [MaxLength(1000)]
    public string? Reason { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual ICollection<SoftSignDocumentWorkflowStep> AppliedSteps { get; set; } = new List<SoftSignDocumentWorkflowStep>();
}
