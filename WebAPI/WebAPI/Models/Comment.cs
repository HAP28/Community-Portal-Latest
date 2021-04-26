using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Comment
    {
        [Key]
        [Column("Comment_Id")]
        public int Comment_id { get; set; }
        [Required]
        [Column("Comment_Text")]
        public string Comment_text { get; set; }
        [Required]
        [ForeignKey("AspNetUsers")]
        [Column("User_Id")]
        public string Id { get; set; }
        [Required]
        [ForeignKey("ArticleMaster")]
        [Column("Article_Id")]
        public int ArticleId { get; set; }
    }
}
