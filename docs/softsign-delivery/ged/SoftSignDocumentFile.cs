using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("DocumentFiles", Schema = "softsign")]
public class SoftSignDocumentFile : BaseEntity
{
    public Guid DocumentId { get; set; }

    public SoftSignFileKind FileKind { get; set; }

    [Required]
    [MaxLength(260)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string ContentType { get; set; } = "application/pdf";

    [MaxLength(20)]
    public string? Extension { get; set; }

    public long SizeInBytes { get; set; }

    [Required]
    [MaxLength(128)]
    public string HashSha256 { get; set; } = string.Empty;

    [MaxLength(50)]
    public string StorageProvider { get; set; } = "SqlServerFileStream";

    public Guid FileStreamId { get; set; }

    public byte[]? Content { get; set; }

    public int VersionNumber { get; set; } = 1;

    public bool IsCurrent { get; set; }

    public SoftSignFileProcessingStatus OcrStatus { get; set; } = SoftSignFileProcessingStatus.None;

    public DateTime? OcrCompletedAtUtc { get; set; }

    [MaxLength(1000)]
    public string? ProcessingError { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocument Document { get; set; } = default!;
}
