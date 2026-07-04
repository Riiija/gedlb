using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("Notifications", Schema = "softsign")]
public class SoftSignNotification : BaseEntity
{
    public Guid? DocumentId { get; set; }

    public Guid? DocumentWorkflowStepId { get; set; }

    public Guid? RecipientUserId { get; set; }

    public Guid? RecipientBeneficiaryId { get; set; }

    public SoftSignNotificationType NotificationType { get; set; }

    [Required]
    [MaxLength(180)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? TargetUrl { get; set; }

    public bool IsRead { get; set; }

    public DateTime? ReadAtUtc { get; set; }

    public bool IsEmailSent { get; set; }

    public DateTime? EmailSentAtUtc { get; set; }

    [MaxLength(1000)]
    public string? EmailError { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument? Document { get; set; }

    public virtual SoftSignDocumentWorkflowStep? DocumentWorkflowStep { get; set; }
}
