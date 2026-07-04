using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("GeneralSettings", Schema = "softsign")]
public class SoftSignGeneralSettings : BaseEntity
{
    [Required]
    [MaxLength(120)]
    public string SettingKey { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string GroupCode { get; set; } = string.Empty;

    [Required]
    public string SettingValue { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? DataType { get; set; }

    [MaxLength(50)]
    public string? ProjectCode { get; set; }

    [MaxLength(50)]
    public string? SiteCode { get; set; }

    public bool IsEncrypted { get; set; }

    public bool IsSystem { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
