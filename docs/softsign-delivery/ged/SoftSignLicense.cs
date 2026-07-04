using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("Licenses", Schema = "softsign")]
public class SoftSignLicense : BaseEntity
{
    [Required]
    [MaxLength(120)]
    public string LicenseKey { get; set; } = string.Empty;

    [Required]
    [MaxLength(180)]
    public string HolderName { get; set; } = string.Empty;

    public DateTime ValidFromUtc { get; set; }

    public DateTime ValidToUtc { get; set; }

    public bool IsActive { get; set; } = true;

    public int? MaxInternalUsers { get; set; }

    public int? MaxExternalAccounts { get; set; }

    public int? MaxDocumentsPerMonth { get; set; }

    public int? MaxExternalSignaturesPerMonth { get; set; }

    public long? MaxStorageBytes { get; set; }

    [MaxLength(256)]
    public string? SignatureHash { get; set; }

    public string? MetadataJson { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
