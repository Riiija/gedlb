using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("ExternalSignatureActions", Schema = "softsign")]
public class SoftSignExternalSignatureAction : BaseEntity
{
    public Guid ExternalSignatureRequestId { get; set; }

    public SoftSignExternalSignatureActionKind ActionKind { get; set; }

    public SoftSignExternalSignatureStatus? StatusBefore { get; set; }

    public SoftSignExternalSignatureStatus? StatusAfter { get; set; }

    public DateTime OccurredAtUtc { get; set; }

    [MaxLength(80)]
    public string? IpAddress { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    public virtual SoftSignExternalSignatureRequest ExternalSignatureRequest { get; set; } = default!;
}
