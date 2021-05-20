using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class CategoryMaster
    {
        [Key]
        [Column("Category_Id")]
        public int CategoryId { get; set; }
        [Required]
        [Column("Category_Name")]
        public string CategoryName { get; set; }
        [Required]
        [Column("Category_Description")]
        public string CategoryDescription { get; set; }
        [Required]
        [ForeignKey("AspNetUsers")]
        [Column("User_Id")]
        public string Id { get; set; }
        [Required]
        [ForeignKey("ProductMaster")]
        [Column("Product_Id")]
        public int ProductId { get; set; }
    }
}
