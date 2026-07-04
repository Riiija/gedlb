using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("DocumentSteps", Schema = "softsign")]
public class SoftSignDocumentWorkflowStep : BaseEntity
{
    public Guid DocumentId { get; set; }

    public Guid WorkflowStepModelId { get; set; }

    public int StepOrder { get; set; }

    [Required]
    [MaxLength(160)]
    public string Name { get; set; } = string.Empty;

    public SoftSignActionType ActionType { get; set; }

    public SoftSignWorkflowStepStatus Status { get; set; } = SoftSignWorkflowStepStatus.Pending;

    [MaxLength(80)]
    public string? AssignedRoleCode { get; set; }

    public Guid? AssignedUserId { get; set; }

    public Guid? AssignedBeneficiaryId { get; set; }

    public Guid? EffectiveUserId { get; set; }

    public Guid? DelegationId { get; set; }

    public DateTime? ActivatedAtUtc { get; set; }

    public DateTime? DueAtUtc { get; set; }

    public DateTime? CompletedAtUtc { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    [MaxLength(1000)]
    public string? RejectionReason { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument Document { get; set; } = default!;

    public virtual SoftSignWorkflowStepModel WorkflowStepModel { get; set; } = default!;

    public virtual SoftSignDelegation? Delegation { get; set; }

    public virtual ICollection<SoftSignDocumentAction> Actions { get; set; } = new List<SoftSignDocumentAction>();
}
