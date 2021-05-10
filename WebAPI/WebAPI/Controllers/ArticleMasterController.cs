using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using WebAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Publisher,Reviewer")]
    public class ArticleMasterController : ControllerBase
    {
        readonly private IConfiguration configuration;
        private IHostingEnvironment hostingEnv;
        public ArticleMasterController(IConfiguration _configuration, IHostingEnvironment environment)
        {
            this.configuration = _configuration;
            hostingEnv = environment;
        }
        public class FileUploadAPI
        {
            public IFormFile files { get; set; }
        }
        // GET: api/<ArticleMasterController>
        [AllowAnonymous]
        [HttpGet]
        public JsonResult Get()
        {
            try
            {
                string query = @"select * from ArticleMaster";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }

        // GET api/<ArticleMasterController>/article/5
        [AllowAnonymous]
        [HttpGet("article/{id}")]
        public JsonResult Get(int id)
        {
            try
            {
                string query = @"select * from ArticleMaster where Article_Id = '" + id + "'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }

        // GET api/<ArticleMasterController>/product/5
        [AllowAnonymous]
        [HttpGet("product/{pid}")]
        public JsonResult GetByProduct(int pid)
        {
            try
            {
                string query = @"select * from ArticleMaster where Product_Id = '" + pid + "' and Status = '" + true + "' and Visibility = '1'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }

        // GET api/<ArticleMasterController>/product/5/category/4
        [AllowAnonymous]
        [HttpGet("product/{pid}/category/{cid}")]
        public JsonResult GetByProductCategory(int pid, int cid)
        {
            try
            {
                string query = @"select * from ArticleMaster where Product_Id = '" + pid + "' and Category_Id = '" + cid + "' and Status = '" + true + "' and Visibility = '1'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }

        // GET api/<ArticleMasterController>/product/5/category/4/section/3
        [AllowAnonymous]
        [HttpGet("product/{pid}/category/{cid}/section/{sid}")]
        public JsonResult GetByProductCategorySection(int pid, int cid, int sid)
        {
            try
            {
                string query = @"select * from ArticleMaster where Product_Id = '" + pid + "' and Category_Id = '" + cid + "' and Section_Id = '" + sid + "' and Status = '" + true + "' and Visibility = '1'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }

        // GET api/<ArticleMasterController>/5
        [HttpGet("user/{uid}")]
        public JsonResult Get(string uid)
        {
            try
            {
                string query = @"select * from ArticleMaster where User_Id = '" + uid + "'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }

        // Visibility API
        [AllowAnonymous]
        [HttpGet("articlegetvisibility/{visibility}/{status}/{draft}/{archive}")]
        public JsonResult GetArticlebyvisible(string visibility, bool status, bool draft, bool archive)
        {
            try
            {
                string query = @"select * from ArticleMaster where Status='" + status + "'and Draft='" + draft + "'and Archive = '" + archive + "'and Visibility = '" + visibility + "'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }


        [AllowAnonymous]
        [HttpGet("articleget/{status}/{draft}/{archive}")]
        public JsonResult GetArticle(bool status, bool draft, bool archive)
        {
            try
            {
                string query = @"select * from ArticleMaster where Status='" + status + "' and Draft='" + draft + "'and Archive = '" + archive + "'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("articlegetforuser/{uid}/{status}/{draft}/{archive}")]
        public JsonResult GetArticleforuser(bool status, bool draft, bool archive, string uid)
        {
            try
            {
                string query = @"select * from ArticleMaster where Status='" + status + "' and Draft='" + draft + "'and Archive = '" + archive + "' and User_Id = '" + uid + "' ";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }

        // POST api/<ArticleMasterController>
        [HttpPost]
        public JsonResult Create(ArticleMaster article)
        {
            try
            {
                string query = @"insert into ArticleMaster (Article_Title,Category_Id,Section_Id,User_Id,Reviewer_Id,Product_Id,Description,Visibility,Status,CommentAllow,Draft,Archive) values
                ('" + article.ArticleTitle + "','"
                + article.CategoryId + "','"
                + article.SectionId + "','"
                + article.Id + "','"
                + article.ReviewerId + "','"
                + article.ProductId + "','"
                + article.ArticleDescription + "','"
                + article.Visible + "','"
                + article.Status + "','"
                + article.CommentAllow + "','"

                + article.Draft + "','"
                + article.Archive + "')";

                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult("Data Inserted");
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }
        [AllowAnonymous]
        [HttpPut("{aid}")]
        // GET: ProductMasterController/Edit/5
        public ActionResult Edit(ArticleMaster article,int aid)
        {
            try
            {
                string query = @"Update ArticleMaster set 
                Article_Title ='" + article.ArticleTitle + "', " +
                        "Category_Id = '" + article.CategoryId +
                        "',Section_Id = '" + article.SectionId +
                        "',User_Id = '" + article.Id +
                        "',Reviewer_Id = '" + article.ReviewerId +
                        "',Product_Id = '" + article.ProductId +
                        "',Description = '" + article.ArticleDescription +
                        "',Visibility = '" + article.Visible +
                        "',Status = '" + article.Status +
                        "',CommentAllow = '" + article.CommentAllow +
                        "',Draft = '" + article.Draft +
                        "',Archive = '" + article.Archive +
                        "' where Article_Id = '" + aid + "'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult("Data Updated");
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message); 
            }
        }

        [HttpDelete]
        // GET: ProductMasterController/Delete/5
        public ActionResult Delete(int id)
        {
            try
            {
                string query = @"delete from dbo.ArticleMaster where Article_Id = '" + id + "'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult("Data Deleted");
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }
        [AllowAnonymous]
        [Route("image")]
        [AcceptVerbs("Post")]
        public void SaveImage(IList<IFormFile> UploadFiles)
        {
            try
            {
                foreach (IFormFile file in UploadFiles)
                {
                    if (UploadFiles != null)
                    {
                        string filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        filename = hostingEnv.WebRootPath + "\\Uploads" + $@"\{filename}";

                        // Create a new directory, if it does not exists
                        if (!Directory.Exists(hostingEnv.WebRootPath + "\\Uploads"))
                        {
                            Directory.CreateDirectory(hostingEnv.WebRootPath + "\\Uploads");
                        }

                        if (!System.IO.File.Exists(filename))
                        {
                            using (FileStream fs = System.IO.File.Create(filename))
                            {
                                file.CopyTo(fs);
                                fs.Flush();
                            }
                            Response.StatusCode = 200;
                        }
                    }
                }
            }
            catch (Exception)
            {
                Response.StatusCode = 204;
            }
        }
       

        [AllowAnonymous]
        [HttpPatch("articlepatch/{articleid}/{s}/{d}/{a}")]
        public async Task<IActionResult> articlepatch(string articleid,bool s,bool d,bool a)
        {
            try
            {
                string query = @"Update ArticleMaster set Status ='"+ s +"', Draft = '" + d + "', Archive = '" + a + "' where Article_Id = '" + articleid + "'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult("Data Updated");
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message); ;
            }

        }
        [AllowAnonymous]
        [HttpGet("getarticlecounts")]
        public async Task<IActionResult> getArticleCount()
        {
            try
            {
                string query = @"Select Count(*) from dbo.ArticleMaster";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return Ok(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }
        [AllowAnonymous]
        [HttpGet("usertotalarticle/{uid}")]
        public JsonResult Gettotalarticleuser(string uid)
        {
            try
            {
                string query = @"select count(*) from dbo.ArticleMaster where User_Id = '" + uid + "'";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return new JsonResult(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }
        [AllowAnonymous]
        [HttpGet("userarticlecount/{uid}/{s}/{d}/{a}")]
        public async Task<IActionResult> getArticleCountForUser(string uid,bool s,bool d,bool a)
        {
            try
            {
                string query = @"Select Count(*) from dbo.ArticleMaster where User_Id = '" + uid + "' and Status = '"+s+"' and Draft = '"+d+"' and Archive = '"+a+"' ";
                DataTable table = new DataTable();
                string sqlDataSource = configuration.GetConnectionString("DataConnection");
                SqlDataReader dataReader;
                using (SqlConnection connection = new SqlConnection(sqlDataSource))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        dataReader = command.ExecuteReader();
                        table.Load(dataReader);
                        dataReader.Close();
                        connection.Close();
                    }
                }
                return Ok(table);
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
        }
    }
}
