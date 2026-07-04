using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("SignatureProfiles", Schema = "softsign")]
public class SoftSignSignatureProfile : BaseEntity
{
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(160)]
    public string DisplayName { get; set; } = string.Empty;

    public SoftSignSignatureProfileType ProfileType { get; set; }

    [MaxLength(500)]
    public string? TextValue { get; set; }

    public Guid? ImageFileId { get; set; }

    [MaxLength(128)]
    public string? SignatureHashSha256 { get; set; }

    public bool IsDefault { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? LastUsedAtUtc { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public virtual SoftSignDocumentFile? ImageFile { get; set; }
}
