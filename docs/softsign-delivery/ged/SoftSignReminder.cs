using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("Reminders", Schema = "softsign")]
public class SoftSignReminder : BaseEntity
{
    public Guid DocumentId { get; set; }

    public Guid? DocumentWorkflowStepId { get; set; }

    public Guid? RecipientUserId { get; set; }

    public Guid? RecipientBeneficiaryId { get; set; }

    public Guid? EmailTemplateId { get; set; }

    public SoftSignReminderType ReminderType { get; set; }

    public SoftSignReminderStatus Status { get; set; } = SoftSignReminderStatus.Scheduled;

    public DateTime ScheduledAtUtc { get; set; }

    public DateTime? SentAtUtc { get; set; }

    public DateTime? NextRetryAtUtc { get; set; }

    public int AttemptCount { get; set; }

    [MaxLength(250)]
    public string? Subject { get; set; }

    [MaxLength(1000)]
    public string? ErrorMessage { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument Document { get; set; } = default!;

    public virtual SoftSignDocumentWorkflowStep? DocumentWorkflowStep { get; set; }

    public virtual SoftSignEmailTemplate? EmailTemplate { get; set; }
}
