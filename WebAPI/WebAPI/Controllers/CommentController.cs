using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using WebAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CommentController : ControllerBase
    {
        readonly private IConfiguration configuration;
        public CommentController(IConfiguration _configuration)
        {
            this.configuration = _configuration;
        }
        [AllowAnonymous]
        [HttpGet]
        // GET: ProductMasterController
        public JsonResult Get()
        {
            try
            {
                string query = @"select * from Comment";
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
        [HttpGet("{id:int}")]
        // GET: ProductMasterController/Details/5
        public JsonResult Get(int id)
        {
            try
            {
                string query = @"select * from Comment where Comment_Id = '" + id + "'";
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

        [HttpGet("{Uid}")]
        // GET: ProductMasterController/Details/5
        public JsonResult GetProductByUser(string Uid)
        {
            try
            {
                string query = @"select * from Comment where User_Id = '" + Uid + "'";
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
        [HttpGet("article/{Aid}")]
        // GET: ProductMasterController/Details/5
        public JsonResult GetProductByArticle(int Aid)
        {
            try
            {
                string query = @"select * from Comment where Article_Id = '" + Aid + "'";
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

        [HttpGet("{Aid}/{Uid}")]
        // GET: ProductMasterController/Details/5
        public JsonResult GetProductByArticleAndUser(int Aid,string Uid)
        {
            try
            {
                string query = @"select * from Comment where Article_Id = '" + Aid + "' and User_Id = '" + Uid + "'";
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
        // POST: ProductMasterController/Create
        [HttpPost]
        public JsonResult Create(Comment comment)
        {
            try
            {
                string query = @"insert into Comment (Comment_Text,User_Id,Article_Id) values ('" + comment.Comment_text + "','" + comment.Id + "','" + comment.ArticleId + "')";
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
            catch(Exception e)
            {

                return new JsonResult(e.Message);

            }
        }

        [HttpPut]
        // GET: ProductMasterController/Edit/5
        public JsonResult Edit(Comment comment)
        {
            try
            {
                string query = @"Update Comment set Comment_Texte ='" + comment.Comment_text + "', User_Id = '" + comment.Id + "',Article_Id = '" + comment.ArticleId + "' where Comment_Id = " + comment.Comment_id;
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

        [HttpDelete("{id}")]
        // GET: ProductMasterController/Delete/5
        public JsonResult Delete(int id)
        {
            try
            {
                string query = @"delete from dbo.Comment where Comment_Id = '" + id + "'";
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
    }
}
