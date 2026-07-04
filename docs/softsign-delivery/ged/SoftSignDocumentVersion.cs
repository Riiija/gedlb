using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("DocumentVersions", Schema = "softsign")]
public class SoftSignDocumentVersion : BaseEntity
{
    public Guid DocumentId { get; set; }

    public Guid DocumentFileId { get; set; }

    public int VersionNumber { get; set; }

    public SoftSignDocumentVersionType VersionType { get; set; }

    public Guid CreatedByUserId { get; set; }

    public bool IsCurrent { get; set; }

    [MaxLength(128)]
    public string HashSha256 { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Notes { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument Document { get; set; } = default!;

    public virtual SoftSignDocumentFile DocumentFile { get; set; } = default!;
}
