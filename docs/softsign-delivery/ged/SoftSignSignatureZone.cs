using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("SignatureZones", Schema = "softsign")]
public class SoftSignSignatureZone : BaseEntity
{
    public Guid DocumentId { get; set; }

    public Guid? WorkflowStepModelId { get; set; }

    public Guid? DocumentWorkflowStepId { get; set; }

    public SoftSignSignatureZoneType ZoneType { get; set; }

    public int PageNumber { get; set; }

    [Column(TypeName = "decimal(10,4)")]
    public decimal X { get; set; }

    [Column(TypeName = "decimal(10,4)")]
    public decimal Y { get; set; }

    [Column(TypeName = "decimal(10,4)")]
    public decimal Width { get; set; }

    [Column(TypeName = "decimal(10,4)")]
    public decimal Height { get; set; }

    public bool IsRequired { get; set; } = true;

    [MaxLength(160)]
    public string? Label { get; set; }

    [MaxLength(80)]
    public string? SignerRoleCode { get; set; }

    public Guid? SignerUserId { get; set; }

    public Guid? SignerBeneficiaryId { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime? CompletedAtUtc { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument Document { get; set; } = default!;

    public virtual SoftSignWorkflowStepModel? WorkflowStepModel { get; set; }

    public virtual SoftSignDocumentWorkflowStep? DocumentWorkflowStep { get; set; }
}
