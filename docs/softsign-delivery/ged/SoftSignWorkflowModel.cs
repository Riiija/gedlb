using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("WorkflowModels", Schema = "softsign")]
public class SoftSignWorkflowModel : BaseEntity
{
    [Required]
    [MaxLength(80)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(180)]
    public string Name { get; set; } = string.Empty;

    public int Version { get; set; } = 1;

    public bool IsActive { get; set; }

    public bool IsDefault { get; set; }

    [MaxLength(50)]
    public string? DocumentTypeCode { get; set; }

    [MaxLength(50)]
    public string? ProjectCode { get; set; }

    [MaxLength(50)]
    public string? SiteCode { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? MinimumAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? MaximumAmount { get; set; }

    [MaxLength(3)]
    public string? CurrencyCode { get; set; }

    public DateTime? EffectiveFromUtc { get; set; }

    public DateTime? EffectiveToUtc { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual ICollection<SoftSignWorkflowStepModel> Steps { get; set; } = new List<SoftSignWorkflowStepModel>();

    public virtual ICollection<SoftSignWorkflowCondition> Conditions { get; set; } = new List<SoftSignWorkflowCondition>();

    public virtual ICollection<SoftSignDocument> Documents { get; set; } = new List<SoftSignDocument>();
}
