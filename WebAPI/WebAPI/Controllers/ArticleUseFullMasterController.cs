using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ArticleUseFullMasterController : Controller
    {
        readonly private IConfiguration configuration;
        public ArticleUseFullMasterController(IConfiguration _configuration)
        {
            this.configuration = _configuration;
        }
        [HttpGet]
        // GET: ArticleUseFullMasterController
        public JsonResult Get()
        {
            try
            {
                string query = @"select * from ArticleUsefullMaster";
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
        [Route("likes")]
        [HttpGet]
        // GET: ArticleUseFullMasterController
        public JsonResult GetLikes()
        {
            try
            {
                string query = @"select * from ArticleUsefullMaster where likes = " + true;
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
        [Route("{articleId}")]
        [HttpGet]
        [AllowAnonymous]
        // GET: ArticleUseFullMasterController
        public JsonResult GetLikes(int articleId)
        {
            try
            {
                string query = @"select * from ArticleUsefullMaster where article_id = " + articleId;
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
        [Route("dislikes")]
        [HttpGet]
        // GET: ArticleUseFullMasterController
        public JsonResult GetDislikes()
        {
            try
            {
                string query = @"select * from ArticleUsefullMaster where dislikes = " + true;
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
        [HttpGet("{articleId}/{userId}")]
        // GET: ArticleUseFullMasterController
        public JsonResult GetLikesByArticle(int articleId, string userId)
        {
            try
            {
                string query = @"select * from ArticleUsefullMaster where article_id = '" + articleId + "' and  user_id = '" + userId + "'";
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
        [HttpPost]
        public JsonResult Create(ArticleUsefullMaster model)
        {
            try
            {
                string query = @"insert into ArticleUsefullMaster (article_id,user_id,likes,dislikes) values ('" + model.article_id + "','" + model.user_id + "','" + model.likes + "','" + model.dislikes + "')";
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
        [HttpPut]
        // GET: ProductMasterController/Edit/5
        public ActionResult Edit(ArticleUsefullMaster model)
        {
            try
            {
                string query = @"Update ArticleUsefullMaster set likes = '" + model.likes + "',dislikes = '" + model.dislikes + "' where article_id = '" + model.article_id + "' and user_id = '" + model.user_id + "'";
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
    }
}
