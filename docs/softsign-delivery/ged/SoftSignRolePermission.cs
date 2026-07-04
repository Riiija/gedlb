using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftAppli.Modules.SoftSign.Domain.Entities;

[Table("RolePermissions", Schema = "softsign")]
public class SoftSignRolePermission : BaseEntity
{
    [Required]
    [MaxLength(80)]
    public string RoleCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string PermissionCode { get; set; } = string.Empty;

    [MaxLength(120)]
    public string? MenuCode { get; set; }

    [MaxLength(120)]
    public string? ActionCode { get; set; }

    [MaxLength(50)]
    public string? ProjectCode { get; set; }

    [MaxLength(50)]
    public string? SiteCode { get; set; }

    public bool IsAllowed { get; set; } = true;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Timestamp]
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
