using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("WorkflowSteps", Schema = "softsign")]
public class SoftSignWorkflowStepModel : BaseEntity
{
    public Guid WorkflowModelId { get; set; }

    public int StepOrder { get; set; }

    [Required]
    [MaxLength(160)]
    public string Name { get; set; } = string.Empty;

    public SoftSignActionType ActionType { get; set; }

    public SoftSignWorkflowAssignmentType AssignmentType { get; set; }

    [MaxLength(80)]
    public string? AssignedRoleCode { get; set; }

    public Guid? AssignedUserId { get; set; }

    public Guid? AssignedBeneficiaryId { get; set; }

    public bool IsParallel { get; set; }

    [MaxLength(50)]
    public string? ParallelGroupCode { get; set; }

    public bool IsOtpRequired { get; set; }

    public bool AllowsExternalSignature { get; set; }

    public bool RequiresSignatureZone { get; set; }

    public int? DeadlineDays { get; set; }

    [MaxLength(1000)]
    public string? Instructions { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignWorkflowModel WorkflowModel { get; set; } = default!;

    public virtual ICollection<SoftSignWorkflowCondition> Conditions { get; set; } = new List<SoftSignWorkflowCondition>();
}
