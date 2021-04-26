using Microsoft.AspNetCore.Authorization;
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
    [Authorize(Roles = "Admin")]
    public class CategoryMasterController : Controller
    {
        readonly private IConfiguration configuration;
        public CategoryMasterController(IConfiguration _configuration)
        {
            this.configuration = _configuration;
        }
        [AllowAnonymous]
        [HttpGet]
        // GET: CategoryMasterController
        public JsonResult Get()
        {
            try
            {
                string query = @"select * from CategoryMaster";
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
        [HttpGet("Category/{id}")]
        // GET: CategoryMasterController/Category/5
        public JsonResult Get(int id)
        {
            try
            {
                string query = @"select * from CategoryMaster where Category_Id = '" + id + "'";
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

        [HttpGet("user/{uid}")]
        // GET: CategoryMasterController/Category/5
        public JsonResult Get(string uid)
        {
            try
            {
                string query = @"select * from CategoryMaster where User_Id = '" + uid + "'";
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

        // POST: CategoryMasterController/Create
        [HttpPost]
        public JsonResult Create(CategoryMaster cat)
        {
            try
            {
                string query = @"insert into CategoryMaster (Category_Name,Category_Description,User_Id,Product_Id) values ('" + cat.CategoryName + "','" + cat.CategoryDescription + "','" + cat.Id + "','" + cat.ProductId + "')";
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
        // GET: CategoryMasterController/Edit/5
        public ActionResult Edit(CategoryMaster cat)
        {
            string query = @"Update CategoryMaster set Category_Name ='" + cat.CategoryName + "', Category_Description = '" + cat.CategoryDescription + "',Product_Id='" + cat.ProductId + "' where Category_Id = " + cat.CategoryId;
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

        [HttpDelete("{id}")]
        // GET: CategoryMasterController/Delete/5
        public ActionResult Delete(int id)
        {
            string query = @"delete from dbo.CategoryMaster where Category_Id = '" + id + "'";
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
    }
}
