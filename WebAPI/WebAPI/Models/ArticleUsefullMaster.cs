using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class ArticleUsefullMaster
    {
        [Key]
        public int id { get; set; }
        [Required]
        public int article_id { get; set; }
        [Required]
        public string user_id { get; set; }
        [Required]
        public bool likes { get; set; }
        [Required]
        public bool dislikes { get; set; }
    }
}
