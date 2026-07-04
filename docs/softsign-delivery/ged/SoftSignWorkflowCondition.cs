using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("WorkflowConditions", Schema = "softsign")]
public class SoftSignWorkflowCondition : BaseEntity
{
    public Guid WorkflowModelId { get; set; }

    public Guid? WorkflowStepModelId { get; set; }

    [Required]
    [MaxLength(80)]
    public string FieldName { get; set; } = string.Empty;

    public SoftSignWorkflowConditionOperator Operator { get; set; }

    [Required]
    [MaxLength(500)]
    public string Value { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? SecondValue { get; set; }

    [MaxLength(50)]
    public string? DataType { get; set; }

    [MaxLength(50)]
    public string? GroupCode { get; set; }

    public int DisplayOrder { get; set; }

    public virtual SoftSignWorkflowModel WorkflowModel { get; set; } = default!;

    public virtual SoftSignWorkflowStepModel? WorkflowStepModel { get; set; }
}
