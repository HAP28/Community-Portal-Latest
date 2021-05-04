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
        [HttpGet("visible/{visibility}")]
        public JsonResult GetArticlebyvisible(string visibility)
        {
            try
            {
                string query = @"select * from ArticleMaster where Visibility = '" + visibility + "'";
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

        // status API
        [AllowAnonymous]
        [HttpGet("status/{status}")]
        public JsonResult GetArticlebyStatus(string status)
        {
            try
            {
                string query = @"select * from ArticleMaster where Status = '" + status + "'";
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

        // status API
        [AllowAnonymous]
        [HttpGet("public")]
        public JsonResult GetPublicArticle()
        {
            try
            {
                string query = @"select * from ArticleMaster where Status = '" + true + "' and Visibility = '1'";
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

        // draft API
        [AllowAnonymous]
        [HttpGet("draft")]
        public JsonResult GetArticlebyDraft()
        {
            try
            {
                string query = @"select * from ArticleMaster where Draft = '" + true + "'";
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

        // draft API
        [AllowAnonymous]
        [HttpGet("archive")]
        public JsonResult GetArticlebyArchive()
        {
            try
            {
                string query = @"select * from ArticleMaster where Archive = '" + true + "' and Status = '" + true + "'";
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
                string query = @"insert into ArticleMaster (Article_Title,Category_Id,Section_Id,User_Id,Reviewer_Id,Product_Id,Description,Visibility,Status,CommentAllow,UseFullTotal,UseFullCount,Draft,Archive) values
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
                + article.UseFullTotal + "','"
                + article.UseFullCount + "','"
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
        [HttpPut]
        // GET: ProductMasterController/Edit/5
        public ActionResult Edit(ArticleMaster article)
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
                        "',UseFullTotal = '" + article.UseFullTotal +
                        "',UseFullCount = '" + article.UseFullCount +
                        "',Draft = '" + article.Draft +
                        "',Archive = '" + article.Archive +
                        "' where Article_Id = '" + article.ArticleId + "'";
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
    }
}
