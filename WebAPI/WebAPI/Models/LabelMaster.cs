using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

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