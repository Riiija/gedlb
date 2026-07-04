using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("DocumentAnnexes", Schema = "softsign")]
public class SoftSignDocumentAnnex : BaseEntity
{
    public Guid DocumentId { get; set; }

    public Guid DocumentFileId { get; set; }

    [Required]
    [MaxLength(150)]
    public string AnnexTypeCode { get; set; } = string.Empty;

    [MaxLength(250)]
    public string? Title { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsRequired { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument Document { get; set; } = default!;

    public virtual SoftSignDocumentFile DocumentFile { get; set; } = default!;
}
