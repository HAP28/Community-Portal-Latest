using System.ComponentModel.DataAnnotations;

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
