using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ProductMasterController : Controller
    {
        readonly private IConfiguration configuration;
        public ProductMasterController(IConfiguration _configuration)
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
                string query = @"select * from ProductMaster";
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
        [HttpGet("product/{id:int}")]
        // GET: ProductMasterController/Details/5
        public JsonResult Get(int id)
        {
            try
            {
                string query = @"select * from ProductMaster where Product_Id = '" + id + "'";
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

        [HttpGet("user/{Uid}")]
        // GET: ProductMasterController/Details/5
        public JsonResult Get(string Uid)
        {
            try
            {
                string query = @"select * from ProductMaster where User_Id = '" + Uid + "'";
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
        public JsonResult Create(ProductMaster product)
        {
            try
            {
                string query = @"insert into ProductMaster (Product_Name,Product_Description,User_Id) values ('" + product.ProductName + "','" + product.ProductDescription + "','" + product.Id + "')";
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
        public ActionResult Edit(ProductMaster product)
        {
            try
            {
                string query = @"Update ProductMaster set Product_Name ='" + product.ProductName + "', Product_Description = '" + product.ProductDescription + "',User_Id = '" + product.Id + "' where Product_Id = " + product.productId;
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
        public ActionResult Delete(int id)
        {
            try
            {
                string query = @"delete from dbo.ProductMaster where Product_Id = '" + id + "'";
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
        [HttpGet("productcount")]
        public async Task<IActionResult> getProductCount()
        {
            try
            {
                string query = @"Select Count(*) from dbo.ProductMaster";
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
