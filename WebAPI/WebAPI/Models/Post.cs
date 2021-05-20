using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class Post
    {
        [Key]
        public long PostId { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Text { get; set; }
        public DateTime PostedOn { get; set; }
        [Required]
        [ForeignKey("CategoryMaster")]
        public short CategoryId { get; set; }

        [Required]
        [ForeignKey("AspNetUsers")]
        [Column(TypeName = "nvarchar(450)")]
        public string Id { get; set; }
        public CategoryMaster Category { get; set; }
        public ApplicationUser AspNetUsers { get; set; }

       
    }
}
