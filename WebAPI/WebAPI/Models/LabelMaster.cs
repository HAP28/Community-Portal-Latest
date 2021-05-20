using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class LabelMaster
    {
        [Key]
        [Column("Label_Id")]
        public int LabelId { get; set; }
        [Required]
        [Column("Label_Name")]
        public string LabelName { get; set; }
    }
}