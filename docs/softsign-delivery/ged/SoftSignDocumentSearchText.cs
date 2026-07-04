using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("DocumentSearchTexts", Schema = "softsign")]
public class SoftSignDocumentSearchText : BaseEntity
{
    public Guid DocumentId { get; set; }

    public Guid? DocumentFileId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Source { get; set; } = "Metadata";

    [MaxLength(10)]
    public string? LanguageCode { get; set; }

    public int? PageNumber { get; set; }

    [Required]
    public string TextContent { get; set; } = string.Empty;

    [Column(TypeName = "decimal(5,2)")]
    public decimal? ConfidenceScore { get; set; }

    [MaxLength(100)]
    public string? OcrEngine { get; set; }

    public bool IsIndexed { get; set; }

    public DateTime? IndexedAtUtc { get; set; }

    public virtual SoftSignDocument Document { get; set; } = default!;

    public virtual SoftSignDocumentFile? DocumentFile { get; set; }
}
