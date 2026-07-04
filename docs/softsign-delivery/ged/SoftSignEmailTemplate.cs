using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("EmailTemplates", Schema = "softsign")]
public class SoftSignEmailTemplate : BaseEntity
{
    [Required]
    [MaxLength(80)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(180)]
    public string Name { get; set; } = string.Empty;

    public int Version { get; set; } = 1;

    public bool IsActive { get; set; } = true;

    [Required]
    [MaxLength(250)]
    public string Subject { get; set; } = string.Empty;

    public string BodyHtml { get; set; } = string.Empty;

    public string? BodyText { get; set; }

    public string? VariablesJson { get; set; }

    [MaxLength(50)]
    public string? LanguageCode { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
